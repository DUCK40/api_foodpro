//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertData(req, res, ip);
};
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateData(req, res, ip);
};

//Section Method
async function insertData(req, res, ip) {
  try {
    const SHOP_CODE = req.SHOP_CODE;
    const BANK_CODE = req.BANK_CODE;
    const ACC_NO = req.ACC_NO;
    const ACC_NAME = req.ACC_NAME;
    const ADMIN_NAME = req.ADMIN_NAME;
    let qArr = [];
    let pArr = [];
    q = `SELECT COUNT(*) as TOTAL  FROM public."T_SHOP_PAYMENT" WHERE "SHOP_CODE" = $1`; // String query
    var { rows } = await queryFunc.queryRow(q, [SHOP_CODE]);
    // console.log(rows[0]["total"]);
    if (rows[0]["total"] == 0) {
      q = `INSERT INTO public."T_SHOP_PAYMENT"(
        "SHOP_CODE", "BANK_CODE", "ACC_NAME", "ACC_NO")
        VALUES ($1,$2, $3, $4);`;
      qArr.push(q);
      p = [SHOP_CODE, BANK_CODE, ACC_NAME, ACC_NO];
      pArr.push(p);

      var ACTION_DESC = "INSERT SHOP PAYMENT";
      q = `INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1","REF_KEY_2","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3 , $4);`;
      qArr.push(q);
      p = [ADMIN_NAME, SHOP_CODE, ACC_NO, ACTION_DESC];
      pArr.push(p);

      await queryFunc.queryAction(qArr, pArr);
    }
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function updateData(req, res, ip) {
  try {
    const SHOP_CODE = req.SHOP_CODE;
    const BANK_CODE = req.BANK_CODE;
    const ACC_NO = req.ACC_NO;
    const ACC_NAME = req.ACC_NAME;
    let qArr = [];
    let pArr = [];
    q = `UPDATE public."T_SHOP_PAYMENT"
          SET    "BANK_CODE"=$1, "ACC_NAME"=$2, "ACC_NO"=$3
          WHERE "SHOP_CODE"=$4`;
    qArr.push(q);
    p = [BANK_CODE, ACC_NAME, ACC_NO, SHOP_CODE];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
