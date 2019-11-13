var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get user');
});
 
router.post('/', function(req, res, next) {
  res.send('Post user');
});

router.use('/forgetPassword',require('./forgetPassword'));
router.use('/getloginprocess',require('./getloginprocess'));
router.use('/getuserdetail',require('./getuserdetail'));
router.use('/register',require('./register'));
router.use('/uploaduserpic',require('./uploaduserpic'));
router.use('/useraddress',require('./useraddress'));
router.use('/setaddressdefault',require('./setaddressdefault'));
router.use('/getcombodistrict',require('./getcombodistrict'));
router.use('/getcomboprovince',require('./getcomboprovince'));
router.use('/uploaduserpicapp',require('./uploaduserpicapp'));
/////// get user shop profile //////
router.use('/getusershopdetail',require('./getusershopdetail'));
router.use('/test',require('./test'));
module.exports = router;