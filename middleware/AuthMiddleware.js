// Middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: "Access denied. No token provided." 
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                message: "Access denied. No token provided." 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");

        // Attach user data to request
        req.user = decoded;
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
        
        return res.status(401).json({ 
            message: "Invalid token. Please login again." 
        });
    }
};

module.exports = isAuthenticated;