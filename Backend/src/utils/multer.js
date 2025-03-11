const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..',"..", 'public'))
    },
    filename: function (req, file, cb) {


        cb(null, new mongoose.Types.ObjectId().toString() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

module.exports = upload;