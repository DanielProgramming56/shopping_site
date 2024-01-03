const express = require("express");
const user = require("../user.")
const order = require("../orders")
const product = require("../product")
const category = require("../category")
const auth = require("../auth")
const app = express()


app.use("/user", user)
app.use("/order", order)
app.use("/product", product)
app.use("/category", category)
app.use("/auth", auth)

module.exports = app