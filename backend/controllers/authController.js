const db = require("../config/db");
const { generateToken } = require("../config/jwt");

// Register user
const register = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd, user_age, phone } = req.body;

        // Validate input
        if (!user_name || !user_email || !user_pwd) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if user already exists
        const [existingUser] = await db.query('SELECT id FROM Users WHERE user_email = ?', [user_email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const date = new Date();
        const created_on = date.toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await db.query(
            'INSERT INTO Users (user_name, user_email, user_pwd, user_age, phone, created_on) VALUES (?, ?, ?, ?, ?, ?)',
            [user_name, user_email, user_pwd, user_age, phone, created_on]
        );

        res.status(201).json({ id: result.insertId, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { user_email, user_pwd } = req.body;

        // Validate input
        if (!user_email || !user_pwd) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const [result] = await db.query("SELECT * FROM Users WHERE user_email = ?", [user_email]);
        
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result[0];
        if (user.user_pwd !== user_pwd) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user.id);
        res.status(200).json({ 
            message: "Login successful", 
            token,
            user: {
                id: user.id,
                name: user.user_name,
                email: user.user_email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

// Logout user
const logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, getProfile, logout };



