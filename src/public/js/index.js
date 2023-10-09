const socket = io();
const listaProductos = document.querySelector("#productos_lista")
const nombreProducto = document.getElementById("nombre")
const botonCrear = document.querySelector("#boton_crear")

let productos = []

// socket.emit("message", "hola desde el cliente")

const cargarProductos = () => {
    listaProductos.innerHTML = productos.map(producto => `
        <li>
            <span>
                ${producto.title} -- id:${producto._id}
            </span> 
            <button style="color:red" onClick=eliminarProducto('${producto._id}')>eliminar</button>
        </li>
    `).join("")
}

const eliminarProducto = async productoId => {
    await fetch(`api/products/${productoId}`, { method: "DELETE" })
}

const crearProducto = async () => {

    const mockProducto = {
        "title": nombreProducto.value,
        "description": "descripcion x",
        "price": 80,
        "thumbnails": [
            "camisa_manga_larga.png"
        ],
        "code": nombreProducto.value.toLowerCase(),
        "stock": 25,
        "category": "cateogia x"
    }

    try {
        await fetch('api/products', {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockProducto),
        })


        nombreProducto.value = ''



    } catch (error) {
        alert("ocurrio un error, revisar consola")
    }



}

botonCrear.addEventListener("click", () => {
    if (!nombreProducto.value) {
        alert("nombre no puede ir vacio")
        return
    }
    crearProducto()
})

socket.on("listar_productos", data => {
    productos = data
    cargarProductos()
})

socket.on("nuevo_producto", data => {
    productos.push(data)
    cargarProductos()
})

socket.on("producto_eliminado", data => {
    productos = productos.filter(producto => producto._id != data)
    cargarProductos()
})