const express = require("express");
const { CreateUser, Login } = require("../controller/auth");

const route = express.Router();

route.get('/', (req, res) => {
    res.send('These is the auth endpoint')
});

route.post("/sign-up", CreateUser);
route.post("/login", Login);

module.exports = route;