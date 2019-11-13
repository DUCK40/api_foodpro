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

router.route("/:SHOP_CODE").get((req, res) => {
  // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
  var obj = require("../../controller/order/getdeviveryprocessshop");
  obj.func_get(req.params.SHOP_CODE, res);
  // res.status(200).json(obj.func_get(req.params.cate))
});

router.route("/").put((req, res) => {
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    const data = req.body;
    // console.log("aaaa"+data)
    var obj = require("../../controller/order/getdeviveryprocessshop");
    obj.func_put(data, res);
    // res.status(200).json(obj.func_get(req.params.cate))
  });

module.exports = router;
