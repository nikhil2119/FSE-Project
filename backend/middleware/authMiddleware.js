const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided. Please login first" });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const adminMiddleware = (req, res, next) => {   
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Your are not authorized to access this resource' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };

