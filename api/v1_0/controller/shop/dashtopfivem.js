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
    q = `SELECT to_char("CREATE_AT",'YYYY') AS "Year" ,to_char("CREATE_AT",'MM') AS "Month" ,sum("SUM_PRICE") as SUM_PRICE
        FROM "T_SALEORDER_BILLING_ITEM"
        WHERE "SHOP_CODE"  = $1
        GROUP BY  "Year","Month"
        ORDER BY  "Year" desc,"Month" desc
        limit 5`;
    var { rows } = await queryFunc.queryRow(q, [shop_code]);
    var ex = 0;
    if (rows.length > 0) {
      rows.map((data, index) => {
        if (data["totalfov"] >= 30000) {
          ex = (parseFloat(data["totalfov"]) * 1) / 100;
        } else {
          ex = 0;
        }
        shopArr.push({
          YEAR: data["Year"],
          MONTH: data["Month"],
          INCOME: data["sum_price"],
          EXTRA: ex
        });
      });
    } else {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      shopArr.push({ YEAR: str, MONTH: month, INCOME: 0, EXTRA: ex });
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
