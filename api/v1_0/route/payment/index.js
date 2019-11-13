var express = require('express');
var router = express.Router();

router.use('/inquiry', require('./inquiry'));

module.exports = router;