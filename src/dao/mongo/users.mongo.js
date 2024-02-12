const { isValidObjectId } = require("mongoose");
const UserModel = require("../models/users.model");

class Users {

  constructor(){
    this.model = UserModel
  }

  async create({
    name,
    lastName,
    age,
    email,
    password
  }) {
    const newUser = new this.model({
      name,
      lastName,
      age,
      email,
      password
    });
    await newUser.save();
    return newUser;
  }

  async get(filter) {
    const user = await this.model.findOne(filter)

    if (!user) {
      return null;
    }

    return user;
  }
}

module.exports = Users;
