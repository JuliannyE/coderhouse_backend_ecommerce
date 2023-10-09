const mongoose = require('mongoose');

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: { type: Number, require: true },
    }
  ]
});

const CartModel = mongoose.model(cartCollection, cartSchema);

module.exports = CartModel;
