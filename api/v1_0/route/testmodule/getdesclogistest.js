var express = require('express');
var router = express.Router();


router.route('/:from/:to/:send/:express/:receive').get((req,res) => {
    var obj = require('../../controller/testmodule/getdesclogistest')
    obj.func_get(req.params.from,req.params.to,req.params.send,req.params.express,req.params.receive,res)
    //req.params.lang == "EN" || "TH"
})

module.exports = router;