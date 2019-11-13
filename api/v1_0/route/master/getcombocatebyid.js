var express = require('express');
var router = express.Router();
 
// router.get('/', function(req, res, next) {
//   res.send('Get login');
// });
 
// router.post('/', function(req, res, next) {
//   res.send('Post login');
// });

router.route('/:cate_code/:sub_cate_code').get((req,res)=>{
//   res.json({'Method': 'get','Path':'Category','Code': req.params.cate_code + req.params.sub_cate_code})
  var obj =require('../../controller/master/getcombocatebyid')
  obj.func_get(req.params.cate_code,req.params.sub_cate_code,res)
  // res.status(200).json(obj.func_get(req.params.cate))
})


module.exports = router;