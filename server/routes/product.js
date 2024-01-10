const express = require("express")
const { getAllProducts, createProduct, getDiscountProducts, getProductsById, getBestSellers, getProductForAdmin, deleteProductByAdmin, updateProduct, uploadImage, deleteProductImage } = require("../controller/product")
const route = express.Router()

route.get('/products', getAllProducts);
route.get("/category/:categoryName", getAllProducts);
route.post("/new-products", createProduct);
route.get("/discount", getDiscountProducts)
route.get("/:id", getProductsById)
route.get("/search/:searchQuery", getAllProducts)
route.get("/category/:categoryName/search/:searchQuery", getAllProducts)
route.get("/best/seller", getBestSellers)
route.get('/data/admin/', getProductForAdmin)
route.delete('/:id', deleteProductByAdmin)
route.patch("/admin/update/:id/", updateProduct)
route.post("/admin/image/:productId", uploadImage)
route.delete('/admin/image/:imagePath/:productId/', deleteProductImage)
module.exports = route