var express = require('express');
var router = express.Router();
 
router.use('/v1_0', require('./v1_0'));
router.use('/img', require('./img'));



 
module.exports = router;