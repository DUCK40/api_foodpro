//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};

//Section Method
async function getDetail(req, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT "M_SHOP"."SHOP_CODE","M_SHOP"."SHOP_NAME_TH",
        "M_SHOP"."SHOP_ADDRESS_NO", "G_DISTRICT"."DISTRICT_NAME_TH",
        "G_PROVINCE"."PROVINCE_NAME_TH", "M_SHOP"."SHOP_EMAIL",
        "M_SHOP"."SHOP_PHONE" ,"M_SHOP"."SHOP_IMG_PATH_PROFILE" ,"M_SHOP"."SHOP_IMG_PATH_BANNER" ,"SHOP_STATUS",
        (SELECT  COUNT(*) AS TOTAL FROM (select  distinct * from "M_GOODS" WHERE  "M_GOODS"."SHOP_CODE" =  "M_SHOP"."SHOP_CODE") as S),
        "T_SHOP_PAYMENT"."BANK_CODE"
        FROM "M_SHOP"
        INNER JOIN "G_PROVINCE" ON "M_SHOP"."PROVINCE_CODE" = "G_PROVINCE"."PROVINCE_CODE"
        INNER JOIN "G_DISTRICT" ON "M_SHOP"."DISTRICT_CODE" = "G_DISTRICT"."DISTRICT_CODE"
        LEFT JOIN  "T_SHOP_PAYMENT" ON "M_SHOP"."SHOP_CODE" = "T_SHOP_PAYMENT"."SHOP_CODE"
        order by "SHOP_STATUS" desc, "SHOP_CREATE_AT" desc`;
    var { rows } = await queryFunc.queryRow(q, []);
    rows.map((data, index) => {
      var SHOP_IMG_PATH_PROFILE = 0;
      var SHOP_IMG_PATH_BANNER = 0;
      if (data["SHOP_IMG_PATH_PROFILE"] != null) {
        SHOP_IMG_PATH_PROFILE = 1;
      }
      if (data["SHOP_IMG_PATH_BANNER"] != null) {
        SHOP_IMG_PATH_BANNER = 1;
      }
      sendArr.push({
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME_TH: data["SHOP_NAME_TH"],
        SHOP_ADDRESS_NO: data["SHOP_ADDRESS_NO"],
        DISTRICT_NAME_TH: data["DISTRICT_NAME_TH"],
        PROVINCE_NAME_TH: data["PROVINCE_NAME_TH"],
        SHOP_EMAIL: data["SHOP_EMAIL"],
        SHOP_PHONE: data["SHOP_PHONE"],
        SHOP_IMG_PATH_PROFILE: SHOP_IMG_PATH_PROFILE,
        SHOP_IMG_PATH_BANNER: SHOP_IMG_PATH_BANNER,
        SHOP_STATUS: data["SHOP_STATUS"],
        ITEM: data["total"],
        B_CODE: data["BANK_CODE"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
