class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createProduct(product) {
    return await this.dao.create(product);
  }

  async getProductById(pid) {
    return await this.dao.getById(pid);
  }

  async getProducts(filter, filterOptions) {
    return await this.dao.get(filter, filterOptions);
  }

  async getProductByCode(code) {
    return await this.dao.get({ code });
  }

  async updateProduct(id, product) {
    return await this.dao.update(id, product);
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }
}

module.exports = ProductRepository;
