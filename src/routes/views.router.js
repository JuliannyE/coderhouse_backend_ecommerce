const { Router } = require("express")
const ProductModel = require("../dao/models/products.model")

const router = Router()

router.get("/", async (req, res) => {
    let testUser = {
        name: "julianny"
    }

    const products = await ProductModel.find().lean()
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

router.get("/chat", async (req, res) => {

    res.render("chat", {
        name: "Julianny "
    })
})

module.exports = router