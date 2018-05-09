var shippingAddressSchema = require('../schemas/shippingAddress');
var mongoose = require('mongoose');
var ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);
module.exports = ShippingAddress;
