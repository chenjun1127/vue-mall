/**
 * Created by ChenJun on 2018/5/11
 */
var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    orderId: String,
    deliverName: String,
    deliverAddress: String,
    deliverTel: Number,
    payMethod: String,
    deliverMethod: String,
    createTime: {
        type: Date,
        default: Date.now()
    },
    ofUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    goodsList: [{product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, sum: Number, _id: false}],
    status: {
        type: Number, default: 1,
    },
    totalMoney: Number,
    cost: {
        freight: {type: Number, default: 0},
        rebate: {type: Number, default: 0},
        serviceCharge: {type: Number, default: 0},
    }
});
orderSchema.pre('save', function (next) {
    this.createTime = Date.now();
    next()
})
module.exports = orderSchema;

