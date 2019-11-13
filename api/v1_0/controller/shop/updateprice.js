//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_put = function(req, res) {
  const ip = globalIP;
  updatePrice(req, res, ip);
};

//Section Method
async function updatePrice(req, res, ip) {
  try {
    qArr = [];
    pArr = [];
    const SHOP_CODE = req.SHOP_CODE;
    const PRICE = req.PRICE;
    const GOODS_CODE = req.GOODS_CODE;

    q = `UPDATE public."M_GOODS"
        SET "PRICE"= $1
        WHERE "SHOP_CODE" = $2 and "GOODS_CODE" = $3 ;`;
    qArr.push(q);
    p = [PRICE, SHOP_CODE, GOODS_CODE];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
