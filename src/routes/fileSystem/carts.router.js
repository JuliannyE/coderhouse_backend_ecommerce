const { Router } = require("express")
const CartManager = require("../CartManager")

const router = Router()

const Carrito = new CartManager("./src/carritos.json")

router.post("/", async (req, res) => {

    const { products } = req.body

    try {
        const nuevoCarrito = await Carrito.create(products)

        res.json(nuevoCarrito)
    } catch (error) {
        console.log(error)
        res.json({ error })
    }


})

router.get("/:cid", async (req, res) => {
    const carrito = await Carrito.getCarritoById(req.params.cid)
    res.json(carrito)
})

router.post("/:cid/products/:pid", async (req, res) => {

    try {

        const { cid, pid } = req.params
        const carrito = await Carrito.getCarritoById(cid)
        if (!carrito) throw `Carrito con id: ${cid} no existe`

        const carritoActualizado = await Carrito.agregarProducto(cid, pid)
        res.json(carritoActualizado)
    } catch (error) {
        console.log(error)
        res.json({ error })
    }

})

module.exports = router