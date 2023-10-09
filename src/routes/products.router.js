const { Router } = require("express")
const ProductModel = require("../dao/models/products.model")

const router = Router()

router.get("/", async (req, res) => {
    const { limit } = req.query
    const productos = await ProductModel.find().limit(limit)

    res.json({
        result: "success",
        payload: productos
    })
})

router.get("/:pid", async (req, res) => {
    const { pid } = req.params

    try {

        const producto = await ProductModel.findById(pid)

        if (!producto) {
            res.json({
                error: `Producto con id ${pid} no encontrado`
            })
        } else {
            res.json({
                result: "success",
                payload: producto
            })
        }

    } catch (error) {
        res.status(400).json({
            error
        })
    }

})

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    try {

        const existeProducto = await ProductModel.findOne({ code })

        if (existeProducto) {
            throw `Producto con code ${code} ya existe`
        }

        const newProduct = new ProductModel({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        })

        await newProduct.save()

        const io = req.app.get("io")

        if (io) {
            console.log({newProduct})
            io.emit("nuevo_producto", newProduct)
        }

        res.json({
            result: "success",
            payload: newProduct
        })

    } catch (error) {
        res.status(400).json({
            error
        })
    }


})

router.put("/:pid", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails, status } = req.body
    const productoActualizado = { title, description, code, price, stock, category, thumbnails, status }

    try {
        const producto = await ProductModel.findById(req.params.pid)

        if (producto) {
            await ProductModel.findByIdAndUpdate(req.params.pid, productoActualizado)

            res.json({
                result: "success",
                payload: productoActualizado
            })
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
        const pid = req.params.pid
        const producto = await ProductModel.findById(pid)

        if (producto) {
            await ProductModel.findByIdAndDelete(producto.id)

            const io = req.app.get("io")

            if (io) {
                io.emit("producto_eliminado", pid)
            }

            res.json({
                result: "success",
            })
        } else {
            throw `Producto con id ${pid} no encontrado`
        }

    } catch (error) {
        res.json({
            error
        })
    }
})

module.exports = router