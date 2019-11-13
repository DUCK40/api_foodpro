var express = require('express');
var router = express.Router();


router.route('/:dimX/:dimY/:dimZ/:amount/:weight/:send').get((req,res) => {
    var obj = require('../../controller/testmodule/dimensionTest')
    obj.func_get(req.params.dimX,req.params.dimY,req.params.dimZ,req.params.amount,req.params.weight,req.params.send,res)
    //req.params.lang == "EN" || "TH"
})

module.exports = router;