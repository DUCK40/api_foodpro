var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get upload');
});
 
router.post('/', function(req, res, next) {
  res.send('Post upload');
});

module.exports = router;