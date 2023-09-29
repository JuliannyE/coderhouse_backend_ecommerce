const express = require("express")
const handlebars = require("express-handlebars")
const { Server } = require("socket.io")

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")

const ProductManager = require("./ProductManager")
const { setSockectConnection } = require("./socket")
const Inventario = new ProductManager('./src/productos.json')

const app = express()
const PUERTO = 8080
const httpServer =
    app.listen(PUERTO, () => console.log(`Servidor corriendo en el puerto ${PUERTO}`))
const socketServer = new Server(httpServer)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// view engine
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", 'handlebars')
app.use(express.static(__dirname + '/public'))

// rutas
app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

// socket server
socketServer.on("connection", async (socket) => {
    console.log("cliente conectado:", socket.id )
    setSockectConnection(socket)

    const products = await Inventario.getProducts()
    socket.emit("listar_productos", products)
})
