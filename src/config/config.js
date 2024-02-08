require("dotenv").config()

module.exports = {
    persistence : process.env.PERSISTENCE,
    MONGO_URL : process.env.MONGO_URL
}