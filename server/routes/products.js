const express = require('express');
const router = express.Router();
const Products = require('../models/product');
const Categories = require('../models/category');
// 查询接口,分页查询
router.get('/', (req, res, next) => {
    // 默认10条，从第一页开始
    const pageSize = parseInt(req.query.pageSize) === 0 || !req.query.pageSize ? 10 : parseInt(req.query.pageSize);
    const pageNo =parseInt(req.query.pageNo) === 0 || !req.query.pageNo ? 1 : parseInt(req.query.pageNo);
    let count = 0;
    Products.count({}, (err, size) => {
        if (err) console.log(err);
        count = size;
    });
    Products.find({}).limit(pageSize).skip((pageNo - 1) * pageSize).populate({path: 'category', select: 'name'}).exec((err, products) => {
        if (err) {
            res.json({code: 403, desc: err.message});
        } else {
            res.json({code: 200, desc: 'success', count: count, list: products});
        }
    })
});
// 添加更新商品接口
router.post('/save', (req, res, next) => {
    if (req.body._id) {
        let productObj = req.body;
        Products.findById(req.body._id, (err, product) => {
            if (err) console.log(err);
            let _product = Object.assign(product, productObj);
            const categoryId = _product.category;
            // console.log(product._id, categoryId,_product._id);
            Categories.findById(categoryId, (err, category) => {
                if (err) console.log(err);
                if (category.products.indexOf(_product._id) > -1) {
                    return
                } else {
                    category.products.push(_product._id);
                }
                category.save(err => {
                    if (err) console.log(err);
                });
                // 删除
                Categories.findOne({"products": _product._id}, (err, category) => {
                    if (err) console.log(err);
                    if (category && category.products.length > 0) {
                        category.products.map((e, i) => {
                            if (e.toString() === _product._id.toString()) {
                                category.products.splice(i, 1)
                            }
                        });
                        category.save(err => {
                            if (err) console.log(err);
                            console.log('保存成功');
                        });
                    }
                })
            });
            _product.save((err) => {
                err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
            })
        })
    } else {
        let products = new Products(req.body);
        const categoryId = products.category;
        Categories.findById(categoryId, (err, category) => {
            if (err) console.log(err);
            if (category.products.indexOf(products._id) > -1) {
                return
            } else {
                category.products.push(products._id);
            }
            category.save(err => {
                if (err) console.log(err);
            });
        });
        products.save((err) => {
            err ? res.json({code: 403, desc: 'fail'}) : res.json({code: 200, desc: 'success'});
        })
    }
});
// 查询接口
router.post('/inquire', (req, res, next) => {
    let productId = req.body.id;
    if (productId) {
        Products.findById(productId, (err, product) => {
            if (err) {
                res.json({code: 403, desc: 'fail'});
            } else {
                res.json({code: 200, desc: 'success', data: product});
            }
        })
    } else {
        res.json({code: 500, desc: '系统错误'});
    }
});
// 删除商品
router.post('/delete', (req, res, next) => {
    let productId = req.body.id;
    if (productId) {
        Products.remove({_id: productId}, (err, products) => {
            if (err) {
                res.json({code: 403, desc: 'fail'});
            } else {
                res.json({code: 200, desc: 'success'});
            }
        })
    } else {
        res.json({code: 500, desc: '系统错误'});
    }
});
// 搜索
router.get('/search', (req, res, next) => {
    let searchText = req.query.searchText;
    if (searchText) {
        const regex = new RegExp(searchText, 'i');
        Products.find({name: regex}, (err, products) => {
            if (err) {
                res.json({code: 403, desc: 'fail'});
            } else {
                res.json({code: 200, desc: 'success', data: products});
            }
        })
    } else {
        res.json({code: 500, desc: '系统错误'});
    }
});
module.exports = router;
