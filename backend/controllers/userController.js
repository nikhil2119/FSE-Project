const db = require('../config/db');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT id, user_name, user_email, user_age, phone, created_on FROM Users WHERE id = ?',
            [req.user.id]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd, user_age, phone } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!user_name || !user_email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if email is already taken by another user
        const [existingUser] = await db.query(
            'SELECT id FROM Users WHERE user_email = ? AND id != ?',
            [user_email, userId]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        let updateQuery = 'UPDATE Users SET user_name = ?, user_email = ?, user_age = ?, phone = ? WHERE id = ?';
        let queryParams = [user_name, user_email, user_age, phone, userId];

        // If password is provided, include it in update
        if (user_pwd) {
            updateQuery = 'UPDATE Users SET user_name = ?, user_email = ?, user_pwd = ?, user_age = ?, phone = ? WHERE id = ?';
            queryParams = [user_name, user_email, user_pwd, user_age, phone, userId];
        }

        const [result] = await db.query(updateQuery, queryParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, user_name, user_email, user_age, phone, created_on FROM Users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT id, user_name, user_email, user_age, phone, created_on FROM Users WHERE id = ?',
            [req.params.id]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user (admin only)
const updateUser = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd, user_age, phone } = req.body;
        const userId = req.params.id;

        // Validate input
        if (!user_name || !user_email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        let updateQuery = 'UPDATE Users SET user_name = ?, user_email = ?, user_age = ?, phone = ? WHERE id = ?';
        let queryParams = [user_name, user_email, user_age, phone, userId];

        // If password is provided, include it in update
        if (user_pwd) {
            updateQuery = 'UPDATE Users SET user_name = ?, user_email = ?, user_pwd = ?, user_age = ?, phone = ? WHERE id = ?';
            queryParams = [user_name, user_email, user_pwd, user_age, phone, userId];
        }

        const [result] = await db.query(updateQuery, queryParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Users WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
