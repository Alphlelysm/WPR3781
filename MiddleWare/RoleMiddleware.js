// Middleware/RoleMiddleware.js

const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Please login first" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ 
            message: "Access denied. Admin only." 
        });
    }

    next();
};

module.exports = isAdmin;