const express = require('express')
const router = express.Router()
const { verifyIsLoggedIn, verifyIsAdmin } = require('../middleware/verifyAuthToken')
const { getUserOrders, getOrder, createOrder, updateOrderToPaid, updateOrderToDelivered, getOrders, getDateAnalysis } = require("../controller/order")

// user routes
router.use(verifyIsLoggedIn)
router.get("/", getUserOrders)
router.get("/user/:id", getOrder);
router.post("/", createOrder);
router.put("/paid/:id", updateOrderToPaid);
router.put("/deliver/:id", updateOrderToDelivered);
router.get("/admin", getOrders)
router.get("/analysis/:date", getDateAnalysis )

// admin routes
router.use(verifyIsAdmin)

module.exports = router