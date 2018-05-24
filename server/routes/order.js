/**
 * Created by ChenJun on 2018/5/11
 */
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const orderNo = require('../utils/orderNo');

router.post('/', (req, res, next) => {
    console.log(req.body);
    const postData = req.body;
    const _order = new Order(Object.assign(postData, {orderId: orderNo()}));
    console.log(_order);
    _order.save(err => {
        if (err) console.log(err);
        res.json({code: 200, desc: '保存成功'});
    })
});

router.get('/list', (req, res, next) => {
    const userId = req.query.id;
    const type = parseInt(req.query.type)
    // status:1==> 已完成,2==> 待支付 ,3==> 已取消
    switch (type) {
        case 1:
            Order.find({ofUser: userId}).populate('goodsList.product').sort({createTime: -1}).exec((err, orders) => {
                if (err) {
                    res.json({code: 403, desc: err.message});
                } else {
                    res.json({code: 200, desc: 'success', list: orders});
                }
            });
            break;
        case 2:
            Order.find({ofUser: userId, status: 1}).populate('goodsList.product').sort({createTime: -1}).exec((err, orders) => {
                if (err) {
                    res.json({code: 403, desc: err.message});
                } else {
                    res.json({code: 200, desc: 'success', list: orders});
                }
            });
            break;
        case 3:
            Order.find({ofUser: userId, status: 2}).populate('goodsList.product').sort({createTime: -1}).exec((err, orders) => {
                if (err) {
                    res.json({code: 403, desc: err.message});
                } else {
                    res.json({code: 200, desc: 'success', list: orders});
                }
            });
            break;
        case 4:
            Order.find({ofUser: userId, status: 3}).populate('goodsList.product').sort({createTime: -1}).exec((err, orders) => {
                if (err) {
                    res.json({code: 403, desc: err.message});
                } else {
                    res.json({code: 200, desc: 'success', list: orders});
                }
            });
            break;
    }
});
router.get('/del', (req, res, next) => {
    const orderId = req.query.id;
    if (!orderId) {
        res.json({code: 503, desc: '系统错误'});
    }
    Order.remove({_id: orderId}, (err, order) => {
        err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
    })
});

module.exports = router;
