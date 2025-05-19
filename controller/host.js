const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Home = require("../model/Home");
const mainPath = require("../utils/pathUtil");

exports.getAddHome = (req, res) => {
    res.render("./host/edit-home", {
        pageTitle: "Add Home to AirBnB",
        activePage: "Add Home",
        editing: false,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};

exports.postAddHome = (req, res) => {
    const {houseName, pricePerNight, location} = req.body;
    const photo = req.file ? req.file.path : null;

    const home = new Home({
        houseName: houseName,
        pricePerNight: Number(pricePerNight),
        location: location,
        photo: photo
    });

    home.save()
        .then(() => {
            console.log("Home created successfully")
        })
        .catch(err => {
            console.log("Error while creating home", err["errorResponse"])
        })
        .finally(() => {
            res.redirect("/host/homes")
        })
};

exports.getHomes = (req, res) => {
    Home.find()
        .then(homes => {
            res.render("./host/home-list", {
                homeListings: homes,
                pageTitle: "Homes List",
                activePage: "HostHomes",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            });
        })
        .catch(err => {
            console.log("Error while fetching homes", err["errorResponse"])
            res.render("/host/home-list", {
                homeListings: [],
                pageTitle: "Homes List",
                activePage: "HostHomes",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            })
        })
};

exports.getEditHome = (req, res) => {
    const homeId = req.params["homeId"]
    const editing = req.query["editing"] === "true"

    Home.findById(homeId)
        .then(home => {
            if (home) {
                res.render("./host/edit-home", {
                    property: home,
                    pageTitle: "Edit Your Home",
                    activePage: "Add Home",
                    editing: editing,
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user
                });
            } else {
                console.log("Home not found")
                res.redirect("/host/homes")
            }
        })
        .catch(err => {
            console.log("Error while fetching homes", err["errorResponse"])
            res.redirect("/host/homes")
        })
}

exports.postEditHome = (req, res) => {
    const {id, houseName, pricePerNight, location} = req.body;

    Home.findById(id)
        .then(home => {
            if (home !== null) {
                home.houseName = houseName;
                home.pricePerNight = Number(pricePerNight);
                home.location = location;

                if (req.file) {
                    const existingFile = home.photo
                    const fullPath = path.join(mainPath, existingFile)
                    const doesFileExist = fs.existsSync(fullPath)

                    if (doesFileExist) {
                        fs.unlinkSync(fullPath)
                    }

                    home.photo = req.file.path;
                }

                return home.save()
                    .then(() => {
                        console.log("Home updated successfully")
                    })
                    .catch(err => {
                        console.log("Error while updating home", err["errorResponse"])
                    })
            } else {
                console.log("Home not found")
            }
        })
        .catch(err => {
            console.log("Error while fetching home", err["errorResponse"])
        })
        .finally(() => {
            res.redirect("/host/homes")
        })
}

exports.deleteHome = async (req, res) => {
    try {
        const homeId = req.params["homeId"];
        const home = await Home.findById(homeId);

        if (!home) {
            console.log("Home not found");
            return res.redirect("/host/homes");
        }

        // Delete the home from database
        await Home.findByIdAndDelete(homeId);
        console.log("Home deleted successfully");

        // Delete the associated photo if it exists
        if (home.photo) {
            const fullPath = path.join(mainPath, home.photo);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
    } catch (err) {
        console.log("Error while deleting home", err["errorResponse"] || err);
    } finally {
        res.redirect("/host/homes");
    }
};