const productsService = require("../service/productsService.js");

//criar produtos
const createProducts = async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryId } = req.body;

  if (!name || !description || !price || !stock || !imageUrl || !categoryId) {
    return res
      .status(400)
      .json({ message: "Preencha todas as informções para proseeguir" });
  }

  const product = await productsService.createProducts({
    name,
    description,
    price,
    stock,
    imageUrl,
    categoryId
  });

  res.status(201).json({ message: "produto criado com sucesso", product });
};

//Listar Produtos
const listProducts = async (req, res) => {
  const products = await productsService.listProducts();

  res.status(201).json({ message: "Produtos encontrados: \n", products });
};

//buscar produto especifico
const getProduct = async (req, res) => {
  const { id } = req.params;

  const product = await productsService.getProduct(id);

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  res.status(201).json({ message: "Produto encontrado", product });
};

//editar produto
const updateProduct = async (req, res) => {
  const { id } = req.params;

  const { name, description, price, stock, imageUrl, categoryId } = req.body;

  const product = await productsService.updateProduct({
    id,
    name,
    description,
    price,
    stock,
    imageUrl,
    categoryId
  });

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado " });
  }

  res.status(200).json({ message: "Produto editado com sucesso", product });
};

//Deletar produto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const produtoExistente = await productsService.deleteProduct(id);

  if (!produtoExistente) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  res.status(201).json({ message: "Produto deletado com sucesso" });
};

module.exports = {
  createProducts,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
