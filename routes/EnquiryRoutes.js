const router =
    require("express").Router();

const enquiryController =
    require("../controllers/EnquiryController");

const isAuthenticated =
    require("../middleware/AuthMiddleware");



router.get("/", isAuthenticated, enquiryController.getAllEnquiries)
// Submit enquiry
router.post(
    "/submit",

    enquiryController.submitEnquiry
);

router.patch("/:id/resolve", isAuthenticated, enquiryController.resolveEnquiry)
router.delete("/:id", isAuthenticated, enquiryController.deleteEnquiry)

module.exports =
    router;
