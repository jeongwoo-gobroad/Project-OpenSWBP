// Project Open Standard Web Board Project Backend
// app.js
// (c) 2024 Jeongwoo Kim, based on https://github.com/funnycom/doit-node/tree/main/myBlog
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", require("./routes/main"));
app.use("/", require("./routes/users"))

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})