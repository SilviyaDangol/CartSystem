const db = require('../config/db.config');
const Product = require('../queries/productQueries');
const upload = require('../middleware/multer'); // Import multer middleware

const productController = {
    // Create a new product
    async create(req, res) {
        try {
            const { product_name, category_id, quantity, price } = req.body;
            const imagePath = req.file ? req.file.filename : null; // Get uploaded filename

            // Validate required fields
            if (!product_name || !category_id || !quantity || !price) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Insert product into the database
            const result = await db.query(Product.productQueries.insertProduct, [
                product_name, category_id, imagePath, quantity, price
            ]);

            res.status(201).json({ message: "Product created successfully", product: result.rows[0] });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get all products
    async findAll(req, res) {
        try {
            const result = await db.query(Product.productQueries.getAllProducts);
            res.status(200).json({ products: result.rows });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get a single product by ID
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query(Product.productQueries.getProductById, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.status(200).json({ product: result.rows[0] });
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update a product (including image upload)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { product_name, category_id, quantity, price } = req.body;
            const imagePath = req.file ? req.file.filename : null; // Check for a new image

            // Fetch the existing product
            const existingProduct = await db.query(Product.productQueries.getProductById, [id]);

            if (existingProduct.rows.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Use the existing image if a new one is not provided
            const updatedImage = imagePath || existingProduct.rows[0].image;

            const result = await db.query(Product.productQueries.updateProduct, [
                product_name, category_id, updatedImage, quantity, price, id
            ]);

            res.status(200).json({ message: "Product updated successfully", product: result.rows[0] });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Delete a product
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query(Product.productQueries.deleteProduct, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.status(200).json({ message: "Product deleted successfully", product: result.rows[0] });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
};

module.exports = productController;
