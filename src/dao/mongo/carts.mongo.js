const { isValidObjectId } = require("mongoose");
const CartModel = require("../models/carts.model");

class Carts {
  async create(products) {
    const newCart = new CartModel();

    newCart.products = products;

    await newCart.save();
    return newCart
  }
  
  async getById(id) {
    if (!isValidObjectId(id)) return null;
    const carrito = await CartModel.findById(id).populate("products.product");

    return carrito;
  }

  async update(cart , products) {
    cart.products = products;
    await cart.save();
    return cart;
  }
}

module.exports = Carts;
