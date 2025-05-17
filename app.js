const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter")
const errorRouter = require("./routes/errorRouter");
const rootDir = require("./utils/pathUtil");

const app = express();
const PORT = 3000;
const mongoURI = "mongodb://localhost:27017/airbnb"
const store = new MongoDBStore({
    uri: mongoURI,
    collection: "sessions"
})

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
app.use(express.urlencoded());
app.use((req, res, next) => {
    req.isLoggedIn = req?.session?.isLoggedIn
    next()
})

app.use(storeRouter);
app.use("/host", (req, res, next) => {
    console.log("User loggedin: ",req.isLoggedIn)
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
