const userModel = require("../models/user.model");
const { body, validationResult } = require('express-validator');
const redis =  require("../services/redis.service");



module.exports.registerValidation = [
    body('email').not().isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is not valid'),
    body('password').not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').not().isEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long')
        .isAlphanumeric().withMessage('Username must be alphanumeric')
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

module.exports.loginValidation = [

    body('email').not().isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is not valid'),
    body('password').not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

module.exports.authUser = async (req,res,next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1]

        if(!token) {
            return res.status(400).json({message:"unauthorized"})
        }

        const decoded = userModel.verifyToken(token)
        

        let user = await redis.get(`user:${decoded._id}`)

        if (user) {
            user = JSON.parse(user)

        }

        if (!user) {
            user = await userModel.findById(decoded._id)
            if (user) {
                delete user._doc.password;
                await redis.set(`user:${decoded._id}`, JSON.stringify(user))
            } else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        req.user = user;
    
        next()

    }catch (err){
        return res.status(500).json({ message: "Unauthorized" })
    }
}