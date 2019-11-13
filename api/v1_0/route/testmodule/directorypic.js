//requiring path and fs modules
var express = require("express");
var router = express.Router();

//joining path of directory
// const directoryPath = path.join(__dirname, 'Documents');


router.route("/").get((req, res) => {
    var obj =require('../../controller/testmodule/directorypic')
    obj.func_get(req,res)
});

module.exports = router;
