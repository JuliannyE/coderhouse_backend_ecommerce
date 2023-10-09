const fs = require("fs")

class CartManager {
    constructor(path) {
        this.path = path
    }

    async create(products = []) {
        const nuevoCarrito = {
            id: new Date().getTime(),
            products
        }

        // obtengo los carritos actuales
        const carritos = await this.getCarritos()
        // inserto el nuevo carrito
        carritos.push(nuevoCarrito)

        // preparo la informacion que va a a tener carritos.json
        const contenido = JSON.stringify(carritos)

        // le meto la informacion a carritos.json
        await fs.promises.writeFile(this.path, contenido)

        // retorno el nuevo carrito creado
        return nuevoCarrito
    }

    async getCarritos() {
        const data = await fs.promises.readFile(this.path, 'utf8')
        const carritos = JSON.parse(data)
        return carritos;
    }

    async getCarritoById(carritoId) {
        const carritos = await this.getCarritos()
        const carrito = carritos.find(cart => cart.id == carritoId)
        return carrito
    }

    async agregarProducto(cid, pid) {
        const carritos = await this.getCarritos()
        const carrito = carritos.find(c => c.id == cid)
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

        const carritoActualizado = carritos.filter(c => c.id != cid)
        carritoActualizado.push(carrito)

        const contenido = JSON.stringify(carritoActualizado)
        await fs.promises.writeFile(this.path, contenido)
        return carrito;
    }
}

module.exports = CartManager;