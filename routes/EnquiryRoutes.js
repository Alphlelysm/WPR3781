const router =
    require("express").Router();

const enquiryController =
    require("../controllers/EnquiryController");

const isAuthenticated =
    require("../middleware/AuthMiddleware");


// Submit enquiry
router.post(
    "/submit",

    isAuthenticated,

    enquiryController.submitEnquiry
);


module.exports =
    router;
