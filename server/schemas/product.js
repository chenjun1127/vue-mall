var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var ProductSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    amount: Number,
    category: {type: ObjectId, ref: 'Category'},
    // category: String,
    pv: {
        type: Number,
        default: 0
    },
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
ProductSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
});
// 静态方法
ProductSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}
module.exports = ProductSchema;
