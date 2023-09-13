const { Router } = require("express")
const ProductManager = require("../ProductManager")

const router = Router()

const Inventario = new ProductManager("./src/productos.json")

router.get("/", async (req, res) => {
    const { limit } = req.query
    const productos = await Inventario.getProducts()

    if (limit > 0) {
        res.json(productos.slice(0, limit))
    } else {
        res.json(productos)
    }
})

router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    const producto = await Inventario.getProductById(pid)

    if (!producto) {
        res.json({
            error: `Producto con id ${pid} no encontrado`
        })
    } else {
        res.json(producto)
    }
})

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    try {

        const existeProducto = await Inventario.getProductByCode(code)

        if (existeProducto) {
            throw `Producto con code ${code} ya existe`
        }

        const newProduct = await Inventario.addProduct({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        })

        res.json(newProduct);

    } catch (error) {
        res.json({
            error
        })
    }


})

router.put("/:pid", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails, status } = req.body
    const productoActualizado = { title, description, code, price, stock, category, thumbnails, status }

    try {
        const producto = await Inventario.getProductById(req.params.pid)

        if (producto) {
            await Inventario.updateProduct(producto.id, productoActualizado)
            productoActualizado.id = producto.id
            res.json(productoActualizado)
        } else {
            throw `Producto con id ${req.params.pid} no encontrado`
        }

    } catch (error) {
        res.json({
            error
        })
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const producto = await Inventario.getProductById(req.params.pid)

        if (producto) {
            await Inventario.deleteProduct(producto.id)
            return res.json(producto)
        } else {
            throw `Producto con id ${req.params.pid} no encontrado`
        }

    } catch (error) {
        res.json({
            error
        })
    }
})

module.exports = router