var ProductSchema = require('../schemas/product');
var mongoose = require('mongoose');
var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
