const db = require('../config/db.config');
const Order = require('../queries/orderQueries');

const orderController = {
    // Create a new order
    async create(req, res) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            const { items, shipping_address } = req.body;
            const user_id = req.user.id;

            // Calculate total amount
            const total_amount = items.reduce((sum, item) => {
                return sum + (parseFloat(item.price) * parseInt(item.quantity));
            }, 0);

            // Create the order
            const orderResult = await client.query(Order.orderQueries.insertOrder, [
                user_id, total_amount, shipping_address, 'pending'
            ]);

            const order = orderResult.rows[0];

            // Create order items
            const orderItems = [];
            for (const item of items) {
                const orderItemResult = await client.query(Order.orderQueries.insertOrderItem, [
                    order.id, item.product_id, item.product_name, item.quantity, item.price
                ]);
                orderItems.push(orderItemResult.rows[0]);
            }

            await client.query('COMMIT');

            res.status(201).json({
                message: "Order created successfully",
                order,
                orderItems
            });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error creating order:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        } finally {
            client.release();
        }
    },

    // Get user's orders
    async getUserOrders(req, res) {
        try {
            const user_id = req.user.id;

            const orderResult = await db.query(Order.orderQueries.getUserOrders, [user_id]);
            const orders = orderResult.rows;

            // Get items for each order
            for (let i = 0; i < orders.length; i++) {
                const orderItemsResult = await db.query(Order.orderQueries.getOrderItemsByOrderId, [orders[i].id]);
                orders[i].items = orderItemsResult.rows;
            }

            res.status(200).json({ orders });
        } catch (error) {
            console.error("Error getting user orders:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get a single order by ID
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const orderResult = await db.query(Order.orderQueries.getOrderById, [id]);

            if (orderResult.rows.length === 0) {
                return res.status(404).json({ message: "Order not found" });
            }

            const order = orderResult.rows[0];

            // Check if user has permission (admin or order owner)
            if (!req.user.is_admin && order.user_id !== req.user.id) {
                return res.status(403).json({ message: "Access denied" });
            }

            // Get order items
            const orderItemsResult = await db.query(Order.orderQueries.getOrderItemsByOrderId, [id]);
            order.items = orderItemsResult.rows;

            res.status(200).json({ order });
        } catch (error) {
            console.error("Error getting order:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Update order status (admin only)
    async updateOrderStatus(req, res) {
        try {
            // Check if user is admin
            if (!req.user.is_admin) {
                return res.status(403).json({ message: "Access denied. Admin privileges required." });
            }

            const { id } = req.params;
            const { status } = req.body;

            // Validate status
            const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const result = await db.query(Order.orderQueries.updateOrderStatus, [status, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Order not found" });
            }

            res.status(200).json({
                message: "Order status updated successfully",
                order: result.rows[0]
            });
        } catch (error) {
            console.error("Error updating order status:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Get all orders (admin only)
    async getAllOrders(req, res) {
        try {
            // Check if user is admin
            if (!req.user.is_admin) {
                return res.status(403).json({ message: "Access denied. Admin privileges required." });
            }

            const result = await db.query(Order.orderQueries.getAllOrders);
            const orders = result.rows;

            res.status(200).json({ orders });
        } catch (error) {
            console.error("Error getting all orders:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
};

module.exports = orderController;
