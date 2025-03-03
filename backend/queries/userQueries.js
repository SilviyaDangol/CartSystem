module.exports = {
    userQueries: {
        // Fetch all users
        getAll: `
            SELECT * FROM users ORDER BY id DESC;
        `,

        // Fetch a user by ID
        getById: `
            SELECT * FROM users WHERE id = $1;
        `,

        // Fetch a user by username
        getByUsername: `
            SELECT * FROM users WHERE username = $1;
        `,

        // Insert a new user
        insertUser: `
            INSERT INTO users (username, full_name, address, phone, image, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `,

        // Update user profile picture
        updateUserProfilePicture: `
            UPDATE users SET image = $1 WHERE id = $2 RETURNING *;
        `,

        // Update username
        updateUsername: `
            UPDATE users SET username = $1 WHERE id = $2 RETURNING *;
        `,

        // Update password
        updatePassword: `
            UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *;
        `,

        // Update user details (full_name, address, phone)
        updateUserDetails: `
            UPDATE users SET full_name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *;
        `,

        // Delete a user by ID
        deleteUser: `
            DELETE FROM users WHERE id = $1 RETURNING *;
        `
    }
};
