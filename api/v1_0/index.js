var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Hello v1.0 GET API ');
});
 
router.post('/', function(req, res, next) {
  res.send('Hello v1.0 POST API ');
});


router.use('/product',require('./route/product'));
router.use('/shop',require('./route/shop'));
router.use('/user',require('./route/user'));
router.use('/story',require('./route/story'));
router.use('/order',require('./route/order'));
router.use('/payment',require('./route/payment'));
router.use('/master',require('./route/master'));
router.use('/testmodule',require('./route/testmodule'));
router.use('/home',require('./route/home'));
router.use('/img',require('../img'));

 
module.exports = router;