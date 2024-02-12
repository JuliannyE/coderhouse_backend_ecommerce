class UserRespository {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(user) {
    return await this.dao.create(user);
  }

  async getUserByEmail(email) {
    return await this.dao.get({email})
  }
}

module.exports = UserRespository;
