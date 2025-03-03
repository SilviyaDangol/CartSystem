// queries/categoryQueries.js
const categoryQueries = {
    insertCategory: 'INSERT INTO category (name) VALUES ($1) RETURNING *',
    getAllCategories: 'SELECT * FROM category',
    getCategoryById: 'SELECT * FROM category WHERE id = $1',
    updateCategory: 'UPDATE category SET name = $1 WHERE id = $2 RETURNING *',
    removeCategory: 'DELETE FROM category WHERE id = $1 RETURNING *',
};

module.exports = categoryQueries;