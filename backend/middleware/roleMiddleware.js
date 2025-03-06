const roleMiddleware = (roles) => {
    return (req, res, next) => {
        // Assuming req.user contains the authenticated user's information
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Access denied. No user role found." });
        }

        // Check if the user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. You do not have the required permissions." });
        }

        next(); // User has the required role, proceed to the next middleware or route handler
    };
};

module.exports = roleMiddleware; 