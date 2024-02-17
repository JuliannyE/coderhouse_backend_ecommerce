const { verifyToken } = require("../utils/jwt");

const POLICIES = {
  PUBLIC: "PUBLIC",
  USER: "USER",
  ADMIN: "ADMIN",
};

const handlePolicies =
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

    let user = verifyToken(token)
    
    if (!policies.includes(user.role.toUpperCase())) {
      return res.status(403).send({
        status: "error",
        error: "Unauthorized",
      });
    }

    req.user = user;
    next();
  };

module.exports = handlePolicies;
