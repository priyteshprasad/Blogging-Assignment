const express = require("express")

const { registerController, loginController, logoutController } = require("../controller/authController")

const authRouter= express.Router()
// Routes
authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.post("/logout", logoutController)

module.exports = authRouter