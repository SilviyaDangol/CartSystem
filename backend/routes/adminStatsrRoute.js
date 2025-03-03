const express = require('express');
 // Import multer middleware
const {authenticate , authorizeAdmin} = require('../middleware/authMiddleware');
const router = express.Router();// Example stats route

router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
    try {
        // Fetch product stats from the database (example query)
        const productCountResult = await db.query('SELECT COUNT(*) FROM products');
        const productCount = productCountResult.rows[0].count;

        // You can add more statistics (like total sales, etc.)

        res.status(200).json({
            message: "Product stats fetched successfully",
            stats: {
                totalProducts: productCount,
                // add other stats here
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
