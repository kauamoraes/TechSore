const categories = require("../service/categoriesService.js");

//criar categorias
const createCategories = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "A categoria não pode ser vazia",
    });
  }

  const categoria = await categories.createCategories({
    name,
  });

  return res.status(201).json({
    message: "Categoria criada com sucesso",
    categoria,
  });
};

//listar categorias
const listCategories = async (req, res) => {
  const listCategories = await categories.listCategories();

  if (listCategories.length === 0) {
    return res.status(200).json({ message: "Nenhuma categoria encontrada" });
  }

  return res
    .status(200)
    .json({ message: "Categorias encontradas", listCategories });
};

//deletar categoria
const deleteCategories = async (req, res) => {
  const { id } = req.params;

  const categorie = await categories.deleteCategories({
    id,
  });

  if (!categorie) {
    return res.status(404).json({ message: "Categoria não encontrada" });
  }

  return res
    .status(200)
    .json({ message: "Categoria apagada com sucesso", categorie });
};

module.exports = { createCategories, listCategories, deleteCategories };
