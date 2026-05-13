const router =
    require("express").Router();

const enquiryController =
    require("../controllers/EnquiryController");

const isAuthenticated =
    require("../middleware/AuthMiddleware");



router.get("/", enquiryController.getAllEnquiries)    
// Submit enquiry
router.post(
    "/submit",

    isAuthenticated,

    enquiryController.submitEnquiry
);

router.patch("/:id/resolve", isAuthenticated, enquiryController.resolveEnquiry)
router.delete("/:id", isAuthenticated, enquiryController.deleteEnquiry)

module.exports =
    router;
