const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    zipCode: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User

