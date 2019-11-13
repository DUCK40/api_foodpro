var express = require('express');
var router = express.Router();


router.route('/:cate').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.cate})
    var obj =require('../../controller/product/category')
    obj.func_get(req.params.cate,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;