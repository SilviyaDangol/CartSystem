require('dotenv').config();
const { Pool } = require('pg');
const tables = require('./createTables'); // Import the table creation script

// Create a new PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Test the connection and create tables
pool.connect()
    .then(client => {
        console.log('✅ Connected to PostgreSQL database');
        return client.query(tables.createTables) // Run table creation script
            .then(() => {
                console.log('✅ Tables created successfully');
                client.release();
            })
            .catch(err => {
                console.error('❌ Error creating tables:', err);
                client.release();
            });
    })
    .catch(err => console.error('❌ Database connection error:', err));

module.exports = pool;
