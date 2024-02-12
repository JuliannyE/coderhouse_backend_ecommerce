const mongoose = require("mongoose");

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
