var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.route('/').post((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    const data = req.body
    var obj =require('../../controller/product/meFov')
    obj.func_post(data,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

router.route('/:memid').get((req,res)=>{
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    var obj =require('../../controller/product/meFov')
    obj.func_get(req.params.memid,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;