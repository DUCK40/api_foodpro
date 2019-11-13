var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
  res.send('Get product');
});
router.post('/', function(req, res, next) {
  res.send('Post product');
});

router.use('/category', require('./category'));
router.use('/promotion', require('./promotion'));
router.use('/bestsale', require('./bestsale'));
router.use('/newitem', require('./newitem'));
router.use('/recommend', require('./recommend'));
router.use('/getGoodsDetail', require('./getGoodsDetail'));
router.use('/inhouse', require('./inhouse'));
router.use('/getsubdetail', require('./getSubDetail'));
router.use('/mefov', require('./meFov'));
router.use('/editproduct', require('./editproduct'));


module.exports = router;