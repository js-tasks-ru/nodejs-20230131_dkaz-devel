const product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  const searchResults = await product.find(
      query ?
      {
        $text: {$search: query}
      }
      :
      {}
  );

  const mappedResults = searchResults.map(searchResult => mapProduct(searchResult));
  ctx.body = {products: mappedResults};
};
