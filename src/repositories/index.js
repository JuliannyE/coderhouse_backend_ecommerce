const factory = require("../dao/factory");
const CartRepository = require("./carts.respository");
const ProductRepository = require("./products.repository");
const UserRespository = require("./users.repository");

const initCartServices = async () => {
  const dao = await factory.createCartInstance();
  const repository = new CartRepository(dao);
  return repository
};

const initProductServices = async () => {
  const dao = await factory.createProductInstance();
  const repository = new ProductRepository(dao);
  return repository
};

const initUserServices = async () => {
  const dao = await factory.createUserInstance();
  const repository = new UserRespository(dao);
  return repository
};

module.exports = {
  async CartsService() {
    const service = await initCartServices()
    return service
  },
  async ProductService() {
    const service = await initProductServices()
    return service
  },
  async UserService() {
    const service = await initUserServices()
    return service
  },
};
