const db = require("../config/db");

// Register user
const register = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd, user_age, phone } = req.body;
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
    const { user_email, user_pwd } = req.body;
    const [result] = await db.query("SELECT * FROM Users WHERE user_email = ?", [user_email]);
    if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = result[0];
    if (user.user_pwd !== user_pwd) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful" });
};

module.exports = { register, login };



