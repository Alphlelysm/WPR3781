const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { isAuthenticated } = require("../middleware/authMiddleware");

<<<<<<< HEAD
router.post("/:eventId", isAuthenticated, bookingController.bookEvent);
router.get("/history/my-bookings", isAuthenticated, bookingController.getUserBookings);

module.exports = router;
=======
const bookingController =
    require("../controllers/BookingsController");


router.post(
    "/create",
    bookingController.createBooking
);

module.exports =
    router;
>>>>>>> bde4ea4a485e823bb70352324cc3b1bc7992a144
