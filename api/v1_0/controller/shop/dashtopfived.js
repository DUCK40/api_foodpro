//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(shop_code, res) {
  const ip = globalIP;
  getDetail(shop_code, res, ip);
};

//Section Method
async function getDetail(shop_code, res, ip) {
  try {
    const shopArr = [];
    // const groupArr=[];
    q = `SELECT TO_CHAR(TBI."CREATE_AT", 'dd/MM/YYYY') as CREATE_AT,sum(TBI."SUM_PRICE") as SUM_PRICE
        FROM "T_SALEORDER_BILLING_ITEM" as TBI
        WHERE TBI."SHOP_CODE" = $1
        GROUP BY "create_at"
        order by "create_at" desc
        limit 5`;
    var { rows } = await queryFunc.queryRow(q, [shop_code]);
    var ex = 0;
    if (rows.length > 0) {
      rows.map((data, index) => {
        shopArr.push({ DATE: data["create_at"], INCOME: data["sum_price"] });
      });
    } else {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var xx = date + "/" + month + "/" + str;
      shopArr.push({ DATE: xx, INCOME: 0 });
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
