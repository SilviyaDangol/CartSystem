const db = require('../config/db.config');
const User = require('../queries/userQueries');
const bcrypt = require('bcrypt');
const upload = require('../middleware/multer');
const randomString = require('../utils/randomizer');

const userController = {
    async create(req, res) {
        try {
            const { username, full_name, address, phone, password } = req.body;
            const imagePath = req.file ? req.file.filename : null; // Get filename from multer

            // Hash the password
            const password_hash = await bcrypt.hash(password, 10);

            // Insert user into DB
            const result = await db.query(User.userQueries.insertUser, [
                username, full_name, address, phone, imagePath, password_hash
            ]);

            // Send response
            res.status(201).json({ message: "User created successfully", user: result.rows[0] });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get all users
    async findAll(req, res) {
        try {
            const result = await db.query(User.userQueries.getAll);
            res.status(200).json({ users: result.rows });
        } catch (error) {
            console.error("Error finding users:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get user by ID
    async findOne(req, res) {
        try {
            const { id } = req.params; // Get user ID from request parameters
            const result = await db.query(User.userQueries.getById, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ user: result.rows[0] });
        } catch (error) {
            console.error("Error finding user:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update user's profile picture
    async updateProfilePicture(req, res) {
        try {
            const { id } = req.params;
            const { image } = req.body;

            const result = await db.query(User.userQueries.updateUserProfilePicture, [image, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Profile picture updated successfully", user: result.rows[0] });
        } catch (error) {
            console.error("Error updating profile picture:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update username
    async updateUsername(req, res) {
        try {
            const { id } = req.params;
            const { username } = req.body;

            const result = await db.query(User.userQueries.updateUsername, [username, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Username updated successfully", user: result.rows[0] });
        } catch (error) {
            console.error("Error updating username:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update password
    async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { password } = req.body;
            const password_hash = await bcrypt.hash(password, 10);

            const result = await db.query(User.userQueries.updatePassword, [password_hash, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Password updated successfully", user: result.rows[0] });
        } catch (error) {
            console.error("Error updating password:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update user details (full name, address, phone)
    async updateUserDetails(req, res) {
        try {
            const { id } = req.params;
            const { full_name, address, phone } = req.body;

            const result = await db.query(User.userQueries.updateUserDetails, [
                full_name, address, phone, id
            ]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User details updated successfully", user: result.rows[0] });
        } catch (error) {
            console.error("Error updating user details:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Delete a user by ID
    async delete(req, res) {
        try {
            const { id } = req.params;

            const result = await db.query(User.userQueries.deleteUser, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User deleted successfully", user: result.rows[0] });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
};

module.exports = userController;
