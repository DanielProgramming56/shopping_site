const express = require("express")

const route = express.Router()

route.get('/', (req, res) => {
    res.send('These is the category endpoint')
})

module.exports = route