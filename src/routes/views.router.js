const { Router } = require("express");
const CartModel = require("../dao/models/carts.model");
const ProductModel = require("../dao/models/products.model");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

// sessions...
router.get("/", async (req, res) => {
  const { msg } = req.query;

  if (req.session?.user) {
    return res.redirect("/products");
  }

  res.render("login", {
    msg,
  });
});

router.get("/register", async (req, res) => {
  const { msg } = req.query;

  if (req.session?.user) {
    return res.redirect("/");
  }

  res.render("register", {
    msg,
  });
});

// websockets...

router.get("/realtimeproducts", authMiddleware, async (req, res) => {
  res.render("realtimeProducts", {
    name: "Julianny ",
  });
});

router.get("/chat", authMiddleware, async (req, res) => {
  res.render("chat", {
    name: "Julianny ",
  });
});

// products...

router.get("/carts/:cid", authMiddleware, async (req, res) => {
  const { cid } = req.params;

  const carrito = await CartModel.findById(cid)
    .populate("products.product")
    .lean();

  if (!carrito) {
    return res.status(404).send("cart not exist");
  }

  res.render("cart", {
    cart: carrito,
    name: "Julianny",
  });
});

router.get("/products/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id).lean();

  if (!product) {
    return res.status(404).send("product not exist");
  }

  res.render("productById", {
    product,
    name: "julianny",
  });
});

router.get("/products", authMiddleware, async (req, res) => {
  const { user } = req.session;

  const { limit = 5, page = 1 } = req.query;

  const productos = await ProductModel.paginate(
    {},
    {
      limit,
      page,
      lean: true,
    }
  );

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  productos.prevLink = productos.hasPrevPage
    ? `${baseUrl}/api/products?limit=${limit}&page=${parseInt(page) - 1}`
    : null;
  productos.nextLink = productos.hasNextPage
    ? `${baseUrl}/api/products?limit=${limit}&page=${parseInt(page) + 1}`
    : null;

  res.render("product", {
    user,
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

router.get("/profile", authMiddleware, async (req, res) => {
  const { user } = req.session;

  res.render("profile", { user });
});

module.exports = router;
