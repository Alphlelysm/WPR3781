const router =
    require("express").Router();

const enquiryController =
    require("../controllers/EnquiryController");

const isAuthenticated =
    require("../middleware/AuthMiddleware");
const isAdmin =
    require("../middleware/RoleMiddleware");



router.get("/", isAuthenticated, isAdmin, enquiryController.getAllEnquiries)
// Submit enquiry
router.post(
    "/submit",

    enquiryController.submitEnquiry
);

router.patch("/:id/resolve", isAuthenticated, isAdmin, enquiryController.resolveEnquiry)
router.delete("/:id", isAuthenticated, isAdmin, enquiryController.deleteEnquiry)

module.exports =
    router;
