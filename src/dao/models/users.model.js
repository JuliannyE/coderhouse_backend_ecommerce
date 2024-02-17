const mongoose = require("mongoose");
const { POLICIES } = require("../../config/config");

const collectionName = "Users";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.keys(POLICIES).map( p => POLICIES[p]),
    default: "user"
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    minlength: 6,
  },
  age: {
    type: Number,
    min: 1,
  },
});

const UserModel = mongoose.model(collectionName, schema);

module.exports = UserModel;
