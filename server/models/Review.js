const mongoose = require("mongoose")

const ReviewSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true
    },
    User: {
        _id: mongoose.Schema.ObjectId,
        name: String,
    }
}, { timestamps: true })

const Reviews = mongoose.model('Review', ReviewSchema);

module.exports = Reviews