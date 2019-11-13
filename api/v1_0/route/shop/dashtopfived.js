var express = require('express');
var router = express.Router();

router.route('/:shop_code').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    var obj =require('../../controller/shop/dashtopfived')
    obj.func_get(req.params.shop_code,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;