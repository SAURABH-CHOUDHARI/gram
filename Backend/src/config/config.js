require("dotenv").config()
const _config = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/express-mongo",
    JWT_KEY: process.env.JWT_KEY || 'hihith',
    IMAGE_KIT_PUBLIC_KEY: process.env.IMAGE_KIT_PUBLIC_KEY,
    IMAGE_KIT_PRIVATE_KEY: process.env.IMAGE_KIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGE_KIT_URL_ENDPOINT,
    REDIS_URL: process.env.REDIS_URL,
    GEMINI_AI_KEY: process.env.GEMINI_AI_KEY,
}

const config = Object.freeze(_config);

module.exports = config;