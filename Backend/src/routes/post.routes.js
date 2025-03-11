const {Router} = require("express")
const router = Router()
const postController = require("../controllers/post.controller")
const userMiddleware = require("../middlewares/user.middlewares")
const postMiddleware = require("../middlewares/post.middlwares")

router.post("/create", userMiddleware.authUser,postMiddleware.handlestreamimage, postMiddleware.imagekitUpload , postController.createPostController )
router.patch("/like", userMiddleware.authUser, postController.likePostController);

module.exports = router