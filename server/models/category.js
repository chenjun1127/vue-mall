var CategorySchema = require('../schemas/category');
var mongoose = require('mongoose');
var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
