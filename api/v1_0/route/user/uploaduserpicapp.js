var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var router = express.Router();
router.use(bodyParser.json({ limit: "50mb", type: "application/json" })); // to support JSON-encoded bodies
router.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000
  })
);

router.route("/").put((req, res) => {
  let FILENAME = req.body.FILENAME
  let MEM_CODE = req.body.MEM_CODE
  let IMGTYPE = req.body.IMGTYPE
  var obj = require("../../controller/user/uploaduserpicapp");
  obj.func_put(FILENAME, MEM_CODE,IMGTYPE, res);
});

module.exports = router;
