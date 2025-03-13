const config = require("./src/config/config")
const app = require("./src/app")
const http = require("http")
const connect = require("./src/db/db")
const initSocket = require('./src/sockets/socket.io')


connect();

const server = http.createServer(app);

initSocket(server);

server.listen(config.PORT,() => {
    console.log("server is Running on PORT: ",config.PORT);
})