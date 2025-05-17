const Home = require("../model/Home");

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
    const {id, houseName, pricePerNight, location, photo} = req.body;

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
    const {id, houseName, pricePerNight, location, photo} = req.body;

    Home.findById(id)
        .then(home => {
            if (home !== null) {
                home.houseName = houseName;
                home.pricePerNight = Number(pricePerNight);
                home.location = location;
                home.photo = photo;
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

exports.deleteHome = (req, res) => {
    const homeId = req.params["homeId"]

    Home.findByIdAndDelete(homeId)
        .then(() => {
            console.log("Home deleted successfully")
        })
        .catch(err => {
            console.log("Error while deleting home", err["errorResponse"])
        })
        .finally(() => {
                res.redirect("/host/homes")
            }
        )
}