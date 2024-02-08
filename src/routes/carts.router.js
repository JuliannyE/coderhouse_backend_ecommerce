const { Router } = require("express");
const CartController = require("../controllers/carts.controller");

const CartModel = require("../dao/models/carts.model");

const router = Router();

router.post("/", CartController.createCart);

router.get("/:cid", CartController.getCartById);

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await CartModel.findById(cid);
    if (!carrito) throw `Carrito con id: ${cid} no existe`;

    const productoExiste = carrito.products.find((p) => p.product == pid);

    if (productoExiste) {
      productoExiste.quantity++;
      carrito.products = carrito.products.map((p) =>
        p.id == pid ? productoExiste : p
      );
    } else {
      carrito.products.push({
        product: pid,
        quantity: 1,
      });
    }

    await carrito.save();
    res.json({
      result: "success",
      payload: carrito,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  // eliminar del carrito el pid

  try {
    const { cid, pid } = req.params;
    const carrito = await CartModel.findById(cid);
    if (!carrito) throw `Carrito con id: ${cid} no existe`;

    carrito.products = carrito.products.filter((p) => p.product != pid);

    await carrito.save();
    res.json({
      result: "success",
      payload: carrito,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.put("/:cid", async (req, res) => {
  // actualizar carrito con productos

  try {
    const { cid } = req.params;
    const { products } = req.body;
    const carrito = await CartModel.findById(cid);
    if (!carrito) throw `Carrito con id: ${cid} no existe`;

    carrito.products = products;

    await carrito.save();
    res.json({
      result: "success",
      payload: carrito,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  // actualizar cantidad de productos

  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const carrito = await CartModel.findById(cid);
    if (!carrito) throw `Carrito con id: ${cid} no existe`;

    carrito.products.forEach((p) => {
      if (p.product == pid) {
        console.log("actualizado");
        p.quantity = quantity;
      }
    });

    carrito.products = carrito.products.filter((p) => p.quantity > 0);

    await carrito.save();
    res.json({
      result: "success",
      payload: carrito,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.delete("/:cid", async (req, res) => {
  // eliminar los productos del carrito

  try {
    const { cid } = req.params;
    const carrito = await CartModel.findById(cid);
    if (!carrito) throw `Carrito con id: ${cid} no existe`;

    carrito.products = [];

    await carrito.save();
    res.json({
      result: "success",
      payload: carrito,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

module.exports = router;
