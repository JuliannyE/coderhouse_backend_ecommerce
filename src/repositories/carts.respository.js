class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createCart(products) {
    const cart = await this.dao.create(products);
    return cart
  }

  async getCartById(cid) {
    const cart = await this.dao.getById(cid);
    return cart
  }

  async updateCartProducts(cart , products) {
    return await this.dao.update(cart , products);
  }
}

module.exports = CartRepository;