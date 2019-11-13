var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.send('Get Reset Password');
});

router.route('/:email').get((req,res)=>{
  var obj =require('../../controller/user/forgetPassword')
  obj.func_get(req.params.email,res)
})


module.exports = router;