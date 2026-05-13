const router =
    require("express").Router();

const bookingController =
    require("../controllers/BookingsController");


router.post(
    "/create",
    bookingController.createBooking
);

module.exports =
    router;
