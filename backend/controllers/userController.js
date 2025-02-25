const db = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, user_name, user_email, user_age, phone, created_on FROM Users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const [user] = await db.query('SELECT id, user_name, user_email, user_age, phone, created_on FROM Users WHERE id = ?', [req.params.id]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update user
const updateUser = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd, user_age, phone } = req.body;
        
        const date = new Date();
        const created_on = date.toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await db.query(
            'UPDATE Users SET user_name = ?, user_email = ?, user_pwd = ?, user_age = ?, phone = ?, created_on = ? WHERE id = ?',
            [user_name, user_email, user_pwd, user_age, phone, created_on, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
