const { Router } = require("express");
const CartModel = require("../dao/models/carts.model");
const ProductModel = require("../dao/models/products.model");

const router = Router();

router.get("/", async (req, res) => {
  let testUser = {
    name: "julianny",
  };

  const products = await ProductModel.find().lean();
  res.render("home", {
    name: testUser.name,
    products,
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeProductss", {
    name: "Julianny ",
  });
});

router.get("/chat", async (req, res) => {
  res.render("chat", {
    name: "Julianny ",
  });
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  const carrito = await CartModel.findById(cid)
    .populate("products.product")
    .lean();

  if (!carrito) {
    return res.status(404).send("cart not exist")
  }

  res.render("cart", {
    cart: carrito,
    name: "Julianny",
  });
});

router.get("/products/:id", async (req,res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id).lean()

  if (!product) {
    return res.status(404).send("product not exist")
  }

  res.render("productById", {
    product,
    name: "julianny"
  })
} )

router.get("/products", async (req, res) => {
  let testUser = {
    name: "julianny",
  };

  const { limit = 5, page = 1 } = req.query;

  const productos = await ProductModel.paginate({}, {
    limit,
    page,
    lean: true
  });

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  productos.prevLink = productos.hasPrevPage
    ? `${baseUrl}/api/products?limit=${limit}&page=${
        parseInt(page) - 1
      }`
    : null;
  productos.nextLink = productos.hasNextPage
    ? `${baseUrl}/api/products?limit=${limit}&page=${
        parseInt(page) + 1
      }`
    : null;

  res.render("product", {
    name: testUser.name,
    products: productos.docs,
    totalPages: productos.totalPages,
    prevPage: productos.prevPage,
    nextPage: productos.nextPage,
    page,
    hasPrevPage: productos.hasPrevPage,
    hasNextPage: productos.hasNextPage,
    prevLink: productos.prevLink,
    nextLink: productos.nextLink,
  });
});

module.exports = router;
