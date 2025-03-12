const commentModel = require("../models/comment.model");
const commentLikeModel = require("../models/commentLike.model");


module.exports.create = async (req, res) => {
    try {

        const { comment, postId } = req.body
        const userId = req.user._id

        if (!postId) {
            return res.status(400).json({ message: "post is required" })
        }

        if (!comment) {
            return res.status(400).json({ message: "caption is required" })
        }

        const newCommment = await commentModel.create({
            user: userId,
            post: postId,
            comment
        })

        res.status(201).json({ newCommment })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}
module.exports.like = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.user._id;

        if (!commentId) {
            return res.status(400).json({ message: "comment is required" });
        }

        const existingLike = await commentLikeModel.findOne({
            comment: commentId,
            user: userId,
        });

        if (existingLike) {
            await commentLikeModel.findByIdAndDelete(existingLike._id);
            return res.status(200).json({ message: "Unliked the comment" });
        }

        const like = await commentLikeModel.create({
            comment: commentId,
            user: userId,
        });

        res.status(201).json({ message: "Liked the comment", like });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
module.exports.delete = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.user._id;

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!comment.user.equals(userId)) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await Promise.all([
            commentModel.findByIdAndDelete(commentId), 
            commentLikeModel.deleteMany({ comment: commentId }),
        ]);

        return res.status(200).json({ message: "Comment and related data deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
