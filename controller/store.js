const Home = require("../model/Home");
const User = require("../model/User");
const mongoose = require("mongoose");

exports.getIndex = (req, res) => {
    Home.find()
        .then(listedProperties => {
            res.render("./store/index", {
                homeListings: listedProperties,
                pageTitle: "AirBnB Home",
                activePage: "Index",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            });
        })
        .catch(err => {
            console.log("Error while fetching homes", err["errorResponse"])
            res.render("./store/index", {
                homeListings: [],
                pageTitle: "AirBnB Home",
                activePage: "Index",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            })
        })
};

exports.getHomes = (req, res) => {
    Home.find()
        .then(listedProperties => {
            res.render("./store/home-list", {
                homeListings: listedProperties,
                pageTitle: "Homes List",
                activePage: "Home",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            });
        })
        .catch(err => {
            console.log("Error while fetching homes", err["errorResponse"])
            res.render("./store/home-list", {
                homeListings: [],
                pageTitle: "Homes List",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,
            })
        })
};

exports.getHomeDetails = (req, res) => {
    const homeId = req.params["homeId"]

    Home.findById(homeId)
        .then(home => {
            if (home) {
                res.render("./store/home-details", {
                    property: home,
                    pageTitle: "Homes Details",
                    activePage: "HomeDetails",
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
                });
            } else {
                res.redirect("/homes");
            }
        })
        .catch(err => {
            console.log("Error while fetching home", err["errorResponse"])
            res.redirect("/homes")
        })
};

exports.getBookings = (req, res) => {
    res.render("./store/bookings", {
        pageTitle: "My Bookings",
        activePage: "Bookings",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};

exports.getFavouritesList = (req, res) => {
    const userId = req.session.user._id

    User.findById(userId)
        .then(user => {
            return user.populate("favouriteHomes")
        })
        .then(user => {
            res.render(
                "./store/favourites-list",
                {
                    pageTitle: "My Favourites",
                    activePage: "Favourites",
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
                    favouriteHomes: user.favouriteHomes
                }
            )
        })
        .catch(err => {
            console.log("Error while fetching favourites", err["errorResponse"])
            res.render(
                "./store/favourites-list",
                {
                    pageTitle: "My Favourites",
                    activePage: "Favourites",
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
                    favouriteHomes: []
                }
            )
        })
};

exports.addToFavouritesList = (req, res) => {
    const homeId = new mongoose.Types.ObjectId(req.body.homeId)
    const userId = req.session.user._id

    User.findById(userId)
        .then(user => {
            user.favouriteHomes.push(homeId)
            return user.save()
        })
        .then(() => {
            console.log("Home added to favourites")
        })
        .catch(err => {
            console.log("Error while saving favourite", err["errorResponse"])
        })
        .finally(() => {
            res.redirect("/favourites");
        })
}

exports.removeFromFavouritesList = (req, res) => {
    const homeId = req.params["homeId"]
    const userId = req.session.user._id

    User.findById(userId)
        .then(user => {
            const homeIndex = user.favouriteHomes.findIndex(favouriteHome => favouriteHome.toString() === homeId)
            if (homeIndex === -1) user.favouriteHomes.splice(homeIndex, 1)
            return user.save()
        })
        .then(() => {
            console.log("Home removed from favourites")
        })
        .catch(err => {
            console.log("Error while removing home from favourites", err["errorResponse"])
        })
        .finally(() => {
            res.redirect("/favourites");
        })
}