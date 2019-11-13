var express = require('express');
var router = express.Router();
 
// router.get('/', function(req, res, next) {
//   res.send('Get login');
// });
 
// router.post('/', function(req, res, next) {
//   res.send('Post login');
// });

router.route('/:shop_code/:goods_code').get((req,res)=>{
//   res.json({'Method': 'get','Path':'Category','Code': req.params.shop_code})
  var obj =require('../../controller/master/getitemvander')

  obj.func_get(req.params.shop_code,req.params.goods_code,res)
  // res.status(200).json(obj.func_get(req.params.cate))
})


module.exports = router;