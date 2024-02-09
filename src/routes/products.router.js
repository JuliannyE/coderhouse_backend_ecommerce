const { Router } = require("express");

const productController = require("../controllers/products.controller");

const router = Router();

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProductById);

router.post("/", productController.createProduct);

router.put("/:pid", productController.updateProduct);

router.delete("/:pid", productController.deleteProduct);

module.exports = router;
