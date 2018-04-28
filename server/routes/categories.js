const express = require('express');
const router = express.Router();
const Categories = require('../models/category');
// 查询分类接口
router.get('/', function (req, res, next) {
    Categories.fetch((err, categories) => {
        if (err) {
            res.json({code: 403, desc: 'fail'});
        } else {
            res.json({code: 200, desc: 'success', list: categories});
        }
    })
});
// 增加分类接口
router.post('/add', function (req, res, next) {
    let _categories = new Categories(req.body);
    _categories.save((err) => {
        if (err) {
            console.log(err)
            res.json({code: 403, desc: 'fail'});
        } else {
            res.json({code: 200, desc: 'success'});
        }
    })
});

module.exports = router;



