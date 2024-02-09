const { isValidObjectId } = require("mongoose");
const ProductModel = require("../models/products.model");

class Carts {
  async create({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) {
    const newProduct = new ProductModel({
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    });
    await newProduct.save();
    return newProduct;
  }

  async get(filter, filterOptions = null) {
    if (filterOptions) {
      const { limit, page, sort } = filterOptions;

      const productos = await ProductModel.paginate(filter, {
        limit,
        page,
        sort,
      });

      return productos;
    }

    const product = await ProductModel.findOne(filter);

    if (!product) {
      return null;
    }

    return product;
  }

  async getById(id) {
    if (!isValidObjectId(id)) return null;
    const product = await ProductModel.findById(id);

    return product;
  }

  async update(id, product) {
    return await ProductModel.findByIdAndUpdate(id, product);
  }

  async delete(id) {
    await ProductModel.findByIdAndDelete(id);
  }
}

module.exports = Carts;
