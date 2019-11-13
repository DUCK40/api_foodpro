var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

router.route("/").get((req, res) => {
  res.json({'Method': 'get','Path':'Category','Code': "req.params.memid"})

console.log("12345678");

//   var obj = require("../../controller/order/getdelivery");
//   obj.func_get(req.params.sm_code, res);


//   res.status(200).json(obj.func_get(req.params.cate))
});

module.exports = router;
