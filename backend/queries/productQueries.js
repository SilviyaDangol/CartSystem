const productQueries = {
    insertProduct: `
        INSERT INTO product (product_name, category_id, image, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
    getAllProducts: `
        SELECT p.id, p.product_name, p.category_id, p.image, p.quantity, p.price, c.name AS category_name
        FROM product p
        LEFT JOIN category c ON p.category_id = c.id
    `,
    getProductById: `
        SELECT p.id, p.product_name, p.category_id, p.image, p.quantity, p.price
        FROM product p
        WHERE p.id = $1
    `,
    updateProduct: `
        UPDATE product
        SET product_name = $1, category_id = $2, image = $3, quantity = $4, price = $5
        WHERE id = $6
        RETURNING *
    `,
    deleteProduct: `
        DELETE FROM product
        WHERE id = $1
        RETURNING *
    `
};

module.exports = { productQueries };