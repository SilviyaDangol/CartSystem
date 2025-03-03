module.exports = {
    createTables: `
    -- First check and create ENUM types if they don't exist
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_state') THEN
            CREATE TYPE order_state AS ENUM ('delivering', 'hold', 'received');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('user', 'admin');
        END IF;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    -- Create tables if they don't exist
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(15) UNIQUE NOT NULL,
        image TEXT,
        password_hash TEXT NOT NULL,
        role user_role NOT NULL DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        category_id INT REFERENCES category(id) ON DELETE SET NULL,
        image TEXT,
        quantity INT NOT NULL CHECK (quantity >= 0),
        price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
    );

    CREATE TABLE IF NOT EXISTS product_sold (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quantity INT NOT NULL CHECK (quantity > 0),
        state order_state NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `
};
