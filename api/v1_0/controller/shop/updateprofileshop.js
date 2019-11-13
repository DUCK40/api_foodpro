//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateProfile(req, res, ip);
};

//Section Method
async function updateProfile(req, res, ip) {
  try {
    const SHOP_CODE = req.SHOP_CODE;
    const SHOP_NAME_TH = req.SHOP_NAME_TH;
    const ADDRESS_NO = req.ADDRESS_NO;
    const DISTRICT_CODE = req.DISTRICT_CODE;
    const PROVINCE_CODE = req.PROVINCE_CODE;
    const SHOP_PHONE = req.SHOP_PHONE;
    const MARKET_CODE = req.MARKET_CODE;

    qArr = [];
    pArr = [];

    q = `UPDATE public."M_SHOP"
        SET  "SHOP_NAME_TH"=$1, "SHOP_ADDRESS_NO"=$2, "DISTRICT_CODE"=$3, "PROVINCE_CODE"=$4, "MARKET_CODE"=$5, "SHOP_PHONE"=$6
        WHERE "SHOP_CODE"=$7;`;
    qArr.push(q);
    p = [
      SHOP_NAME_TH,
      ADDRESS_NO,
      DISTRICT_CODE,
      PROVINCE_CODE,
      MARKET_CODE,
      SHOP_PHONE,
      SHOP_CODE
    ];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
