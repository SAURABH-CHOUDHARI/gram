const postModel = require("../models/post.model")
const userModel = require("../models/user.model")

module.exports.createPostController = async (req, res) => {
    const {  caption } = req.body
    const userId = req.user._id
    if (!caption) {
        return res.status(400).json({ message: "caption is required" })
    }
    const newPost = await postModel.create({
        media: req.body.image,
        caption,
        author:userId,
    })
    const user = await userModel.findByIdAndUpdate(req.user.id, {
        $push: {
            posts: newPost._id
        }
    })


    res.status(201).json({ newPost })
}
module.exports.likePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        const post = await postModel.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked =  post.likes.includes(userId);
        
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
