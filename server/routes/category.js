const express = require("express")
const { newCategory, getCategories, saveAttr, deleteCategory } = require("../controller/category")
const { verifyIsAdmin, verifyIsLoggedIn } = require("../middleware/verifyAuthToken")
const route = express.Router()

route.use(verifyIsLoggedIn)
route.use(verifyIsAdmin)
route.get('/', getCategories)
route.post("/", newCategory)
route.delete("/", deleteCategory)
route.post("/save-attr/", saveAttr)

module.exports = route