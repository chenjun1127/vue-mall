/**
 * Created by ChenJun on 2018/5/11
 */
var orderSchema = require('../schemas/order');
var mongoose = require('mongoose');
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;
