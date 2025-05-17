const express = require("express");
const hostController = require("../controller/host");
const hostRouter = express.Router();

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/homes", hostController.getHomes)
hostRouter.get("/edit-home/:homeId", hostController.getEditHome)
hostRouter.post("/edit-home", hostController.postEditHome)
hostRouter.post("/delete-home/:homeId", hostController.deleteHome)

module.exports = hostRouter;
