const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL

const db = async () => {

    if (!MONGO_URL) {
        throw "Falta la url de mongo!"
    }

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    return mongoose.connect(MONGO_URL, options)
        .then(() => {
            console.log('Conexión a MongoDB establecida con éxito');
        })
        .catch((err) => {
            console.error('Error al conectar a MongoDB:', err);
        });

}


module.exports = db;
