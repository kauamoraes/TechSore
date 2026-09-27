const express = require("express")
const router = express.Router()
const productsController = require("../controller/productsController.js")

//criar produto
router.post("/products", productsController.createProducts)

//listar produtos
router.get("/products", productsController.listProducts)

//Procurar produto especifico
router.get("/products/:id", productsController.getProduct)

//Editar produto
router.put("/products/:id", productsController.updateProduct)

//deletar produto
router.delete("/products/:id", productsController.deleteProduct)


module.exports = router