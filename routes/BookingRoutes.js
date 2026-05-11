const router =
    require("express").Router();

const bookingController =
    require("../Controllers/BookingsController");


router.post(
    "/create",
    bookingController.createBooking
);

module.exports =
    router;