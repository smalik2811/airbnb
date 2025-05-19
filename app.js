const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");

const MongoDBStore = require("connect-mongodb-session")(session);

const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter")
const errorRouter = require("./routes/errorRouter");
const rootDir = require("./utils/pathUtil");
const randomString = require("./utils/randomUtil");

const app = express();
const PORT = 3000;
const mongoURI = "mongodb://localhost:27017/airbnb"
const store = new MongoDBStore({
    uri: mongoURI,
    collection: "sessions"
})
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, randomString(26) + "-" + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    console.log("File type: ", file.mimetype)
    if (["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const multerOptions = {
    storage,
    fileFilter
}

app.set("view engine", "ejs");
app.set("views", "views");
app.use(session({
    secret: "SomeReallyRandomSecretKey",
    resave: false,
    saveUninitialized: true,
    store: store
}))

app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}]: ${req.method} method -- ${req.url}`
    );
    next();
});

app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")))
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")))
app.use("/host/edit-home/uploads", express.static(path.join(rootDir, "uploads")))
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")))

app.use(express.urlencoded());
app.use(multer(multerOptions).single("photo"))
app.use((req, res, next) => {
    req.isLoggedIn = req?.session?.isLoggedIn
    next()
})

app.use(storeRouter);
app.use("/host", (req, res, next) => {
    console.log("User loggedin: ", req.isLoggedIn)
    if (req.isLoggedIn) {
        next();
    } else {
        res.redirect("/login")
    }
})
app.use("/host", hostRouter);
app.use(authRouter);
app.use(errorRouter);

mongoose.connect(mongoURI).then(r => {
    console.log("Connected to database")
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
})
    .catch(err => {
        console.log("Error connecting to database", err["errorResponse"])
    })
