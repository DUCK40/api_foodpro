var express = require('express');
var router = express.Router();


router.use('/homebanner',require('./homebanner'));
router.use('/searchengine',require('./searchengine'));



module.exports = router;