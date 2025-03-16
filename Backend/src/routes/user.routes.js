const {Router} = require("express")
const router = Router()
const userCotroller = require("../controllers/user.controller")
const userMiddleware = require("../middlewares/user.middlewares")

router.get("/auth",userMiddleware.authUser,userCotroller.auth)
router.post("/register",userMiddleware.registerValidation, userCotroller.registerController)
router.post("/login",userMiddleware.loginValidation ,userCotroller.loginController)
router.get("/profile", userMiddleware.authUser ,userCotroller.profileController)
router.get("/search", userMiddleware.authUser ,userCotroller.search)
router.post("/searched-profile", userMiddleware.authUser ,userCotroller.getSearchedProfile)
router.patch("/togglefollow", userMiddleware.authUser ,userCotroller.toggleFollow)
router.get("/logout", userMiddleware.authUser ,userCotroller.logout)
router.get("/get-messages",userMiddleware.authUser,userCotroller.getMessages)
router.get("/conversations",userMiddleware.authUser,userCotroller.getConversations)

module.exports = router