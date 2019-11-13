var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('Get product')
  res.send('Get product');
});

router.post('/', function(req, res, next) {
  res.send('Post product');
});

router.use('/createorder', require('./createorder'));
router.use('/getdelivery', require('./getdelivery'));
router.use('/cancelorder', require('./cancelorder'));
router.use('/cancelorderbyadmin', require('./cancelorderbyadmin'));
router.use('/getprepayment', require('./getprepayment'));
router.use('/getdeviveryprocess', require('./getdeviveryprocess'));
router.use('/getdeviveryprocessshop', require('./getdeviveryprocessshop'));
router.use('/getondeviveryshop', require('./getondeviveryshop'));
router.use('/putstatuspayment', require('./putstatuspayment'));
router.use('/getcancelstatus', require('./getcancelstatus'));
router.use('/getItemDetail', require('./getItemDetail'));



module.exports = router;