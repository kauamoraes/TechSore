const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const authenticateToken = require("./middleware/middleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const ProductsRoutes = require("./routes/productsRoutes.js");
const categoriesRoutes = require("./routes/categoriesRoutes.js");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//Register User/Login
app.use(userRoutes);
app.use(authRoutes);
app.use(ProductsRoutes);
app.use(categoriesRoutes);

//rota teste de middleware
app.get("/profile", authenticateToken, adminMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// Cria um pedido para o usuário autenticado.
app.post("/orders", authenticateToken, async (req, res) => {
  // Recebe somente os produtos e as quantidades; preços e total são calculados no servidor.
  const items = req.body?.items;

  // Garante que o pedido tenha ao menos um item válido.
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.some(
      (item) =>
        !item ||
        typeof item.productId !== "string" ||
        item.productId.trim() === "" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0,
    )
  ) {
    return res.status(400).json({
      message:
        "Informe uma lista de produtos com quantidades inteiras positivas.",
    });
  }

  try {
    // Mantém a criação do pedido, dos itens e a baixa de estoque em uma única transação.
    const order = await prisma.$transaction(async (transaction) => {
      const productIds = [...new Set(items.map((item) => item.productId))];

      // Busca os preços atuais e verifica se todos os produtos ainda existem.
      const products = await transaction.product.findMany({
        where: {
          id: { in: productIds },
        },
      });
      const productsById = new Map(
        products.map((product) => [product.id, product]),
      );

      for (const productId of productIds) {
        if (!productsById.has(productId)) {
          const error = new Error("Produto não encontrado");
          error.status = 404;
          throw error;
        }
      }

      // Soma quantidades repetidas para validar e baixar o estoque corretamente.
      const quantitiesByProductId = new Map();
      for (const item of items) {
        const quantity = quantitiesByProductId.get(item.productId) || 0;
        quantitiesByProductId.set(item.productId, quantity + item.quantity);
      }

      // Reserva o estoque com uma condição atômica para evitar vendas acima do disponível.
      for (const [productId, quantity] of quantitiesByProductId) {
        const stockUpdate = await transaction.product.updateMany({
          where: {
            id: productId,
            stock: { gte: quantity },
          },
          data: {
            stock: { decrement: quantity },
          },
        });

        if (stockUpdate.count === 0) {
          const error = new Error("Estoque insuficiente");
          error.status = 409;
          throw error;
        }
      }

      // Calcula o total usando o preço cadastrado de cada produto.
      const total = items.reduce((sum, item) => {
        const product = productsById.get(item.productId);
        return sum + product.price * item.quantity;
      }, 0);

      // Cria o pedido e seus itens relacionados com os preços aplicados no momento da compra.
      return transaction.order.create({
        data: {
          userId: req.user.userId,
          total,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              price: productsById.get(item.productId).price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    // Informa que o pedido foi criado e devolve os dados persistidos.
    return res.status(201).json(order);
  } catch (error) {
    // Erros esperados de validação de produto/estoque são retornados sem ocultar falhas inesperadas.
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    console.error("Erro ao criar pedido:", error);
    return res
      .status(500)
      .json({ message: "Não foi possível criar o pedido." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
