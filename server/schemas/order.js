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
    goodsList: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Products'
            },
            sum: Number,
        }
    ],
    status:{
        type:Number,default:1,
    },
    totalMoney:Number,
});

module.exports = orderSchema;

