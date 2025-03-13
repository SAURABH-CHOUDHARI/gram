const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "text Must be atleast 1 character"],
            maxLength: [1000, "Text Must be At most 1000 characters"]
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
