const factory = require("../dao/factory");
const CartRepository = require("./carts.respository");

const initCartServices = async () => {
  const cartDao = await factory.createCartInstance();
  const repository = new CartRepository(cartDao);
  return repository
};

module.exports = {
  async CartsService() {
    const service = await initCartServices()
    return service
  },
};
