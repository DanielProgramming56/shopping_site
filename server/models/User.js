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
    phoneNumber: String,
    address: String,
    country: String,
    zipCode: String,
    city: String,
    state: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User

