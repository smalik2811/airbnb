const mongoose = require("mongoose");

const home = new mongoose.Schema({
    houseName: {
        type: String,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    }
})

module.exports = mongoose.model("Home", home)