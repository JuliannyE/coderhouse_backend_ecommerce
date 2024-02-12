const config = require("../config/config");
const db = require("./db");

async function loadPersistenceModule() {
  switch (config.persistence) {
    case "MONGO":
      await db()
      const { default: CartMongo } = await import("./mongo/carts.mongo.js");
      const { default: UserMongo } = await import("./mongo/users.mongo.js");
      const { default: ProductMongo } = await import(
        "./mongo/products.mongo.js"
      );

      return { CartMongo, ProductMongo, UserMongo};
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
  async createUserInstance() {
    const { UserMongo } = await loadPersistenceModule();
    return new UserMongo();
  },
};
