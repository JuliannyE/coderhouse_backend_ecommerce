const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const productCollection = 'Products'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    status: Boolean,
    thumbnails: [String],
    code: {
        type: String,
        unique: true,
        index: true
    },
    stock: Number,
    category: String,
})

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model(productCollection, productSchema)

module.exports = ProductModel