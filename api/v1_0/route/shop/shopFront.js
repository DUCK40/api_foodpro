var express = require("express");
var router = express.Router();
//Lang : en, th
router.route("/:mem_code/:shop_code").get((req,res) => {
  var obj = require("../../controller/shop/shopFront");
  obj.func_get_shopfront(req.params.mem_code, req.params.shop_code, res);
});

module.exports = router;
