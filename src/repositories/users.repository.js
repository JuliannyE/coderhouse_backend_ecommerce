class UserRespository {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(user) {
    return await this.dao.create(user);
  }

  async getUserByEmail(email) {
    return await this.dao.get({ email });
  }

  async updateUser(userId, userUpdated) {
    return await this.dao.update(userId, userUpdated);
  }

  async getUserById(userId) {
    return await this.dao.get({ _id: userId });
  }
}

module.exports = UserRespository;
