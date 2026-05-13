const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/my-bookings", isAuthenticated, bookingController.getUserBookings)
router.get("/history/my-bookings", isAuthenticated, bookingController.getUserBookings)

router.post("/", isAuthenticated, bookingController.createBooking)
router.post("/create", isAuthenticated, bookingController.createBooking)
router.post("/:eventId", isAuthenticated, bookingController.createBooking)

router.post(
    "/create",
    bookingController.createBooking
);

module.exports =
    router;
