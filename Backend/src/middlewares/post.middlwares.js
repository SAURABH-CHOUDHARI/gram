const multer = require('multer');
const { Readable } = require("stream");  // Import Readable
const mongoose = require('mongoose');
const imageKit = require("../services/imagekit");

// Configure multer to store images in memory
const upload = multer({ storage: multer.memoryStorage() });

module.exports.handlestreamimage = (req, res, next) => {
    upload.single('media')(req, res, (err) => {  // Ensure 'media' matches frontend
        if (err) {
            return res.status(400).json({ error: "Error uploading image" });
        }
        next();
    });
};

module.exports.imagekitUpload = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Uploaded image is not present" });
    }

    try {
        // Convert buffer to readable stream
        const stream = new Readable();
        stream.push(req.file.buffer);
        stream.push(null); // Signal end of stream

        const file = await imageKit.upload({
            file: stream,  // Upload using stream
            fileName: new mongoose.Types.ObjectId().toString(),
            folder: "/instagram",
        });

        req.body.image = file.url;  // Store only the URL
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
