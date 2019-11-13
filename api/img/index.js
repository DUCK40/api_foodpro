var express = require('express');
// var bodyParser = require("body-parser");
var router = express.Router();
// router.use(bodyParser.json({limit: '50mb', type: 'application/json'}));

// router.use(bodyParser.urlencoded({
//     parameterLimit: 100000,
//     limit: '50mb',
//     extended: true
//   }));

router.get('/:cate/:filename', function(req, res, next) {
  // res.send(__dirname);
  const cate = req.params.cate
  const filename = req.params.filename
  // res.send(process.cwd()+'/api/v1_0/img/'+ cate +'/'+ filename );
  res.sendFile(process.cwd()+'/api/img/'+ cate +'/'+ filename)
});
router.use('/upload',require('./uploads'));
router.get('/', function(req, res, next) {
  res.send('Get img');
});
module.exports = router;