const mongoose = require("mongoose");

const commentLikeSchema = new mongoose.Schema({
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "comment", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
}, { timestamps: true });

const commentLikeModel = mongoose.model("commentLike", commentLikeSchema);
module.exports = commentLikeModel;
