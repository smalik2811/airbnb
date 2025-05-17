const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        required: [true, "First name is required"],
        type: String,
        minlength: [2, "First name must be at least 2 characters long"],
        maxLength: [30, "First name must be at most 30 characters long"],
        match: [/^[a-zA-Z]+$/, "First name must contain only letters"]
    },
    lastName: {
        type: String,
        minLength: [0, "Last name must be at most 30 characters long"],
        maxLength: [30, "Last name must be at most 30 characters long"],
        match: [/^[a-zA-Z]*$/, "Last name must contain only letters"]
    },
    email: {
        required: [true, "Email is required"],
        type: String,
        unique: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please enter a valid email address"]
    },
    password: {
        required: [true, "Password is required"],
        type: String,
        minLength: [60, "Password must be at least 60 characters long"],
        maxLength: [60, "Password must be at most 60 characters long"],
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*().,<>?/:;{}|~`+-=_]).{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"],
    },
    role: {
        type: String,
        required: [true, "User type is required"],
        enum: ["guest", "host"]
    },
    favouriteHomes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home",
            validate: {
                validator: function (array) {
                    console.log("Favourite Homes: ", array)
                    const isValidated = Array.isArray(array) && (new Set(array.map(String)).size === array.length)
                    console.log("Is validated: ", isValidated)
                    return isValidated
                }
            }
        }
    ]
})

module.exports = mongoose.model("User", userSchema)