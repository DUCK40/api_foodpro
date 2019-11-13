var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get Story');
});
 
router.post('/', function(req, res, next) {
  res.send('Post Story');
});

router.use('/foodStory', require('./foodStory'));
router.use('/storyDetail', require('./getStoryDetail'));
router.use('/storyFov', require('./storyFov'));
module.exports = router;