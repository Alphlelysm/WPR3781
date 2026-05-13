// Middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');

const getCookieValue = (cookieHeader, name) => {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

const isAuthenticated = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const cookieToken = getCookieValue(req.headers.cookie, "token");
        const token = bearerToken || cookieToken;

        if (!token) {
            return res.status(401).json({ 
                message: "Access denied. No token provided." 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

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
