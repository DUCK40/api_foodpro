var express = require('express');
var router = express.Router();


router.use('/getcombodistrict',require('./getcombodistrict'));
router.use('/getcomboprovince',require('./getcomboprovince'));
router.use('/getcombocate',require('./getcombocate'));
router.use('/getcombosubcate',require('./getcombosubcate'));
router.use('/getcombotypecate',require('./getcombotypecate'));
router.use('/getcombosend',require('./getcombosend'));
router.use('/getcombounit',require('./getcombounit'));
router.use('/getpostcode',require('./getpostcode'));
router.use('/getlistshop',require('./getlistshop'));
router.use('/getlistitemshop',require('./getlistitemshop'));
router.use('/getdim',require('./getdim'));
router.use('/updatepicprofilesubcate',require('./updatepicprofilesubcate'));
router.use('/updatepicbannersubcate',require('./updatepicbannersubcate'));

router.use('/gettablesubcate',require('./gettablesubcate'));
router.use('/gettabletypecate',require('./gettabletypecate'));
router.use('/gettableunit',require('./gettableunit'));
router.use('/addshoppayment',require('./addshoppayment'));
router.use('/getcombobank',require('./getcombobank'));
router.use('/getcombomarket',require('./getcombomarket'));

router.use('/updatedimension',require('./updatedimension'));
router.use('/getitemvander',require('./getitemvander'));
router.use('/getcombocatebyid',require('./getcombocatebyid'));


module.exports = router;