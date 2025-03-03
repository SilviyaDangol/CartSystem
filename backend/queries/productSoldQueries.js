module.exports = {
    productSoldQueries: {
        insertProductSold: `
      INSERT INTO product_sold (product_name, user_id, quantity, state) 
      VALUES ($1, $2, $3, $4) RETURNING *;
    `,
        getProductSoldById: `
      SELECT ps.*, u.username 
      FROM product_sold ps 
      JOIN users u ON ps.user_id = u.id 
      WHERE ps.id = $1;
    `,
        updateProductSold: `
      UPDATE product_sold 
      SET product_name = $1, user_id = $2, quantity = $3, state = $4 
      WHERE id = $5 RETURNING *;
    `,
        deleteProductSold: `
      DELETE FROM product_sold WHERE id = $1 RETURNING *;
    `,
        getAllProductsSold: `
      SELECT ps.id, ps.product_name, ps.quantity, ps.state, u.username 
      FROM product_sold ps 
      JOIN users u ON ps.user_id = u.id;
    `
    }
};