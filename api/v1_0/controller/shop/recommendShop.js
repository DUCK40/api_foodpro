//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(memid, mode, res) {
  const ip = globalIP;
  getDetail(memid, mode, res, ip);
};

//Section Method
async function getDetail(memid, mode, res, ip) {
  try {
    const shopArr = [];
    q = `SELECT ss.*
        FROM
        (SELECT "SHOP_CODE"
                ,"SHOP_NAME_TH"
                ,MS."MARKET_CODE"
                ,"MARKET_NAME_TH"
                ,"SHOP_IMG_PATH_PROFILE"
                 ,"SHOP_CREATE_AT"
                 ,"IS_PROMOTE"
                 ,GD."DISTRICT_NAME_TH"
                ,GP."PROVINCE_NAME_TH"
                ,GD."POSTCODE"
                ,"SHARE_LINK"
                ,(SELECT count(*) as TOTALA FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE" = MS."SHOP_CODE")
                ,(SELECT COUNT(*) AS TOTAL FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE"  = MS."SHOP_CODE"
                                and "T_SHOP_FOV"."MEM_CODE" = $1)
                FROM "M_SHOP" as MS
                INNER JOIN "G_MARKET" as GM on MS."MARKET_CODE" = GM."MARKET_CODE"
                INNER JOIN "G_DISTRICT" as GD on GD."DISTRICT_CODE" = MS."DISTRICT_CODE" and GD."PROVINCE_CODE" = MS."PROVINCE_CODE"
                INNER JOIN "G_PROVINCE" as GP on  GP."PROVINCE_CODE" = MS."PROVINCE_CODE"
                WHERE MS."SHOP_STATUS" = 2) as ss
                ORDER BY ss."IS_PROMOTE" desc ,ss."totala" desc, ss."SHOP_CREATE_AT" desc`;
    if (mode == 1) {
      q = q + ` limit 4`;
    }
    var { rows } = await queryFunc.queryRow(q, [memid]);
    rows.map((data, index) => {
      shopImg = ip + "/api/img/shop/" + data["SHOP_IMG_PATH_PROFILE"];
      if (data["total"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }
      shopArr.push({
        MARKET_CODE: data["MARKET_CODE"],
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME: data["SHOP_NAME_TH"],
        MARKET_NAME: data["MARKET_NAME_TH"],
        DISTRICT_NAME_TH: data["DISTRICT_NAME_TH"],
        PROVINCE_NAME_TH: data["PROVINCE_NAME_TH"],
        POSTCODE: data["POSTCODE"],
        SHOP_IMG: shopImg,
        LINK: data["SHARE_LINK"],
        ME_FOV: me_fov
      });
    });

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
