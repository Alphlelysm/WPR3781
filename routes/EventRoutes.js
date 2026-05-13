
<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
=======
const eventController =
    require("../controllers/EventController");
>>>>>>> bde4ea4a485e823bb70352324cc3b1bc7992a144

router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);
router.get("/:id", eventController.getEventDetails);

router.get("/admin/create", isAuthenticated, isAdmin, eventController.showCreateEvent);
router.post("/admin/create", isAuthenticated, isAdmin, eventController.createEvent);
router.get("/admin/edit/:id", isAuthenticated, isAdmin, eventController.showEditEvent);
router.post("/admin/edit/:id", isAuthenticated, isAdmin, eventController.updateEvent);
router.post("/admin/delete/:id", isAuthenticated, isAdmin, eventController.deleteEvent);

<<<<<<< HEAD
module.exports = router;
=======
router.post(
    "/create",
    eventController.createEvent
);

module.exports =
    router;
>>>>>>> bde4ea4a485e823bb70352324cc3b1bc7992a144
