const router =
    require("express").Router();

const enquiryController =
    require("../Controllers/EnquiryController");

const isAuthenticated =
    require("../Middleware/AuthMiddleware");


// Submit enquiry
router.post(
    "/submit",

    isAuthenticated,

    enquiryController.submitEnquiry
);


module.exports =
    router;