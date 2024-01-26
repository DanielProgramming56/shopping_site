const Order = require("../models/Orders")
const mongoose = require("mongoose")

const ObjectId = mongoose.Types.ObjectId
const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: new ObjectId(req.user.id)
        }).orFail()

        if (orders) {
            return res.json(orders)
        }
    } catch (error) {
        next(error)
    }
}

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "-password -isAdmin -_id -__v -createdAt -updatedAt").orFail();
        res.send(order);
    } catch (error) {
        next(error)
    }
}

const createOrder = async (req, res, next) => {
    const { cartItems, orderTotal, paymentMethod } = req.body;
    if (!cartItems || !orderTotal || !paymentMethod) {
        return res.status(400).send("All inputs are required");
    }

    let ids = cartItems.map((item) => {
        return item.productID
    })

    let qty = cartItems.map((item) => {
        return Number(item.quantity);
    })

    await Product.find({ _id: { $in: ids } }).then((products) => {
        products.forEach(function (product, idx) {
            product.sales += qty[idx];
            product.save();
        })
    })

    const order = new Order({
        user: ObjectId(req.user._id),
        orderTotal: orderTotal,
        cartItems: cartItems,
        paymentMethod: paymentMethod,
    })
    const createdOrder = await order.save();
    res.status(201).send(createdOrder);
}

const updateOrderToPaid = async (req, res, next) => {
    try {
        const orders = await Order.findById(req.params.id).orFail()
        orders.isPaid = true;
        orders.paidAt = new Date.now()

        const updatedOrders = await orders.save()
        res.status(200).json(updatedOrders)
    } catch (error) {
        next(error)
    }
}

const updateOrderToDelivered = async (req, res, next) => {
    try {
        const orders = await Order.findById(req.params.id).orFail()
        orders.isDelivered = true;
        orders.deliveredAt = new Date.now()

        const updatedOrders = await orders.save()
        res.status(200).json(updatedOrders)
    } catch (error) {
        next(error)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const order = await Order.find({}).populate('user', '-password').sort({ paymentMethod: 'desc' })
        res.send(order)
    } catch (error) {
        next(error)
    }
}

const getDateAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0)

        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);

        const order = await Order.find({
            createdAt: { $gte: start, $lte: end }
        }).sort({
            createdAt: 'asc'
        })

        res.send(order)
    } catch (error) {

    }

}
module.exports = { getUserOrders, getOrder, createOrder, updateOrderToDelivered, updateOrderToPaid, getOrders, getDateAnalysis }