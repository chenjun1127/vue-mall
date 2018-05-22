/**
 * Created by ChenJun on 2018/5/11
 */
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/user');
const Products = require('../models/product');
const orderNo = require('../utils/orderNo');

router.post('/', (req, res, next) => {
    console.log(req.body);
    const postData = req.body;
    const _order = new Order(Object.assign(postData, {orderId: orderNo()}));
    console.log(_order);
    Order.findById(_order._id,(err,order)=>{
        if(err) console.log(err);
        if(order) return;
        _order.save(err=>{
            if(err) console.log(err);
            res.json({code: 200, desc: '保存成功'});
        })
    })
});


module.exports = router;
