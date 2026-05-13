const router = require("express").Router();

const adminController = require("../controllers/AdminController");

const isAuthenticated = require("../middleware/AuthMiddleware");
const isAdmin = require("../middleware/RoleMiddleware");

// Admin dashboard
router.get(
    "/dashboard",
    isAuthenticated,
    isAdmin,
    adminController.getDashboard
);

module.exports = router;
