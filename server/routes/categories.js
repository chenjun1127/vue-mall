var express = require('express');
var router = express.Router();
var Categories = require('../models/category');
/* GET home page. */
router.get('/', function (req, res, next) {
    Categories.fetch((err, categories) => {
        if (err) {
            res.json({code: 403, desc: 'fail'});
        } else {
            res.json({code: 200, desc: 'success', list: categories});
        }
    })
});
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
