var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get shop');
});
 
router.post('/', function(req, res, next) {
  res.send('Post shop');
});

router.use('/newshop', require('./newShop'));
router.use('/recommendshop', require('./recommendShop'));
router.use('/popularshop', require('./popularShop'));
router.use('/shopfront', require('./shopFront'));
router.use('/shopfrommarket', require('./shopFromMarket'));
router.use('/inhousemarket', require('./inHouseMarket'));
router.use('/cart', require('./cart'));
router.use('/getdelivery', require('./getdelivery'));
router.use('/shopfov', require('./shopfov'));
router.use('/uploadpicshopprofile', require('./uploadpicshopprofile'));
router.use('/uploadpicshopbanner', require('./uploadpicshopbanner'));
/////////  new item ///////////////
// router.use('/newitem', require('./newitem'));

router.use('/shopitem', require('./shopitem'));
router.use('/dashshopfov', require('./dashshopfov'));
router.use('/dashshopincome', require('./dashshopincome'));
router.use('/dashshopitemsale', require('./dashshopitemsale'));
router.use('/dashtopfivem', require('./dashtopfivem'));
router.use('/dashtopfived', require('./dashtopfived'));

router.use('/updateprofileshop', require('./updateprofileshop'));

router.use('/updateprice', require('./updateprice'));
router.use('/admingenshop', require('./admingenshop'));
router.use('/getitemdesc', require('./getitemdesc'));
router.use('/uploadpicshopitem', require('./uploadpicshopitem'));
 
module.exports = router;