const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    media: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
}, { timestamps: true });

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
