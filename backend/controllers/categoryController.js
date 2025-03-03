const db = require('../config/db.config');
const categoryQueries = require('../queries/categoryQueries'); // Corrected import

const categoryController = {
    // Create a new category
    async create(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Category name is required" });
            }

            const result = await db.query(categoryQueries.insertCategory, [name]); // Updated reference

            res.status(201).json({ message: "Category created successfully", category: result.rows[0] });
        } catch (error) {
            console.error("Error creating category:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get all categories
    async findAll(req, res) {
        try {
            const result = await db.query(categoryQueries.getAllCategories);
            res.status(200).json({ categories: result.rows });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get a category by ID
    async findOne(req, res) {
        try {
            const { id } = req.params;

            const result = await db.query(categoryQueries.getCategoryById, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ category: result.rows[0] });
        } catch (error) {
            console.error("Error fetching category:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update a category
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Category name is required" });
            }

            const result = await db.query(categoryQueries.updateCategory, [name, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ message: "Category updated successfully", category: result.rows[0] });
        } catch (error) {
            console.error("Error updating category:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Delete a category
    async delete(req, res) {
        try {
            const { id } = req.params;

            const result = await db.query(categoryQueries.removeCategory, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ message: "Category deleted successfully", category: result.rows[0] });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
};

module.exports = categoryController;