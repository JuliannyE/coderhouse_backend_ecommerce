const mongoose = require("mongoose");
const config = require("../config/config");

async function loadPersistenceModule() {
  switch (config.persistence) {
    case "MONGO":
      const connection = await mongoose.connect(process.env.MONGO_URL);
      const { default: CartMongo } = await import("./mongo/carts.mongo.js");
      
      return CartMongo;
    default:
      throw new Error(`Persistence type '${config.persistence}' not supported.`);
  }
}

module.exports = {
  async createCartInstance() {
    const Cart = await loadPersistenceModule();
    return new Cart();
  }
};
