const userModel = require("../models/user.model")
const userService = require("../services/user.service")
const redis = require("../services/redis.service");
const messageModel = require("../models/message.model")


module.exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const user = await userService.createUser({ username, email, password });
        const token = user.generateToken()

        return res.status(201).json({ token, user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}
module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        const isUserExist = await userService.loginUser({ email, password })

        const token = isUserExist.generateToken()

        return res.status(200).json({ token, isUserExist })
    } catch (err) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }
}
module.exports.profileController = async (req, res) => {
    try {
        const profile = await userModel
            .findById(req.user._id)
            .populate({
                path: "posts", // Populate posts
                populate: {
                    path: "likes", // Populate likes inside posts
                    model: "user", // Ensure it's fetching from the 'user' collection
                    select: "username profileImage -_id", // Select only necessary fields
                },
            })
            .populate({
                path: "followers", // Populate followers
                model: "user",
                select: "username profileImage -_id",
            })
            .populate({
                path: "following", // Populate following
                model: "user",
                select: "username profileImage -_id",
            })
            .select('-password -email -_id -__v')
            .lean();

        if (!profile) {
            return res.status(400).json({ message: "User does not exist" });
        }

        res.json(profile);
    } catch (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports.search = async (req, res) => {
    try {
        const foundUsers = await userModel.find({
            username: { $regex: `^${req.query.query}`, $options: "i" } // Case-insensitive prefix match
        }).select("username profileImage -_id").lean();

        res.send(foundUsers);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
module.exports.getSearchedProfile = async (req, res) => {
    try {
        if (!req.body.username) {
            return res.status(400).json({ message: "user id is required" })
        }

        const user = await userModel
            .findOne({ username: req.body.username })
            .populate({
                path: "posts", // Populate posts
                populate: {
                    path: "likes", // Populate likes inside posts
                    model: "user", // Ensure it's fetching from the 'user' collection
                    select: "username profileImage -_id", // Select only necessary fields
                },
            })
            .populate({
                path: "followers", // Populate followers
                model: "user",
                select: "username profileImage -_id",
            })
            .populate({
                path: "following", // Populate following
                model: "user",
                select: "username profileImage -_id",
            })
            .select('-password -email -_id -__v')
            .lean();


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user, name: req.user.username });
    } catch (error) {
        console.error("Error fetching searched profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports.toggleFollow = async (req, res) => {
    try {
        const { username } = req.body; // The username sent from frontend
        const loggedInUserId = req.user._id; // Logged-in user ID

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Find the target user by username
        const targetUser = await userModel.findOne({ username });

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const targetUserId = targetUser._id.toString(); // Convert to string for safety

        if (targetUserId === loggedInUserId) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
        }

        // Check if already following
        const loggedInUser = await userModel.findById(loggedInUserId);
        const isFollowing = loggedInUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow: Remove from both users' lists
            await userModel.findByIdAndUpdate(loggedInUserId, { $pull: { following: targetUserId } });
            await userModel.findByIdAndUpdate(targetUserId, { $pull: { followers: loggedInUserId } });

            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            // Follow: Add to both users' lists
            await userModel.findByIdAndUpdate(loggedInUserId, { $push: { following: targetUserId } });
            await userModel.findByIdAndUpdate(targetUserId, { $push: { followers: loggedInUserId } });

            return res.status(200).json({ message: "Followed successfully" });
        }

    } catch (error) {
        console.error("Error toggling follow status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const timeRemaining = Math.floor(req.tokenData.exp * 1000 - Date.now()) / 1000;

        if (timeRemaining > 0) {
            await redis.set(`blacklist:${token}`, true, "EX", Math.floor(timeRemaining));
        }

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
module.exports.getMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({
            $or: [{
                sender: req.user._id,
                receiver: req.query.userId
            },{
                sender: req.query.userId,
                receiver: req.user._id
            }]
        })
        res.status(200).json({messages,message:" Messages are successfully getched"});
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message);
    }
}
