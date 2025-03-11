const express = require('express')
const app = express()
const userRoutes = require("./routes/user.routes")
const postRoutes = require('./routes/post.routes')
const indexRoutes = require("./routes/index.routes")
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/",indexRoutes)
app.use("/users",userRoutes)
app.use("/posts", postRoutes)


module.exports = app;
