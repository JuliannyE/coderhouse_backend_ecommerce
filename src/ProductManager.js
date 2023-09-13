const fs = require("fs")

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(newProduct) {
        newProduct.id = new Date().getTime()

        const productos = await this.getProducts()
        productos.push(newProduct)
        const contenido = JSON.stringify(productos)
        await fs.promises.writeFile(this.path, contenido)
        return newProduct
    }

    async getProducts() {
        const data = await fs.promises.readFile(this.path, 'utf8')
        const productos = JSON.parse(data)
        return productos;
    }

    async getProductById(productId) {
        const productos = await this.getProducts()
        const productoEncontrado = productos.find(p => p.id == productId)
        return productoEncontrado
    }

    async getProductByCode(code) {
        const productos = await this.getProducts()
        const productoEncontrado = productos.find(p => p.code == code)
        return productoEncontrado
    }

    async updateProduct(productId, productoActualizado) {
        const productos = await this.getProducts()
        const productosActualizados = productos.map(p => {
            if (p.id == productId) {
                return {
                    ...productoActualizado,
                    id: productId
                }
            } else {
                return p
            }
        })

        const contenido = JSON.stringify(productosActualizados)
        await fs.promises.writeFile(this.path, contenido)
    }

    async deleteProduct(productId) {
        const productos = await this.getProducts()
        const productosFiltrados = productos.filter(p => p.id !== productId);

        const contenido = JSON.stringify(productosFiltrados)
        await fs.promises.writeFile(this.path, contenido)
    }
}

module.exports = ProductManager;