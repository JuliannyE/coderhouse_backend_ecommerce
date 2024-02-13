const { isValidObjectId } = require("mongoose");
const UserModel = require("../models/users.model");

class Users {
  constructor() {
    this.model = UserModel;
  }

  async create(user) {
    const newUser = new this.model(user);
    await newUser.save();
    return newUser;
  }

  async get(filter) {
    const user = await this.model.findOne(filter);

    if (!user) {
      return null;
    }

    return user;
  }

  async update(id, data) {
    const user = await this.model.findByIdAndUpdate(id, data, { new: true });

    return user
  }
}

module.exports = Users;
