// Updated message model with static method
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

// Add static method to fetch conversations
messageSchema.statics.getUserConversations = async function(userId) {
    // Find all messages where the user is either sender or receiver
    const messages = await this.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    }).sort({ createdAt: -1 });
    
    // Create a map to store the latest message with each user
    const conversationsMap = new Map();
    const userIds = new Set();
    
    // Process messages to extract unique conversations
    messages.forEach(message => {
        const otherUserId = message.sender.equals(userId) 
            ? message.receiver.toString() 
            : message.sender.toString();
        
        // Add user ID to the set for later fetching user details
        userIds.add(otherUserId);
        
        // Only add if this is the first (latest) message we've seen with this user
        if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, {
                userId: otherUserId,
                lastMessage: message.text,
                lastMessageTime: message.createdAt,
                lastMessageId: message._id
            });
        }
    });
    
    return {
        conversations: Array.from(conversationsMap.values()),
        userIds: Array.from(userIds)
    };
};

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;