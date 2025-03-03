const db = require('../config/db.config');
const cartQueries = require('../queries/cartQueries');

const cartController = {
    // Add item to cart
    async addToCart(req, res) {
        try {
            const { product_id, quantity } = req.body;
            const user_id = req.user.id; // Assuming user info is attached to req via middleware

            if (!product_id || !quantity) {
                return res.status(400).json({ message: "Product ID and quantity are required" });
            }

            // Check if product already exists in cart
            const existingItem = await db.query(cartQueries.checkProductInCart, [user_id, product_id]);

            if (existingItem.rows.length > 0) {
                // Update quantity if product already exists
                const newQuantity = existingItem.rows[0].quantity + quantity;
                const result = await db.query(cartQueries.updateCartItemQuantity,
                    [newQuantity, existingItem.rows[0].id, user_id]);
                return res.status(200).json({
                    message: "Cart item quantity updated",
                    cartItem: result.rows[0]
                });
            }

            const result = await db.query(cartQueries.insertCart, [user_id, product_id, quantity]);
            res.status(201).json({
                message: "Item added to cart successfully",
                cartItem: result.rows[0]
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get user's cart
    async getUserCart(req, res) {
        try {
            const user_id = req.user.id; // Assuming user info is attached to req via middleware

            const result = await db.query(cartQueries.getCartByUserId, [user_id]);
            res.status(200).json({ cartItems: result.rows });
        } catch (error) {
            console.error("Error fetching cart:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update cart item quantity
    async updateQuantity(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const user_id = req.user.id;

            if (!quantity || quantity < 1) {
                return res.status(400).json({ message: "Valid quantity is required" });
            }

            const result = await db.query(cartQueries.updateCartItemQuantity, [quantity, id, user_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Cart item not found" });
            }

            res.status(200).json({
                message: "Cart item updated successfully",
                cartItem: result.rows[0]
            });
        } catch (error) {
            console.error("Error updating cart item:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Remove item from cart
    async removeItem(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const result = await db.query(cartQueries.removeCartItem, [id, user_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Cart item not found" });
            }

            res.status(200).json({
                message: "Item removed from cart successfully",
                cartItem: result.rows[0]
            });
        } catch (error) {
            console.error("Error removing cart item:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Clear user's cart
    async clearCart(req, res) {
        try {
            const user_id = req.user.id;

            const result = await db.query(cartQueries.clearUserCart, [user_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Cart is already empty" });
            }

            res.status(200).json({
                message: "Cart cleared successfully",
                removedItems: result.rows
            });
        } catch (error) {
            console.error("Error clearing cart:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
};

module.exports = cartController;