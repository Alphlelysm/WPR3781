const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingsController");
const isAuthenticated = require("../middleware/AuthMiddleware");

router.get("/my-bookings", isAuthenticated, bookingController.getUserBookings)
router.get("/history/my-bookings", isAuthenticated, bookingController.getUserBookings)

router.post("/", isAuthenticated, bookingController.createBooking)
router.post("/create", isAuthenticated, bookingController.createBooking)
router.post("/:eventId", isAuthenticated, bookingController.createBooking)

module.exports =
    router;
