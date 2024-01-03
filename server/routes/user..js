const express = require("express")

const route = express.Router()

route.get('/', (req, res) => {
    res.send('These is the user endpoint')
})

module.exports = route