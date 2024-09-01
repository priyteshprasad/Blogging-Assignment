const express = require("express")

const { registerController, loginController } = require("../controller/authController")

const authRouter= express.Router()
// Routes
authRouter.post("/register", registerController)
authRouter.post("/login", loginController)

module.exports = authRouter