const mongoose = require("mongoose");
const Reviews = require("./Review")
const ImageSchema = mongoose.Schema({
    path: { type: String, required: true }
})

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewsNumber: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    attrs: [
        { key: { type: String }, value: { type: String } }
    ],
    images: [ImageSchema],
    discount: [
        {
            type: String,
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: Reviews
        }
    ]
}, {
    timestamps: true,
})

ProductSchema.index()
const Product = mongoose.model("Product", ProductSchema)
ProductSchema.index({ name: "text", description: "text" }, { name: "textIndex" })
ProductSchema.index({ "attrs.key": 1, "attrs.value": 1 })

module.exports = Product