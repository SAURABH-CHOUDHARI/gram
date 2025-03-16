const { Server } = require("socket.io");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const mongoose = require("mongoose");

function initSocket(server) {
    console.log("Socket.io initialized");

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Track online users
    const onlineUsers = new Map();

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.headers.token;
            if (!token) return next(new Error("Token is required"));

            const decodedToken = userModel.verifyToken(token);
            const user = await userModel.findById(decodedToken._id);
            if (!user) return next(new Error("User not found"));

            socket.user = user;
            next();
        } catch (err) {
            next(err);
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user._id.toString();
        console.log("User connected:", userId);
        
        // Track user as online
        onlineUsers.set(userId, socket.id);

        // Helper function to create consistent room IDs
        function getChatRoom(user1, user2) {
            return [user1, user2].sort().join('_');
        }

        // Handle sending messages
        socket.on("chat-message", async (data) => {
            try {
                const { receiver, text } = data;
                
                // Validate inputs
                if (!receiver || !text.trim()) return;
                if (userId === receiver) return;
                if (!mongoose.Types.ObjectId.isValid(receiver)) return; 

                // Save message to database
                const message = await messageModel.create({
                    sender: socket.user._id,
                    receiver: receiver,
                    text
                });

                // Create room and join it
                const roomId = getChatRoom(userId, receiver);
                socket.join(roomId);

                // Add receiver to room if online
                if (onlineUsers.has(receiver)) {
                    const receiverSocket = io.sockets.sockets.get(onlineUsers.get(receiver));
                    if (receiverSocket) receiverSocket.join(roomId);
                }

                // Send message to room
                io.to(roomId).emit("chat-message", {
                    _id: message._id,
                    sender: userId,
                    receiver: receiver,
                    text: text,
                    createdAt: message.createdAt
                });
            } catch (err) {
                console.error("Message error:", err);
            }
        });

        // Get conversation history
        socket.on("get-conversation", async (otherUserId) => {
            try {
                if (!mongoose.Types.ObjectId.isValid(otherUserId)) return;

                const messages = await messageModel.find({
                    $or: [
                        { sender: userId, receiver: otherUserId },
                        { sender: otherUserId, receiver: userId }
                    ]
                })
                .sort({ createdAt: 1 })
                .limit(50);
                
                // Join the chat room
                const roomId = getChatRoom(userId, otherUserId);
                socket.join(roomId);

                // Send history to user
                socket.emit("conversation-history", messages);
            } catch (err) {
                console.error("History error:", err);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", userId);
            onlineUsers.delete(userId);
        });
    });
}

module.exports = initSocket;