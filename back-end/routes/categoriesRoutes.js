const express = require("express")
const router = express.Router()
const categories = require("../controller/categoriesController")

//criar categorias
router.post("/categories", categories.createCategories)

//listar categorias
router.get("/categories", categories.listCategories)

//deletar categorias
router.delete("/categories/:id", categories.deleteCategories)


module.exports = router