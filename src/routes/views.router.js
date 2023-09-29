const { Router } = require("express")
const ProductManager = require("../ProductManager")

const router = Router()
const Inventario = new ProductManager("./src/productos.json")

router.get("/", async (req, res) => {
    let testUser = {
        name: "julianny"
    }

    const products = await Inventario.getProducts()

    res.render("home", {
        name: testUser.name,
        products
    })
})

router.get("/realtimeproducts", async (req, res) => {

    res.render("realtimeProducts", {
        name: "Julianny "
    })
})

module.exports = router