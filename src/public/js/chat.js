const socket = io();

let user = null
let chatBox = document.getElementById("chatBox")

const autenticar = () => {
    Swal.fire({
        title: "Identificate",
        input: "text",
        text: "Ingresa tu email para identificarte en el chat",
        inputValidator: (value) => {
            return !value && 'Necesitas ingresar tu email para continuar'
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value

        socket.emit('user_autenticado', user)
    })
}

autenticar()

chatBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user,
                message: chatBox.value
            })
            chatBox.value = ''
        }
    }
})

socket.on("messageLogs", data => {
    let log = document.getElementById("messageLogs")
    let messages = ''

    data.forEach(message => {
        messages = messages + `<p>${message.user} dice: ${message.message} </br></hr></p>`
    });

    log.innerHTML = messages
})

socket.on("user_conectado", data => {
    Swal.fire({
        title: `Usuario ${data} conectado`,
        toast: true,
        position: "top-right"
    })
})
