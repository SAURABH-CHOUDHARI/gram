const postModel = require("../models/post.model")
const userModel = require("../models/user.model")
const commentModel = require("../models/comment.model");
const commentLikeModel = require("../models/commentLike.model");
const aiService = require("../services/ai.service")

module.exports.createPostController = async (req, res) => {
    try {
        const userId = req.user._id;
        let { caption } = req.body;

        // Generate a caption if none is provided
        if (!caption && req.file) {
            caption = await aiService.generateCaptionFromImageBuffer(req.file.buffer);
        }

        const newPost = await postModel.create({
            media: req.body.image,
            caption,
            author: userId,
        });

        // Add post to user's list
        await userModel.findByIdAndUpdate(
            userId,
            { $push: { posts: newPost._id } },
            { new: true }
        );

        res.status(201).json({ newPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
module.exports.likePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            await postModel.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            );
            return res.status(200).json({ message: "Post unliked" });
        } else {
            await postModel.findByIdAndUpdate(
                postId,
                { $push: { likes: userId } },
                { new: true }
            );

            return res.status(200).json({ message: "Post liked" });
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports.singlePostController = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: "Post is required" })
        }

        const post = await postModel.findById(postId)
            .populate({
                path: "author",
                select: "username profileImage -_id"
            })
            .populate({
                path: "likes",
                select: "username profileImage -_id"
            })
            .lean();

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await commentModel.find({ post: postId })
            .populate({
                path: "user",
                select: "username profileImage -_id"
            })
            .lean();

        for (let comment of comments) {
            const commentLikes = await commentLikeModel.find({ comment: comment._id })
                .populate("user", "username profileImage")
                .lean();
            comment.likes = commentLikes.length > 0 ? commentLikes.map(like => like.user) : [];
        }

        post.comments = comments;

        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports.deletePostController = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;


        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const post = await postModel.findById(postId);

        


        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.author.equals(userId)) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Find all comments related to the post
        const comments = await commentModel.find({ post: postId });

        // Extract all comment IDs
        const commentIds = comments.map(comment => comment._id);

        // Delete post, comments, and all likes on those comments
        await Promise.all([
            postModel.findByIdAndDelete(postId),               // Delete post
            commentModel.deleteMany({ post: postId }),         // Delete all comments for the post
            commentLikeModel.deleteMany({ comment: { $in: commentIds } }) // Delete all likes on those comments
        ]);

        return res.status(200).json({ message: "Post deleted successfully along with comments and likes" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



