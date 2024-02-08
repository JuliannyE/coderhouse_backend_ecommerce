const { Router } = require("express");
const CartController = require("../controllers/carts.controller");
const cartController = new CartController()

const router = Router();

router.post("/", cartController.createCart);

router.get("/:cid", cartController.getCartById);

router.post("/:cid/products/:pid", cartController.insertProduct);

router.delete("/:cid/products/:pid", cartController.deleteProductById);

router.put("/:cid", cartController.updateCart);

router.put("/:cid/products/:pid", cartController.updateProductQuantity);

router.delete("/:cid", cartController.deleteCartProducts);

module.exports = router;
