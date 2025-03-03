const orderQueries = {
    insertOrder: `
        INSERT INTO orders (user_id, total_amount, shipping_address, status, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
    `,
    insertOrderItem: `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
    getOrderById: `
        SELECT * FROM orders WHERE id = $1
    `,
    getOrderItemsByOrderId: `
        SELECT * FROM order_items WHERE order_id = $1
    `,
    getUserOrders: `
        SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC
    `,
    updateOrderStatus: `
        UPDATE orders SET status = $1 WHERE id = $2 RETURNING *
    `,
    getAllOrders: `
        SELECT o.*, u.username 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `
};

module.exports = { orderQueries };