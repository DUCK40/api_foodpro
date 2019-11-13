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

router.route("/").put((req, res) => {
  res.json({'Method': 'get','Path':'Category','Code': req.body.SO_CODE +req.body.MEM_CODE})
  
  // const data = req.body;
  // // console.log(data)
  // var obj = require("../../controller/order/cancelorder");
  // obj.func_put(data, res);
  // res.status(200).json(obj.func_get(req.params.cate))
});

module.exports = router;