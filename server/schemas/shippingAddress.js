var mongoose = require('mongoose');
var shippingAddressSchema = new mongoose.Schema({
    name: String,
    tel: Number,
    address: String,
    preAddress: String,
    set: {type: Boolean, default: false},
    ofUser:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// 为模式添加新的方法
shippingAddressSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
});
module.exports = shippingAddressSchema;
