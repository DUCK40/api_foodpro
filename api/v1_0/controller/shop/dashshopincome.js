//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(shop_code, res) {
  const ip = globalIP;
  getDetail(shop_code, res, ip);
};

//Section CURD
async function getDetail(shop_code, res, ip) {
  try {
    const shopArr = [];
    q = `SELECT TBI."SHOP_CODE",sum(TBI."SUM_PRICE") as SUM_PRICE
        FROM "T_SALEORDER_BILLING_ITEM" as TBI
        WHERE TBI."SHOP_CODE" = $1 and TBI."BILL_STATUS" = 2 and cast(TBI."CREATE_AT" as date) = cast(NOW() as date)
        GROUP BY TBI."SHOP_CODE" `;
    var { rows } = await queryFunc.queryRow(q, [shop_code]);
    if (rows.length > 0) {
      rows.map((data, index) => {
        shopArr.push({
          SHOP_CODE: data["SHOP_CODE"],
          SUM_PRICE: data["sum_price"]
        });
      });
    } else {
      shopArr.push({ SHOP_CODE: shop_code, SUM_PRICE: 0 });
    }

    if (shopArr.length > 0) {
      res.status(200).json({ STATUS: 1, RESULT: shopArr });
    } else {
      res.status(200).json({ STATUS: 3, RESULT: shopArr });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
