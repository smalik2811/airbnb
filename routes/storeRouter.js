const express = require("express");
const storeController = require("../controller/store");

const storeRouter = express.Router();

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails)
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouritesList);
storeRouter.post("/favourites", storeController.addToFavouritesList)
storeRouter.post("/favourites/delete/:homeId", storeController.removeFromFavouritesList)

module.exports = storeRouter;
