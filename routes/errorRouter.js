const express = require("express")
const errorController = require("../controller/error")

const errorRouter = express.Router()

errorRouter.use(errorController.error404)

module.exports = errorRouter