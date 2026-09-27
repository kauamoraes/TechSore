const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const authenticateToken = require("./middleware/middleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const ProductsRoutes = require("./routes/productsRoutes.js")

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//Register User/Login
app.use(userRoutes);
app.use(authRoutes);
app.use(ProductsRoutes);

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

//criar categorias
app.post("/categories", async (req, res) => {
  const { name } = req.body

  if(!name){
    return res.status(400).json({ message: "A categoria não pode ser vazia" })
  }

  const categoria = await prisma.category.create({
    data: {
      name
    }
  })

  res.status(201).json({ message: "categoria criada com sucesso", categoria })
})

//listar categorias
app.get("/categories", async (req, res) => {
  const listCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true
    }
  })

  return res.status(200).json({ message: "Categorias encontradas", listCategories })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
