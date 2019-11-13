var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get User detail');
});
 
// router.post('/', function(req, res, next) {
//   res.send('Post login');
// });

router.route('/:mem_code').get((req,res)=>{
  // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
  var obj =require('../../controller/user/getuserdetail')
  obj.func_get(req.params.mem_code,res)
  // res.status(200).json(obj.func_get(req.params.cate))
})

router.route('/').post((req,res)=>{
  // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
  const data = req.body
  var obj =require('../../controller/user/getuserdetail')
  obj.func_post(data,res)
  // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;