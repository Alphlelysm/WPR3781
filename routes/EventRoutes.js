const router = require("express").Router()
const eventController =
    require("../controllers/EventController");
const isAuthenticated =
    require("../middleware/AuthMiddleware");
const isAdmin =
    require("../middleware/RoleMiddleware");

router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);

router.post("/admin/create", isAuthenticated, isAdmin, eventController.createEvent);
router.post("/admin/edit/:id", isAuthenticated, isAdmin, eventController.updateEvent);
router.post("/admin/delete/:id", isAuthenticated, isAdmin, eventController.deleteEvent);

router.post("/", isAuthenticated, isAdmin, eventController.createEvent)
router.post("/create", isAuthenticated, isAdmin, eventController.createEvent);
router.patch("/:id", isAuthenticated, isAdmin, eventController.updateEvent);
router.delete("/:id", isAuthenticated, isAdmin, eventController.deleteEvent);

router.get("/:id", eventController.getEventDetails);

module.exports =
    router;
