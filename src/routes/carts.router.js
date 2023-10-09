const { Router } = require("express")
const CartModel = require("../dao/models/carts.model")

const router = Router()

router.post("/", async (req, res) => {

    const { products } = req.body

    try {
        const newCart = new CartModel({
            products
        })

        await newCart.save()

        res.json({
            result: "success",
            payload: newCart
        })

    } catch (error) {
        console.log(error)
        res.json({ error })
    }


})

router.get("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const carrito = await CartModel.findById(cid)

        if (!carrito) {
            throw `Carrito con id ${cid} no existe`
        }

        res.json({
            result: "success",
            payload: carrito
        })

    } catch (error) {
        console.log(error)
        res.json({ error })
    }

})

router.post("/:cid/products/:pid", async (req, res) => {

    try {

        const { cid, pid } = req.params
        const carrito = await CartModel.findById(cid)
        if (!carrito) throw `Carrito con id: ${cid} no existe`

        const productoExiste = carrito.products.find(p => p.product == pid)

        if (productoExiste) {
            productoExiste.quantity++
            carrito.products = carrito.products.map( p => p.id == pid ? productoExiste : p)
        } else {
            carrito.products.push({
                product: pid,
                quantity: 1
            })
        }
        
        await carrito.save()
        res.json({
            result: "success",
            payload: carrito
        })
    } catch (error) {
        console.log(error)
        res.json({ error })
    }

})

module.exports = router