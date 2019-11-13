var express = require('express');
var router = express.Router();


router.route('/:mem_code').get((req,res) => {
    var obj = require('../../controller/story/foodStory')
    obj.func_get(req.params.mem_code,res)
    //req.params.lang == "EN" || "TH"
})

module.exports = router;