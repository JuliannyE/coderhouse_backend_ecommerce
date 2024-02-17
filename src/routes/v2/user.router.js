const Router = require("./router");
const { POLICIES } = require("../../config/config");

class UsersRouter extends Router {
  init() {
    this.get("/", [POLICIES.PUBLIC], (req, res) => {
      res.sendSuccess("Hola coders");
    });

    this.get("/currentUser", [POLICIES.USER, POLICIES.PREMIUM], (req, res) => {
      res.sendSuccess(req.user);
    });
  }
}

module.exports = UsersRouter;
