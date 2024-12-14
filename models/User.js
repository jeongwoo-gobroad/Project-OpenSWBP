// Project MD Backend
// User.js
// user schema
// (c) 2024 Jeongwoo Kim and his colleagues
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("User", UserSchema);