require('dotenv').config(); // Ensure env variables are loaded
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const User = require('../queries/userQueries');

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const authController = {
    // User Login
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate username
            const result = await db.query(User.userQueries.getByUsername, [username]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = result.rows[0];

            // Compare provided password with stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Generate JWT token
            const payload = { id: user.id, username: user.username, role: user.role };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION || '1h' });

            // Send response with token
            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    phone: user.phone,
                    address: user.address
                }
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Middleware to verify token for protected routes
    verifyToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: "Token is required" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            req.user = decoded;
            next();
        });
    }
};

module.exports = authController;
