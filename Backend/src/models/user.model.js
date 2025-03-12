const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('../config/config');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [20, "Username must be at most 20 characters long"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [5, "Email must be at least 5 characters long"],
        maxLength: [50, "Email must be at most 50 characters long"]
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Heyy! I'm new here! 🤩"
    },
    profileImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1739772542563-b592f172282f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
}, { timestamps: true });

userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
    }, config.JWT_KEY);
};

userSchema.statics.verifyToken = function (token) {
    return jwt.verify(token, config.JWT_KEY);
};

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


userSchema.statics.findByEmailOrUsername = async function (email, username) {
    return await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
