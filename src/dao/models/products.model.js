const mongoose = require("mongoose");

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    status: Boolean,
    thumbnails: [String],
    code: {
        type: String,
        unique: true,
    },
    stock: Number,
    category: String,
})

const ProductModel = mongoose.model(productCollection, productSchema)

module.exports = ProductModel