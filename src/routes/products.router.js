const { Router } = require("express");
const ProductModel = require("../dao/models/products.model");

const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort = "asc", category, stock } = req.query;
  //   const productos = await ProductModel.find(query).limit(limit).skip(page)
  //.sort({ price: sort });

  try {
    const filter = {}

    if(category) {
        filter.category = category
    }

    if(stock) {
        filter.stock = stock
    }

    const productos = await ProductModel.paginate(filter, {
      limit,
      page,
      sort: { price: sort },
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    productos.prevLink = productos.hasPrevPage
      ? `${baseUrl}/api/products?limit=${limit}&page=${
          parseInt(page) - 1
        }&sort=${sort}`
      : null;
    productos.nextLink = productos.hasNextPage
      ? `${baseUrl}/api/products?limit=${limit}&page=${
          parseInt(page) + 1
        }&sort=${sort}`
      : null;

    res.json({
      result: "success",
      payload: productos.docs,
      totalPages: productos.totalPages,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.prevLink,
      nextLink: productos.nextLink,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      payload: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const producto = await ProductModel.findById(pid);

    if (!producto) {
      res.json({
        error: `Producto con id ${pid} no encontrado`,
      });
    } else {
      res.json({
        result: "success",
        payload: producto,
      });
    }
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  try {
    const existeProducto = await ProductModel.findOne({ code });

    if (existeProducto) {
      throw `Producto con code ${code} ya existe`;
    }

    const newProduct = new ProductModel({
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    });

    await newProduct.save();

    const io = req.app.get("io");

    if (io) {
      console.log({ newProduct });
      io.emit("nuevo_producto", newProduct);
    }

    res.json({
      result: "success",
      payload: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

router.put("/:pid", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status,
  } = req.body;
  const productoActualizado = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status,
  };

  try {
    const producto = await ProductModel.findById(req.params.pid);

    if (producto) {
      await ProductModel.findByIdAndUpdate(req.params.pid, productoActualizado);

      res.json({
        result: "success",
        payload: productoActualizado,
      });
    } else {
      throw `Producto con id ${req.params.pid} no encontrado`;
    }
  } catch (error) {
    res.json({
      error,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const producto = await ProductModel.findById(pid);

    if (producto) {
      await ProductModel.findByIdAndDelete(producto.id);

      const io = req.app.get("io");

      if (io) {
        io.emit("producto_eliminado", pid);
      }

      res.json({
        result: "success",
      });
    } else {
      throw `Producto con id ${pid} no encontrado`;
    }
  } catch (error) {
    res.json({
      error,
    });
  }
});

module.exports = router;
