const passport = require("passport");
const Router = require("./router");
const { POLICIES } = require("../../config/config");
const { generateToken } = require("../../utils/jwt");
const usersController = require("../../controllers/users.controller");

class SessionsRouter extends Router {
  init() {
    this.post(
      "/login",
      [POLICIES.PUBLIC],
      passport.authenticate("login", { failureRedirect: "fail_login" }),
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

        const token = generateToken(session);
        req.session.user = token;

        res.sendSuccess({ token });
      }
    );

    this.get("/fail_login", [POLICIES.PUBLIC], (req, res) => {
      res.sendUserError("failed login");
    });

    this.post(
      "/register",
      [POLICIES.PUBLIC],
      passport.authenticate("register", { failureRedirect: "fail_register" }),
      async (req, res) => {
        const session = {
          name: req.user.name,
          lastName: req.user.lastName,
          age: req.user.age,
          email: req.user.email,
          role: req.user.role,
        };

        const token = generateToken(session);
        req.session.user = token;

        res.sendSuccess({ token });
      }
    );

    this.get("/fail_register", [POLICIES.PUBLIC], (req, res) => {
      res.sendUserError("failed register");
    });

    this.post("/recovery", [POLICIES.PUBLIC], usersController.recoveryUser);

    this.get("/logout", [POLICIES.PUBLIC], usersController.logout);
  }
}

module.exports = SessionsRouter;
