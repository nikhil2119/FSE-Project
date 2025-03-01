const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "login first" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const adminMiddleware = (req, res, next) => {   
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Your are not authorized to access this resource' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };

