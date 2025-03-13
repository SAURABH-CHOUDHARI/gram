function initSocket(server) {
    console.log("Socket.io initialized");

    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            credentials: true 
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.headers.token;
            if (!token) {
                return next(new Error("Token is required"));
            }

            const decodedToken = userModel.verifyToken(token);
            const user = await userModel.findById(decodedToken._id);

            if (!user) {
                return next(new Error("User not Found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(err);
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.user._id);

        socket.join(socket.user._id.toString());

        socket.on("chat-message", async (data) => {
            try {
                const { receiver, text } = data;

                if (!receiver || !text.trim()) return;
                if (socket.user._id.toString() === receiver) return;

                const isValidReceiver = mongoose.Types.ObjectId.isValid(receiver);
                if (!isValidReceiver) return;

                const counterPart = await userModel.findById(receiver);
                if (!counterPart) return;

                await messageModel.create({
                    sender: socket.user._id,
                    receiver: counterPart._id,
                    text
                });

                io.to(receiver).emit("chat-message", {
                    sender: socket.user._id,
                    receiver: counterPart._id,
                    text
                });
            } catch (err) {
                console.log(err);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.user._id);
            socket.leave(socket.user._id.toString());
        });
    });
}

module.exports = initSocket;
