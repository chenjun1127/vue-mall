const express = require('express');
const router = express.Router();
const ShippingAddress = require('../models/shippingAddress');
const User = require('../models/user');

router.get('/', (req, res) => {
    const userId = req.query.id;
    ShippingAddress.find({ofUser: userId}).populate({path: 'shippingAddress'}).sort({'set':-1}).exec((err, shippingAddress) => {
        if (err) {
            res.json({code: 403, desc: err.message});
        } else {
            res.json({code: 200, desc: 'success', list: shippingAddress});
        }
    })
});

/**
 * @dateTime:2018/05/09 14:07:52
 * @author:ChenJun
 * @desc:收货地址基本操作
 */
router.post('/save', (req, res) => {
    console.log(req.body);
    const addressId = req.body.addressId;
    if (addressId) {
        // 更新
        ShippingAddress.findById(addressId, (err, shippingAddress) => {
            if (err) console.log(err);
            let _shippingAddress = Object.assign(shippingAddress, {
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                ofUser: req.body.ofUser,
                preAddress: req.body.preAddress,
            });
            _shippingAddress.save(err => {
                err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
            })
        })
    } else {
        // 新增
        let _shippingAddress = new ShippingAddress(req.body);
        User.findById(req.body.ofUser, (err, user) => {
            if (err) console.log(err);
            if (user.shippingAddress.indexOf(_shippingAddress._id) > -1) {
                return
            } else {
                user.shippingAddress.length === 0 ? _shippingAddress.set = true : _shippingAddress.set = false;
                user.shippingAddress.push(_shippingAddress._id);
            }
            let _user = Object.assign(user, {firstSave: false});
            _user.save(err => {
                if (err) console.log(err);
            });
        });
        _shippingAddress.save((err) => {
            err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
        })
    }
});

router.get('/getDetail', (req, res) => {
    const id = req.query.id;
    ShippingAddress.findById(id, (err, shippingAddress) => {
        if (err) console.log(err);
        res.json({code: 200, desc: 'success', data: shippingAddress});
    })
});
/**
 * @dateTime:2018/05/11 15:04:54
 * @author:ChenJun
 * @desc:1==>删除、2==>设为默认
 */
router.post('/operate', (req, res) => {
    const addressId = req.body.id;
    const operateId = req.body.operateId;
    const userId = req.body.userId;
    if (addressId && operateId === 1) {
        User.findById(userId, (err, user) => {
            if (err) console.log(err);
            const index = user.shippingAddress.indexOf(addressId);
            user.shippingAddress.splice(index, 1);
            user.save((err) => {
                if (err) console.log(err);
                ShippingAddress.remove({_id: addressId}, (err, shippingAddress) => {
                    err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
                })
            })
        })
    } else if (addressId && operateId === 2) {
        ShippingAddress.find({}).exec((err, shippingAddresses) => {
            if (err) console.log(err);
            shippingAddresses.map(item => {
                if (item._id.toString() !== addressId) {
                    item.set = false;
                    item.save((err) => {
                        if (err) console.log(err);
                    })
                }
            });
        });
        ShippingAddress.findById(addressId, (err, shippingAddress) => {
            if (err) console.log(err);
            shippingAddress.set = true;
            shippingAddress.save((err) => {
                err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
            })
        })
    } else {
        res.json({code: 500, desc: '系统错误'});
    }
});


module.exports = router;
