// Project MD Backend
// db.js
// db connection singleton
// (c) 2024 Jeongwoo Kim and his colleagues
const mongoose = require("mongoose");
const asynchandler = require("express-async-handler");
require("dotenv").config();

const connectDB = asynchandler(async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB Connected: ${connect.connection.host}`);
});

module.exports = connectDB;