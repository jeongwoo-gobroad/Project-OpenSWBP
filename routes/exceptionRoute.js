// Project Open Standard Web Board Project Backend
// exceptionRoute.js
// (c) 2024 Jeongwoo Kim, based on https://github.com/funnycom/doit-node/tree/main/myBlog
const express = require("express");
const router = express.Router();
const user_nologin_layout = "../views/layouts/user_nologin";
const user_login_layout = "../views/layouts/user_login";
const asyncHandler = require("express-async-handler");

router.get(
    "/errorOccured",
    (req, res) => {
        const locals = {
            title: "Error occured",
        };

        if (req.session.user) {
            res.render("errors/errorOccured", {locals, user: req.session.user, layout: user_login_layout});
        } else {
            res.render("errors/errorOccured", {locals, layout: user_nologin_layout});
        }
    }
);

module.exports = router;