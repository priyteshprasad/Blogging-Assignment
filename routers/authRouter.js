const express = require("express")

const { registerController, loginController, logoutController , emailVerifyController} = require("../controller/authController")

const authRouter= express.Router()
// Routes
authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.post("/logout", logoutController)
authRouter.get("/verify/:token", emailVerifyController)

module.exports = authRouter