var express = require('express');
var router = express.Router();

router.route('/:market_code/:memid').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    var obj =require('../../controller/shop/shopFromMarket')
    obj.func_get(req.params.market_code,req.params.memid,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;