const router = require("express").Router();

const adminController = require("../Controllers/AdminController");

const isAuthenticated = require("../Middleware/AuthMiddleware");
const isAdmin = require("../Middleware/RoleMiddleware");

// Admin dashboard
router.get(
    "/dashboard",
    isAuthenticated,
    isAdmin,
    adminController.getDashboard
);

module.exports = router;