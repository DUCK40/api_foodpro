var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get login');
});
 
// router.post('/', function(req, res, next) {
//   res.send('Post login');
// });

router.route('/:email/:password/:typelogin').get((req,res)=>{
  // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
  var obj =require('../../controller/user/getloginprocess')
  obj.func_get(req.params.email,req.params.password,req.params.typelogin,res)
  // res.status(200).json(obj.func_get(req.params.cate))
})


module.exports = router;