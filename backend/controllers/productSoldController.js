const db = require('../config/db.config');
const ProductSold = require('../queries/productSoldQueries');

const productSoldController = {
    // Insert a new product sold
    async create(req, res) {
        try {
            const { product_name, user_id, quantity, state } = req.body;

            const result = await db.query(ProductSold.productSoldQueries.insertProductSold, [
                product_name, user_id, quantity, state
            ]);

            res.status(201).json({ message: "Product sold record created successfully", product_sold: result.rows[0] });
        } catch (error) {
            console.error("Error creating product sold record:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get all products sold
    async findAll(req, res) {
        try {
            const result = await db.query(ProductSold.productSoldQueries.getAllProductsSold);
            res.status(200).json({ products_sold: result.rows });
        } catch (error) {
            console.error("Error retrieving products sold:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get a single product sold by ID
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query(ProductSold.productSoldQueries.getProductSoldById, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Product sold record not found" });
            }

            res.status(200).json({ product_sold: result.rows[0] });
        } catch (error) {
            console.error("Error retrieving product sold record:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update a product sold record
    async update(req, res) {
        try {
            const { id } = req.params;
            const { product_name, user_id, quantity, state } = req.body;

            const result = await db.query(ProductSold.productSoldQueries.updateProductSold, [
                product_name, user_id, quantity, state, id
            ]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Product sold record not found" });
            }

            res.status(200).json({ message: "Product sold record updated successfully", product_sold: result.rows[0] });
        } catch (error) {
            console.error("Error updating product sold record:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Delete a product sold record
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query(ProductSold.productSoldQueries.deleteProductSold, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Product sold record not found" });
            }

            res.status(200).json({ message: "Product sold record deleted successfully", product_sold: result.rows[0] });
        } catch (error) {
            console.error("Error deleting product sold record:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
};

module.exports = productSoldController;