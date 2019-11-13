//Section Include
var logger = require("../../../../logger/logger")
var queryFunc = require("../../../helpFunction/queryFunction")

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  main(req, res, ip);
};

//Section Method
async function main(req, res, ip) {
  try {
    if (req != "C190612") {
      q = `SELECT "G_CATEGORY"."CATE_CODE" ,"G_SUBCATEGORY"."SUB_CATE_CODE","G_SUBCATEGORY"."SUB_CATE_NAME_TH","G_SUBCATEGORY"."SUB_CATE_NAME_EN","G_SUBCATEGORY"."SUB_CATE_IMG_PATH" 
				FROM "G_SUBCATEGORY"
				inner join "G_CATEGORY" on "G_SUBCATEGORY"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
				where "G_CATEGORY"."CATE_CODE" = $1 and "G_SUBCATEGORY"."SUB_CATE_CODE" in
				(SELECT "SUB_CATE_CODE" FROM "M_GOODS" INNER JOIN "M_SHOP" ON "M_GOODS"."SHOP_CODE" = "M_SHOP"."SHOP_CODE" and "M_SHOP"."SHOP_STATUS" <> 0  WHERE "M_GOODS"."IS_STOCK" = 1)`;

      var { rows } = await queryFunc.queryRow(q, [req]);
      newArr = [];
      if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
          img =
            ip +
            "/api/img/" +
            rows[i]["CATE_CODE"] +
            "/" +
            rows[i]["SUB_CATE_IMG_PATH"];
          newArr.push({
            CATE_CODE: rows[i]["CATE_CODE"],
            SUB_CATE_CODE: rows[i]["SUB_CATE_CODE"],
            SUB_CATE_NAME_TH: rows[i]["SUB_CATE_NAME_TH"],
            SUB_CATE_NAME_EN: rows[i]["SUB_CATE_NAME_EN"],
            SUB_CATE_IMG_PATH: img
          });
        }
      }
    } else {
      q = `SELECT * FROM "G_MARKET" WHERE "MARKET_CODE" not in ('0','M01','M03')`;

      var { rows } = await queryFunc.queryRow(q, []);
      newArr = [];
      if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
          img = ip + "/api/img/" + req + "/" + rows[i]["MARKET_IMG_PATH"];
          newArr.push({
            MARKET_CODE: rows[i]["MARKET_CODE"],
            MARKET_NAME: rows[i]["MARKET_NAME_TH"],
            MARKET_IMG: img
          });
        }
      }
    }
    if (newArr.length>0) {
      res.status(200).send({ STATUS: 1, RESULT: newArr });
    } else {
      res.status(200).send({ STATUS: 3, RESULT: newArr });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
