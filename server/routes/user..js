const express = require("express");
const {verifyIsAdmin, verifyIsLoggedIn} = require("../middleware/verifyAuthToken")
const { writeReview, getUsers, updateUser, deleteUser, updateUserProfile, getUpdatedUserProfile } = require("../controller/user")
const route = express.Router()

// user is logged 

route.use(verifyIsLoggedIn)
route.put("/profile", updateUserProfile)
route.get("/profile", getUpdatedUserProfile)
route.post("/review/:productId", writeReview)

// user is an admin
route.use(verifyIsAdmin)
route.get("/", getUsers)
route.get("/:id", getUsers)
route.put('/:id', updateUser)
route.delete('/:id', deleteUser)

module.exports = route