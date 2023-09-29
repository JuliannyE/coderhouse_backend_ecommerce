let socketConnection = null

const setSockectConnection = socket => {
    socketConnection = socket
}

module.exports = {
    socketConnection,
    setSockectConnection
}