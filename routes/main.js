// Project Open Standard Web Board Project Backend
// main.js
// (c) 2024 Jeongwoo Kim, based on https://github.com/funnycom/doit-node/tree/main/myBlog
const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const user_login_layout = "../views/layouts/user_login";
const Post = require("../models/Post");
const asynchandler = require("express-async-handler");

router.get(["/", "/home"], 
    asynchandler(async(req, res) => {
        const locals = {
            title: "Home",
        };

        const data = await Post.find({}).sort({updatedAt: "desc", createdAt: "desc"});
        if (req.cookies.token) {
            res.render("index", {locals, data, layout: user_login_layout});
        } else {
            res.render("index", {locals, data, layout: mainLayout});
        }
    })
);

router.get("/about", (req, res) => {
    const locals = {
        title: "About",
    };
    if (req.cookies.token) {
        res.render("about", {locals, layout: user_login_layout});
    } else {
        res.render("about", {locals, layout: mainLayout});   
    }
});

router.get(
    "/post/:id",
    asynchandler(async (req, res) => {
        const data = await Post.findOne({_id: req.params.id});
        if (req.cookies.token) {
            res.render("post", {data, layout: user_login_layout});
        } else {
            res.render("post", {data, layout: mainLayout});
        }
    })
)

module.exports = router;