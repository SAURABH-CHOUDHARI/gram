const express = require('express')
const app = express()
const userRoutes = require("./routes/user.routes")
const postRoutes = require('./routes/post.routes')
const indexRoutes = require("./routes/index.routes")
const commentRoutes = require("./routes/comment.routes")

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/",indexRoutes)
app.use("/users",userRoutes)
app.use("/posts", postRoutes)
app.use("/comments", commentRoutes)


module.exports = app;
