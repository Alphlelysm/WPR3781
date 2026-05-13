const router =
    require("express").Router();

const eventController =
    require("../controllers/EventController");


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
