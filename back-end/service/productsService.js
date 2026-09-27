const prisma = require("../lib/prisma.js");

//criar produto
const createProducts = async ({
  name,
  description,
  price,
  stock,
  imageUrl,
  categoryId,
}) => {
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
    },
  });

  return product;
};

//listar produtos
const listProducts = async () => {
  const listProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      categoryId: true,
    },
  });

  return listProducts;
};

//Buscar produto especifico
const getProduct = async (id) => {
  const detailsProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return detailsProduct;
};

//editar produto
const updateProduct = async ({
  name,
  description,
  price,
  stock,
  imageUrl,
  id,
  categoryId,
}) => {
  const produtoExistente = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!produtoExistente) {
    return null;
  }

  const product = await prisma.product.update({
    where: {
      id,
    },

    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
    },
  });

  return product;
};

//deletar produtos
const deleteProduct = async (id) => {
  const produtoExistente = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!produtoExistente) {
    return null;
  }

  const product = await prisma.product.delete({
    where: {
      id,
    },
  });

  return product;
};

module.exports = {
  createProducts,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
