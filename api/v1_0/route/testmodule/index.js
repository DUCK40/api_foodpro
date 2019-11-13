var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get user');
});
 
router.post('/', function(req, res, next) {
  res.send('Post user');
});
router.use('/funcdateshow',require('./funcdateshow'));
router.use('/uploadpic',require('./uploadpic'));
router.use('/directorypic',require('./directorypic'));
router.use('/dimensiontest',require('./dimensionTest'));
router.use('/getdesclogistest',require('./getdesclogistest'));
router.use('/getdesc',require('./getdesc'));
module.exports = router;