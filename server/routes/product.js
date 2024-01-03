const express = require("express")
const { getAllProducts, createProduct, getDiscountProducts } = require("../controller/product")
const route = express.Router()

route.get('/products', getAllProducts);
route.get("/category/:categoryName", getAllProducts);
route.post("/new-products", createProduct);
route.get("/discount", getDiscountProducts)
module.exports = route