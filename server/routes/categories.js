const express = require('express');
const router = express.Router();
const Categories = require('../models/category');
const Products = require('../models/product');
/**
 * @dateTime:2018/05/03 16:02:17
 * @author:ChenJun
 * @desc:查询分类借口，populate关联查询
 * populate({path:'products',select:'name price'}) == populate('products','name price')
 */
router.get('/', function (req, res, next) {
    Categories.find({}).populate({path: 'products', select: 'name price image amount'}).exec((err, categories) => {
        if (err) {
            res.json({code: 403, desc: 'fail'});
        } else {
            res.json({code: 200, desc: 'success', list: categories});
        }
    })
});
// 增加分类接口
router.post('/add', function (req, res, next) {
    if (req.body.id) {
        Categories.findById(req.body.id, (err, category) => {
            if (err) console.log(err);
            let _categories = Object.assign(category, req.body);
            console.log(_categories);
            _categories.save(err => {
                err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
            })
        })
    } else {
        let _categories = new Categories(req.body);
        _categories.save(err => {
            err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
        })
    }
});
// 删除分类
router.post('/delete', (req, res, next) => {
    const categoryId = req.body.id;
    if (categoryId) {
        Products.find({category: categoryId}, (err, products) => {
            if (products && products.length > 0) {
                products.map((ele, index) => {
                    ele.remove();
                })
            }
        });
        Categories.remove({_id: categoryId}, err => {
            err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
        })
    } else {
        res.json({code: 500, desc: '系统错误'});
    }
});
// 查询该分类下数据
router.get('/products', (req, res, next) => {
    const categoryId = req.query.id;
    Products.find({category: categoryId}).populate('products').exec((err, products) => {
        if (err) console.log(err);
        err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, data: products, desc: 'success'});
    })
});
module.exports = router;



