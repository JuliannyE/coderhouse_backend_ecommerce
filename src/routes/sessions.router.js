const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/users.controller");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const passportCall = require("../middlewares/passportCall.middleware");
const authorizationMiddleware = require("../middlewares/authorization.middleware");

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/fail_register" }),
  async (req, res) => {
    const session = {
      name: req.user.name,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };

    const accessToken = generateToken(session);
    req.session.user = accessToken;

    res.redirect("/products");
  }
);

router.get("/fail_register", (req, res) => {
  res.send({ error: "failed register" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/fail_login" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({
        result: "Error",
        error: "Credenciales invalidas",
      });
    }

    const session = {
      name: req.user.name,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };

    const accessToken = generateToken(session);
    req.session.user = accessToken;

    res.redirect("/products");
  }
);

router.get("/fail_login", (req, res) => {
  res.send({ error: "failed login" });
});

router.get("/logout", userController.logout);

// router.get("/current", authMiddleware, userController.getCurrentUser);
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  authorizationMiddleware("user"),
  (req, res) => {
    res.send(req.user);
  }
);
// router.get("/current", passportCall("jwt"), (req, res) => {
//   res.send("req.user");
// });

router.post("/recovery", userController.recoveryUser);

module.exports = router;
