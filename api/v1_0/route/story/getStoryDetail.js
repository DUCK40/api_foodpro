var express = require('express');
var router = express.Router();


router.route('/:mem_code/:fs_code').get((req,res) => {
    var obj = require('../../controller/story/getStoryDetail')
    obj.func_get(req.params.mem_code,req.params.fs_code,res)
    //req.params.lang == "EN" || "TH"
})

module.exports = router;