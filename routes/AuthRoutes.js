const router =
    require("express").Router();

const authController =
    require("../Controllers/AuthController");


router.post(
    "/register",
    authController.registerUser
);

router.post(
    "/login",
    authController.loginUser
);

router.post(
    "/Views/public/login",
    authController.loginUser
);

module.exports =
    router;
