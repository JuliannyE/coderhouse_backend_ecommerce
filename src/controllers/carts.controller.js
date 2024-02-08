const { CartsService } = require('../repositories')
class CartController {

  async createCart(req, res) {
    const { products } = req.body;

    try {
      const cartsService = await CartsService()
      const newCart = await cartsService.createCart(products);

      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("error: revise los logs del server");
    }
  }

  async getCartById(req, res) {
    const { cid } = req.params;
    try {
      const cartsService = await CartsService()
      const carrito = await cartsService.getCartById(cid)

      if (!carrito) {
        return res.status(404).json({
          result: "Not found"
        })
      };

      res.json({
        result: "success",
        payload: carrito,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  async deleteCartProducts(req, res) {
    // eliminar los productos del carrito
  
    try {
      const { cid } = req.params;
      const cartsService = await CartsService()
      const carrito = await cartsService.getCartById(cid)

      if (!carrito) {
        return res.status(404).json({
          result: "Not found"
        })
      };

      const newCart = await cartsService.updateCartProducts(carrito, [])
      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
  
  async deleteProductById (req, res) {
    // eliminar del carrito el pid
  
    try {
      const { cid, pid } = req.params;
      const cartsService = await CartsService()

      const carrito = await cartsService.getCartById(cid)
      if (!carrito) {
        return res.status(404).json({
          result: "Not found"
        })
      };
  
      const products = carrito.products.filter((p) => p.product != pid);
      const newCart = await cartsService.updateCartProducts(carrito, products)

      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  async insertProduct (req, res) {
    try {
      const { cid, pid } = req.params;
      const cartsService = await CartsService()

      const carrito = await cartsService.getCartById(cid)
      if (!carrito) {
        return res.status(404).json({
          result: "Not found"
        })
      };
  
      const productoExiste = carrito.products.find((p) => p.product == pid || p.product._id == pid);
  
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
      
      const newCart = await cartsService.updateCartProducts(carrito, carrito.products)

      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  async updateCart(req, res) {
    // actualizar carrito con productos
  
    try {
      const { cid } = req.params;
      const { products } = req.body;

      const cartsService = await CartsService()

      const carrito = await cartsService.getCartById(cid)
      if (!carrito) {
        return res.status(404).json({
          result: "Not found"
        })
      };

      const newCart = await cartsService.updateCartProducts(carrito, products)
      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  async updateProductQuantity (req, res)  {
    // actualizar cantidad de productos
  
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if(quantity <= 0) {
        return res.status(400).json({
          result: "Bad quantity"
        })
      }
      const cartsService = await CartsService()

      const carrito = await cartsService.getCartById(cid)
      if (!carrito) {
        return res.status(404).json({
          result: "Not found"
        })
      };
  
      carrito.products.forEach((p) => {
        if (p.product._id == pid) {
          p.quantity = quantity;
        }
      });
  
      const newCart = await cartsService.updateCartProducts(carrito, carrito.products)

      res.json({
        result: "success",
        payload: newCart,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
};

module.exports = CartController;
