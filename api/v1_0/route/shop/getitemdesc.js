var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
router.route('/:shop_code/:cate_code/:sub_cate_code/:type_cate_code').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    var obj =require('../../controller/shop/getitemdesc')
    obj.func_get(req.params.shop_code,req.params.cate_code,req.params.sub_cate_code,req.params.type_cate_code,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})
router.route('/').post((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    const data = req.body
    var obj =require('../../controller/shop/getitemdesc')
    obj.func_post(data,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})


module.exports = router;