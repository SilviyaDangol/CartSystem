const multer = require('multer');
const path = require('path');
const randomString = require('../utils/randomizer'); // Import the random string generator

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // The folder to save uploaded images
    },
    filename: (req, file, cb) => {
        const uniqueString = randomString(10); // Generate a random string
        req.randomString = uniqueString; // Attach to req for later use
        const extension = path.extname(file.originalname); // Get file extension
        cb(null, uniqueString + extension); // Save file with random string name
    }
});

// File filter (optional, for restricting file types)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type'), false); // Reject the file
    }
};

// Initialize multer with the storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size (5MB)
});

module.exports = upload;
