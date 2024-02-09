const { ProductService } = require("../repositories");

class ProductController {
  async createProduct(req, res) {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    try {
      const productService = await ProductService();
      const existeProducto = await productService.getProductByCode(code);

      if (existeProducto) {
        return res.status(400).json({
          result: `Producto con code ${code} ya existe`,
        });
      }

      const newProduct = await productService.createProduct({
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
      });

      const io = req.app.get("io");

      if (io) {
        console.log("nuevo_producto", { newProduct });
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
  }

  async updateProduct(req, res) {
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

    const { pid } = req.params;

    try {
      const productService = await ProductService();
      const producto = await productService.getProductById(pid);

      if (!producto) {
        return res.status(404).json({
          result: "Not found",
        });
      }

      await productService.updateProduct(pid, productoActualizado);

      res.json({
        result: "success",
        payload: productoActualizado,
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  }

  async getProductById(req, res) {
    const { pid } = req.params;
    try {
      const productService = await ProductService();
      const producto = await productService.getProductById(pid);

      if (!producto) {
        return res.status(404).json({
          result: "Not found",
        });
      }

      res.json({
        result: "success",
        payload: producto,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  async getProducts(req, res)  {
    const { limit = 10, page = 1, sort = "asc", category, stock } = req.query;
  
    try {
      const filter = {};
  
      if (category) {
        filter.category = category;
      }
  
      if (stock) {
        filter.stock = stock;
      }

      const productService = await ProductService();
      const productos = await productService. getProducts(filter, {
        limit,
        page,
        sort: { price: sort },
      });
  
    //   const productos = await ProductModel.paginate(filter, {
    //     limit,
    //     page,
    //     sort: { price: sort },
    //   });
  
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
  }

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const productService = await ProductService();
      const producto = await productService.getProductById(pid);

      if (!producto) {
        return res.status(404).json({
          result: "Not found",
        });
      }

      await productService.deleteProduct(pid)

      const io = req.app.get("io");

      if (io) {
        console.log("producto eliminado pid:", pid);
        io.emit("producto_eliminado", pid);
      }

      res.json({
        result: "success",
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  }
}

module.exports = new ProductController();
