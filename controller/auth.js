const {check, validationResult} = require("express-validator");
const User = require("../model/User");
const {hash, compare} = require("bcrypt");

exports.getLogin = (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/")
    } else {
        res.render(
            "auth/login",
            {
                pageTitle: "Login",
                activePage: "Login",
                isLoggedIn: false,
            }
        )
    }
}

exports.postLogin = [
    check("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    check("password")
        .isLength({min: 6, max: 30})
        .withMessage("Password must be between 6 and 30 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*().,<>?/:;{}|~`+-=_]/)
        .withMessage("Password must contain at least one special character"),

    (req, res) => {
        const errors = validationResult(req)
        const {email, password} = req.body

        if (!errors.isEmpty()) {
            res.status(422).render("auth/login", {
                pageTitle: "Login",
                activePage: "Long",
                isLoggedIn: false,
                email,
                errors: errors.array().map(err => err.msg)
            })
        } else {
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        return res.status(422).render("auth/login", {
                            pageTitle: "Login",
                            activePage: "Long",
                            isLoggedIn: false,
                            email,
                            errors: ["Invalid email or password"]
                        })
                    } else {
                        compare(password, user.password)
                            .then(isMatch => {
                                if (isMatch) {
                                    req.session.isLoggedIn = true
                                    delete user.password
                                    req.session.user = user
                                    res.redirect("/")
                                } else {
                                    res.status(422).render("auth/login", {
                                        pageTitle: "Login",
                                        activePage: "Long",
                                        isLoggedIn: false,
                                        email,
                                        errors: ["Invalid email or password"]
                                    })
                                }
                            })
                    }
                })
                .catch(err => {
                    console.log("Error while logging in user", err["errorResponse"])
                    res.status(500).render(
                        "auth/login",
                        {
                            pageTitle: "Login",
                            activePage: "Long",
                            isLoggedIn: false,
                            email,
                            errors: [err => err.msg]
                        }
                    )
                })
        }
    }]

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
}

exports.getRegister = (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/")
    } else {
        res.render("auth/register", {
            pageTitle: "Register",
            activePage: "Register",
            isLoggedIn: false
        })
    }
}

exports.postRegister = [
    check("firstName")
        .trim()
        .isLength({min: 2, max: 30})
        .withMessage("First name must be between 2 and 30 characters long")
        .matches(/^[a-zA-Z]+$/)
        .withMessage("First name must contain only letters"),

    check("lastName")
        .trim()
        .isLength({min: 0, max: 30})
        .withMessage("First name must be between 0 and 30 characters long")
        .matches(/^[a-zA-Z]*$/)
        .withMessage("First name must contain only letters"),

    check("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    check("password")
        .isLength({min: 6, max: 30})
        .withMessage("Password must be between 6 and 30 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*().,<>?/:;{}|~`+-=_]/)
        .withMessage("Password must contain at least one special character"),

    check("confirmPassword")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match")
            }
            return true
        }),

    check("role")
        .notEmpty()
        .withMessage("User type is required")
        .isIn(["guest", "host"])
        .withMessage("Invalid user type"),

    check("terms")
        .notEmpty()
        .custom((value) => {
            if (value !== "on") {
                throw new Error("You must accept the terms and conditions to register")
            }
            return true
        }),

    (req, res) => {
        const {firstName, lastName, email, password, role} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log("Errors while registering: ", errors.array())

            res.status(422).render("auth/register", {
                pageTitle: "Register",
                activePage: "Register",
                isLoggedIn: false,
                firstName,
                lastName,
                email,
                role,
                errors: errors.array().map(err => err.msg)
            })
        } else {
            hash(password, 10)
                .then(password => {
                    const user = new User({firstName, lastName, email, password, role})
                    return user.save()
                })
                .then(() => {
                    res.redirect("/login")
                })
                .catch((err) => {
                    console.log("Error while registering user", err)
                    res.status(500).render(
                        "auth/register",
                        {
                            pageTitle: "Register",
                            activePage: "Register",
                            isLoggedIn: false,
                            firstName,
                            lastName,
                            email,
                            role,
                            errors: [err]
                        })
                })
        }
    }
]