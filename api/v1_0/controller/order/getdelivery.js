//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const axios = require("axios");

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDelivery(req, res, ip);
};

//Section Method
async function getDelivery(SM_CODE, res, ip) {
  try {
    q = `SELECT
        distinct
                "SM_CODE"
                ,"SM_NAME_TH"
                ,"DP_NAME_TH"
                ,"SM_DESC_TH"
                ,"IS_DEMAND"
                ,"D_IMG_PATH"
                ,"G_SEND"."SEND_CODE"
                ,"IS_EXPRESS"
                ,"G_SEND"."SEND_CODE"
                FROM "G_SEND"
                inner join "M_DELIVERY_CHOICE" on "G_SEND"."SEND_CODE" = "M_DELIVERY_CHOICE"."SEND_CODE" and "SM_STATUS"=1 and "SM_CODE"=$1
                inner join "M_DELIVERY_PROVIDER" on "M_DELIVERY_CHOICE"."DP_CODE" = "M_DELIVERY_PROVIDER"."DP_CODE"
                inner join "T_DELIVERY_IMG" on "T_DELIVERY_IMG"."D_IMG_CODE" = "M_DELIVERY_CHOICE"."D_IMG_CODE"

                order by "SM_CODE"`;
    var { rows } = await queryFunc.queryRow(q, [SM_CODE]);
    res.status(200).send({ STATUS: 1, RESULT: rows });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
