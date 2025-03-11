const {Router} = require("express")
const router = Router()
const indexController = require("../controllers/index.controller")
const userMiddleware = require("../middlewares/user.middlewares")

router.get("/feed", userMiddleware.authUser , indexController.feedController )


module.exports = router