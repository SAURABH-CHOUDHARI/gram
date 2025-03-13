const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Secure CORS setup
app.use(cors({
    origin: ["http://localhost:5173", "https://your-frontend.com"], // Only allow trusted domains
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow auth headers
    credentials: true // Enable cookies & authorization headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const indexRoutes = require("./routes/index.routes");
const commentRoutes = require("./routes/comment.routes");

// Use Routes
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

module.exports = app;
