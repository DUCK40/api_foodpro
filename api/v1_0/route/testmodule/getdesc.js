var express = require('express');
var router = express.Router();


router.route('/:pCode/:dCode').get((req,res) => {
    var obj = require('../../controller/testmodule/getdesc')
    obj.func_get(req.params.pCode,req.params.dCode,res)
    //req.params.lang == "EN" || "TH"
})

module.exports = router;