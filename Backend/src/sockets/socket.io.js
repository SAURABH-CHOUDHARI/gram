const { Server, Socket } = require("socket.io");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model")
const mongoose = require("mongoose")

function initSocket(server) {
    console.log("socket io initialized")

    const io = new Server(server)

    io.use(async (socket, next) => {

        try {

            const token = socket.handshake.headers.token;
            if (!token) {
                return next(new Error("Token is required"));
            }

            const decodedToken = userModel.verifyToken(token);

            const user = await userModel.findById(decodedToken._id);

            if (!user) {
                return next(new Error("User not Found"))
            }

            socket.user = user;

            next();

        } catch (err) {
            next(err)
        }

    })

    io.on("connection", (socket) => {

        socket.join(socket.user._id.toString());

        socket.on("chat-message", async (data) => {
            try {

                const { receiver, text } = data;

                if (!receiver || !text || !text.trim() || !receiver.trim()) {
                    return
                }

                const sender = socket.user

                if(sender._id == receiver){
                    return
                }

                const isValdiReceiver = mongoose.Types.ObjectId.isValid(receiver)

                if (!isValdiReceiver) {
                    return;
                }
                const counterPart = await userModel.findById(receiver);

                if (!counterPart) {
                    return
                }

                await messageModel.create({
                    sender: sender._id,
                    receiver: counterPart._id,
                    text
                })

                io.to(receiver).emit("chat-message", {
                    sender,
                    receiver: counterPart,
                    text
                })
            } catch (err) {
                console.log(err)
            }
        })


        socket.on("disconnect", () => {
            console.log("user Disconnect")
            socket.leave(socket.user._id.toString())
        })



        console.log("User connected")
    })


}


module.exports = initSocket;