var express = require('express');
var router = express.Router();

router.route('/:cate_code/:sub_cate/:memid').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    var obj =require('../../controller/product/getSubDetail')
    obj.func_get(req.params.cate_code,req.params.sub_cate,req.params.memid,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;