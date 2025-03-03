const cartQueries = {
    // Create new cart entry
    insertCart: 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',

    // Get all cart items
    getAllCartItems: 'SELECT * FROM cart',

    // Get cart items for a specific user
    getCartByUserId: 'SELECT cart.id, cart.quantity, cart.added_at, product.product_name, product.price, product.image FROM cart JOIN product ON cart.product_id = product.id WHERE cart.user_id = $1',

    // Get specific cart item
    getCartItemById: 'SELECT * FROM cart WHERE id = $1',

    // Update cart item quantity
    updateCartItemQuantity: 'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',

    // Remove specific cart item
    removeCartItem: 'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',

    // Clear entire cart for a user
    clearUserCart: 'DELETE FROM cart WHERE user_id = $1 RETURNING *',

    // Check if product exists in user's cart
    checkProductInCart: 'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
};

module.exports = cartQueries;