const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/users.controller");

const router = Router();

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.get("/logout", userController.logout);

router.get("/current", authMiddleware, userController.getCurrentUser);

module.exports = router;
