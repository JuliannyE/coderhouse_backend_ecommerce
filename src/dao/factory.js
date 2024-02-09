const mongoose = require("mongoose");
const config = require("../config/config");

async function loadPersistenceModule() {
  switch (config.persistence) {
    case "MONGO":
      const connection = await mongoose.connect(process.env.MONGO_URL);
      const { default: CartMongo } = await import("./mongo/carts.mongo.js");
      const { default: ProductMongo } = await import(
        "./mongo/products.mongo.js"
      );

      return { CartMongo, ProductMongo };
    default:
      throw new Error(
        `Persistence type '${config.persistence}' not supported.`
      );
  }
}

module.exports = {
  async createCartInstance() {
    const { CartMongo } = await loadPersistenceModule();
    return new CartMongo();
  },
  async createProductInstance() {
    const { ProductMongo } = await loadPersistenceModule();
    return new ProductMongo();
  },
};
