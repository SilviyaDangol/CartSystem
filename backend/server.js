const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db.config');

// Import routes
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const productSoldRoutes = require('./routes/productSoldRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
// Initialize express app
const app = express();

// Set the port number for the server (default to 5000 if not provided)
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use('/uploads', express.static('uploads')); // Serve uploaded files (like images) from 'uploads' folder

// Routes Setup
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes); // Category-related routes (create, update, delete categories, etc.)
app.use('/api/products', productRoutes); // Product-related routes (create, update, delete products, etc.)
app.use('/api/products-sold', productSoldRoutes); // Product sold-related routes (add, update, get product sales stats, etc.)
app.use('/api/users', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// Start the server and establish the database connection
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Connect to the database
    try {
        await db.connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
});

module.exports = app; // Export the app for testing or future use