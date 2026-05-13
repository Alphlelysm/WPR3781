const router = require("express").Router()
const eventController =
    require("../controllers/EventController");

router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);
router.get("/:id", eventController.getEventDetails);

router.post("/", eventController.createEvent)
router.get("/admin/create", isAuthenticated, isAdmin, eventController.showCreateEvent);
router.post("/admin/create", isAuthenticated, isAdmin, eventController.createEvent);
router.get("/admin/edit/:id", isAuthenticated, isAdmin, eventController.showEditEvent);
router.post("/admin/edit/:id", isAuthenticated, isAdmin, eventController.updateEvent);
router.post("/admin/delete/:id", isAuthenticated, isAdmin, eventController.deleteEvent);


router.post(
    "/create",
    eventController.createEvent
);

module.exports =
    router;
