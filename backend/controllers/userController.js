const User = require('../models/User');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
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
        const existingUser = await User.findOne({
            where: {
                user_email: user_email,
                id: { [Op.ne]: userId }
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (user_name) user.name = user_name;
        if (user_email) user.email = user_email;
        if (user_age) user.age = user_age;
        if (phone) user.phone = phone;
        if (user_pwd) user.password = user_pwd;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        
        await user.save();
        
        res.json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await user.destroy();
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// Search users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { phone: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: { exclude: ['password'] }
        });
        
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Error searching users' });
    }
};

// Register new user
const register = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd, user_age, phone } = req.body;

        // Validate input
        if (!user_name || !user_email || !user_pwd) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { user_email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Create new user
        const user = await User.create({
            user_name,
            user_email,
            user_pwd,
            user_age,
            phone
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                user_name: user.user_name,
                user_email: user.user_email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
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

        // Find user
        const user = await User.findOne({ where: { user_email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await user.checkPassword(user_pwd);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.last_login = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                user_name: user.user_name,
                user_email: user.user_email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    register,
    login
};
