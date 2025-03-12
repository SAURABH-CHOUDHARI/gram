const {Router} = require("express")
const router = Router()
const userMiddleware = require("../middlewares/user.middlewares")
const commentController =require("../controllers/comment.controller")

router.post("/create", userMiddleware.authUser, commentController.create)
router.post("/like", userMiddleware.authUser ,commentController.like );
router.delete("/delete", userMiddleware.authUser,commentController.delete);


module.exports = router