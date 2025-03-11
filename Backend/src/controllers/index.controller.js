const postModel = require("../models/post.model")

module.exports.feedController = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .populate("author", "username profileImage")
            .populate("likes", "username profileImage")
            .lean();

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
            username: req.user.username,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
