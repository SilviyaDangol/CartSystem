const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded User:', req.user);
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(400).json({ message: "Invalid token", error: error.message });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };