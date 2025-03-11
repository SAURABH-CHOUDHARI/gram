const {Router} = require("express")
const router = Router()
const userCotroller = require("../controllers/user.controller")
const userMiddleware = require("../middlewares/user.middlewares")

router.post("/register",userMiddleware.registerValidation, userCotroller.registerController)
router.post("/login",userMiddleware.loginValidation ,userCotroller.loginController)
router.get("/profile", userMiddleware.authUser ,userCotroller.profileController)
router.get("/search", userMiddleware.authUser ,userCotroller.search)
router.post("/searched-profile", userMiddleware.authUser ,userCotroller.getSearchedProfile)
router.patch("/togglefollow", userMiddleware.authUser ,userCotroller.toggleFollow)

module.exports = router