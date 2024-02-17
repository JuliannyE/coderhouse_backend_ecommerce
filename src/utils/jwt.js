const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "24h" });
  return token;
};

const verifyToken = token => jwt.verify(token, JWT_SECRET)

const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      error: "Not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, credentials) => {
    if (err) {
      return res.status(403).send({
        error: "Not authorized",
      });
    }

    req.user = credentials.user;

    next();
  });
};

module.exports = {
  generateToken,
  authTokenMiddleware,
  verifyToken,
};
