const factory = require("../dao/factory");

const CartController = {
  async createCart(req, res) {
    const { products } = req.body;

    try {
      const cartsService = await factory.createCartInstance();
      const newCart = await cartsService.create(products);

      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("error: revise los logs del server");
    }
  },
  async getCartById(req, res) {
    const { cid } = req.params;
    try {
      const cartsService = await factory.createCartInstance();
      const carrito = await cartsService.getById(cid);

      if (!carrito) {
        throw `Carrito con id ${cid} no existe`;
      }

      res.json({
        result: "success",
        payload: carrito,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  },
};

module.exports = CartController;
