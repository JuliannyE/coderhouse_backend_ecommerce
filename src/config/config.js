require("dotenv").config()

const POLICIES = {
    PUBLIC: "PUBLIC",
    USER: "USER",
    ADMIN: "ADMIN",
    PREMIUM: "USER_PREMIUM"
  };

module.exports = {
    persistence : process.env.PERSISTENCE,
    MONGO_URL : process.env.MONGO_URL,
    COOKIE_SECRET : process.env.COOKIE_SECRET || "secret",
    JWT_SECRET : process.env.JWT_SECRET || "secret",
    POLICIES,
}