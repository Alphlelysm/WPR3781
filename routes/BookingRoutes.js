const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/:eventId", isAuthenticated, bookingController.bookEvent);
router.get("/history/my-bookings", isAuthenticated, bookingController.getUserBookings);

module.exports = router;