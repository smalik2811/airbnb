const express = require("express");
const authController = require("../controller/auth");

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin)
authRouter.post("/logout", authController.postLogout)
authRouter.get("/register", authController.getRegister)
authRouter.post("/register", authController.postRegister)

module.exports = authRouter;
