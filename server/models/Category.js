const mongoose = require("mongoose")

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Number,
        required: true
    },
    attrs: [{
        key: { type: String },
        value: [{ type: String }]
    }]
}, { timestamps: true })

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;