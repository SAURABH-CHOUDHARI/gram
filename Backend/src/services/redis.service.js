const Redis = require("ioredis")
const config = require("../config/config")

const redis = new Redis(config.REDIS_URL)

redis.on("connect", () => {
    console.log("Redis connected");
})


module.exports =  redis;