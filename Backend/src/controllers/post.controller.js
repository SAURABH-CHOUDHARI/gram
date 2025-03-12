const postModel = require("../models/post.model")
const userModel = require("../models/user.model")
const commentModel = require("../models/comment.model");
const commentLikeModel = require("../models/commentLike.model");

module.exports.createPostController = async (req, res) => {
    try {

        const { caption } = req.body
        const userId = req.user._id
        if (!caption) {
            return res.status(400).json({ message: "caption is required" })
        }
        const newPost = await postModel.create({
            media: req.body.image,
            caption,
            author: userId,
        })
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                $push: { posts: newPost._id }
            },
            { new: true }
        );


        res.status(201).json({ newPost })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
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



