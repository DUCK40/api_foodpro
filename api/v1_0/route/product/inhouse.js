var express = require('express');
var router = express.Router();


router.route('/:shop_code/:mem_code').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.cate})
    var obj =require('../../controller/product/inhouse')
    obj.func_get(req.params.shop_code,req.params.mem_code,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;