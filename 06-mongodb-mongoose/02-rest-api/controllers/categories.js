const category = require('../models/Category')
const mapCategory = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {
    const categories = await category.find();
    const mappedCategories = categories.map(category => mapCategory(category));

    ctx.body = {categories: mappedCategories};
};
