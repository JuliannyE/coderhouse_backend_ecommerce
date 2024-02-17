const { Router: expressRouter } = require("express");
const { POLICIES } = require("../../config/config");
const { verifyToken } = require("../../utils/jwt");

class Router {
  // router = expressRouter()
  constructor() {
    this.router = expressRouter();
    this.init();
  }

  init() {} // clases heredadas

  getRouter() {
    return this.router;
  }

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => async (...params) => {
      try {
        cb.apply(this, params);
      } catch (error) {
        console.log("error on applyCallbacks", error);

        params[1].status(500).send(error);
      }
    });
  }

  generateCustomResponse(req, res, next) {
    res.sendSuccess = (payload) => res.send({ status: "success", payload });
    res.sendServerError = (error) =>
      res.status(500).send({ status: "error", error });
    res.sendUserError = (error) =>
      res.status(400).send({ status: "error", error });

    next();
  }

  handlerPolicies(policies) {
    return;
  }

  handlePolicies =
    (policies = []) =>
    (req, res, next) => {
      if (policies[0] === POLICIES.PUBLIC) return next();
      const authHeaders = req.headers.authorization;

      if (!authHeaders)
        return res.status(401).send({
          status: "error",
          error: "Unauthorized",
        });
      const token = authHeaders.split(" ")[1];

      try {
        let { user } = verifyToken(token);

        if (!policies.includes(user.role)) {
          return res.status(403).send({
            status: "error",
            error: "Unauthorized",
          });
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(403).send({
          
          status: "error",
          error: "Unauthorized",
        });
      }
    };

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
}

module.exports = Router;
