const router =
    require("express").Router();

const authController =
    require("../Controllers/AuthController");


router.post(
    "/register",
    authController.registerUser
);

router.post(
    "/Views/public/login",
    authController.loginUser
);

module.exports =
    router;