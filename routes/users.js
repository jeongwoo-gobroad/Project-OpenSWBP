// Project Open Standard Web Board Project Backend
// users.js
// (c) 2024 Jeongwoo Kim, based on https://github.com/funnycom/doit-node/tree/main/myBlog
const express = require("express");
const router = express.Router();
const user_nologin_layout = "../views/layouts/user_nologin";
const user_login_layout = "../views/layouts/user_login";
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.redirect("/login");
    }
};

router.get(
    "/login", 
    (req, res) => {
        const locals = {
            title: "Login Page",
        };

        res.render("users/login", {locals, error: req.session.error, layout: user_nologin_layout});
        req.session.error = null;
    }
);

router.get(
    "/register",
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Registration Page",
        };

        res.render("users/register", {locals, layout: user_nologin_layout});
    })
);

router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const {username, password} = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            req.session.error = 'Invalid username or password';
            res.redirect("/login");
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            req.session.error = 'Invalid username or password';
            res.redirect("/login");
            return;
        }

        const token = jwt.sign({id: user._id}, jwtSecret);

        req.session.user = user;

        res.cookie("token", token, {httpOnly: true});

        res.redirect("/allPosts");
    })
);

router.post('/checkUserID', async (req, res) => {
    const {username} = req.body;

    //console.log(req.body);

    try {
        const existingUser = await User.findOne({username: username});

        //console.log(existingUser);

        if (existingUser) {
            return res.json({exists: true});
        }
        res.json({exists: false});
    } catch (error) {
        console.log("error occured at checkUserID");
        res.status(500).send('Server error occured');
    }
});

router.post(
    "/register",
    asyncHandler(async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        try {
            const user = await User.create({
                username: req.body.username,
                nickname: req.body.usernick,
                password: hashedPassword,
            });
            const locals = {
                title: "Account Created",
            };
    
            res.render("users/accountCreated", {locals, layout: user_nologin_layout});
        } catch (error) {
            res.redirect("/register");
        }
    })
);

router.get(
    "/allPosts",
    checkLogin,
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Posts",
        };
        
        const token = req.cookies.token;
        let userid;

        try {
            const decoded = jwt.verify(token, jwtSecret);
            // console.log(decoded.id);
            userid = decoded.id;
        } catch (error) {
            res.redirect("/login");
        }

        const data = await Post.find().sort({updatedAt: "desc", createdAt: "desc"});

        const user = req.session.user;

        res.render("users/allPosts", {
            locals,
            userid,
            data,
            user,
            layout: user_login_layout,
        });
    })
);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.session.destroy();
    res.redirect("/");
});


router.get(
    "/add",
    checkLogin,
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Adding new post",
        };
        const user = req.session.user;
        res.render("users/addPost", {
            locals,
            user,
            layout: user_login_layout,
        });
    })
);

router.post(
    "/add",
    checkLogin,
    asyncHandler(async (req, res) => {
        const {title, body} = req.body;

        const token = req.cookies.token;
        let userid;

        try {
            const decoded = jwt.verify(token, jwtSecret);
            // console.log(decoded.id);
            userid = decoded.id;
        } catch (error) {
            return res.redirect("/login");
        }

        const newPost = new Post({
            title: title,
            userid: userid,
            body: body,
        });

        await Post.create(newPost);

        res.redirect("/allPosts");
    })
);

router.get(
    "/edit/:id",
    checkLogin,
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Editing a post",
        };

        const data = await Post.findOne({_id: req.params.id});

        const token = req.cookies.token;
        let userid;

        try {
            const decoded = jwt.verify(token, jwtSecret);
            // console.log(decoded.id);
            userid = decoded.id;
        } catch (error) {
            return res.redirect("/login");
        }

        if (userid != data.userid) {
            return res.redirect("/allPosts");
        }
        const user = req.session.user;
        res.render("admin/edit", {
            locals,
            data,
            user,
            layout: user_login_layout
        });
    })
);

router.put(
    "/edit/:id",
    checkLogin,
    asyncHandler(async (req, res) => {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            createdAt: Date.now(),
        });
        res.redirect("/allPosts");
    })
);

router.delete(
    "/delete/:id",
    checkLogin,
    asyncHandler(async (req, res) => {
        const token = req.cookies.token;
        let userid;

        const data = await Post.findOne({_id: req.params.id});

        try {
            const decoded = jwt.verify(token, jwtSecret);
            // console.log(decoded.id);
            userid = decoded.id;
        } catch (error) {
            return res.redirect("/login");
        }

        if (userid != data.userid) {
            return res.redirect("/allPosts");
        }

        await Post.deleteOne({ _id: req.params.id });
        res.redirect("/allPosts");
    })
);

router.get(
    "/myPosts",
    checkLogin,
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Posts",
        };
        
        const token = req.cookies.token;
        let userid;

        try {
            const decoded = jwt.verify(token, jwtSecret);
            // console.log(decoded.id);
            userid = decoded.id;
        } catch (error) {
            res.redirect("/login");
        }

        const data = await Post.findAll({
            userid: userid
        }).sort({updatedAt: "desc", createdAt: "desc"});

        const user = req.session.user;

        res.render("users/myPosts", {
            locals,
            userid,
            data,
            user,
            layout: user_login_layout,
        });
    })
);

module.exports = router;