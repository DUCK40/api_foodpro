var express = require('express');
var router = express.Router();

router.route('/:memid/:mode').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    var obj =require('../../controller/shop/popularShop')
    obj.func_get(req.params.memid,req.params.mode,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;