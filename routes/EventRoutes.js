const router =
    require("express").Router();

const eventController =
    require("../Controllers/EventController");


router.get(
    "/",
    eventController.getEvents
);

router.post(
    "/create",
    eventController.createEvent
);

module.exports =
    router;