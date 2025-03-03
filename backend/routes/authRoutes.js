const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Protected route example (Use authController.verifyToken)
router.get('/protected', authController.verifyToken, (req, res) => {
    res.json({ message: "You have access to this protected route!", user: req.user });
});

module.exports = router;
