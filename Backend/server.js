const config = require("./src/config/config")
const app = require("./src/app")
const connect = require("./src/db/db")


connect();

app.listen(config.PORT,() => {
    console.log("server is Running on PORT: ",config.PORT);
})