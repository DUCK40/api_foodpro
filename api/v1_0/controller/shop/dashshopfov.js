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
    q = `SELECT "SHOP_CODE" ,COUNT("MEM_CODE") as TOTALFOV
        FROM public."T_SHOP_FOV"
        WHERE "SHOP_CODE" = $1
        GROUP BY "SHOP_CODE"`;
    var { rows } = await queryFunc.queryRow(q, [shop_code]);
    if (rows.length > 0) {
      rows.map((data, index) => {
        shopArr.push({
          SHOP_CODE: data["SHOP_CODE"],
          TOTALFOV: data["totalfov"]
        });
      });
    } else {
      shopArr.push({ SHOP_CODE: shop_code, TOTALFOV: "0" });
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
