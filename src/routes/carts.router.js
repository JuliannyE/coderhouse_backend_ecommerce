const { Router } = require("express");
const cartController = require("../controllers/carts.controller");

const router = Router();

router.post("/", cartController.createCart);

router.get("/:cid", cartController.getCartById);

router.post("/:cid/products/:pid", cartController.insertProduct);

router.delete("/:cid/products/:pid", cartController.deleteProductById);

router.put("/:cid", cartController.updateCart);

router.put("/:cid/products/:pid", cartController.updateProductQuantity);

router.delete("/:cid", cartController.deleteCartProducts);

module.exports = router;
