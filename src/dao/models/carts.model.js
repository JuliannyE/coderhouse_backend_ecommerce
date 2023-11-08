const mongoose = require("mongoose");

const cartCollection = "Carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

const CartModel = mongoose.model(cartCollection, cartSchema);

module.exports = CartModel;
