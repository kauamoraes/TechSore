const prisma = require("../lib/prisma.js");

//criar categoria
const createCategories = async ({ name }) => {
  if (!name) {
    return null;
  }

  const categoria = await prisma.category.create({
    data: {
      name,
    },
  });

  return categoria
};

//lista categorias
const listCategories = async () => {
  const listCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return listCategories;
};

//delete categorie
const deleteCategories = async ({ id }) => {
  const exixtingCategorie = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!exixtingCategorie) {
    return null;
  }

  const categorie = await prisma.category.delete({
    where: {
      id,
    },
  });

  return categorie
};

module.exports = { createCategories, listCategories, deleteCategories };
