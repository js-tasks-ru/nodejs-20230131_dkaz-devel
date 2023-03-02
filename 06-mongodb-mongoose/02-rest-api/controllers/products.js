const product = require('../models/Product')
const mapProduct = require('../mappers/product')
const mongoose = require("mongoose");

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
    const {subcategory} = ctx.query;

    if (!subcategory) return next();

    const productsList = await product.find(
        {
            subcategory: subcategory
        }
    );
    const mappedProducts = productsList.map(product => mapProduct(product));

    ctx.body = {products: mappedProducts};
};

module.exports.productList = async function productList(ctx, next) {
    const productsList = await product.find();
    const mappedProducts = productsList.map(product => mapProduct(product));

    ctx.body = {products: mappedProducts};
};

module.exports.productById = async function productById(ctx, next) {
    if (!mongoose.isValidObjectId(ctx.params.id)) {
        ctx.throw(400, 'invalid id');
    }

    const productById = await product.findById(ctx.params.id);

    if (!productById) {
        ctx.throw(404, 'no product');
    }

    const mappedProduct = mapProduct(productById);

    ctx.body = {product: mappedProduct};
};

