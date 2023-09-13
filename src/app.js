const express = require("express")

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")

const app = express()
const PUERTO = 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter )


app.listen(PUERTO, () => console.log(`Servidor corriendo en el puerto ${PUERTO}`))