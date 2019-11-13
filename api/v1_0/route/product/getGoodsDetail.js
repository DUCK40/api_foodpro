var express = require('express');
var router = express.Router();


router.route('/:shop_code/:cate_code/:sub_cate_code/:type_cate_code/:memid').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.cate})
    var obj =require('../../controller/product/getGoodsDetail')
    obj.func_get(req.params.shop_code,req.params.cate_code,req.params.sub_cate_code,req.params.type_cate_code,req.params.memid,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;