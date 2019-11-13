//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertCart(req, res, ip);
};
exports.func_get = function(
  shop_code,
  cate_code,
  sub_cate_code,
  type_cate_code,
  res
) {
  const ip = globalIP;
  getCart(shop_code, cate_code, sub_cate_code, type_cate_code, res, ip);
};

//Section Method
async function insertCart(req, res, ip) {
  try {
    const SHOP_CODE = req.SHOP_CODE;
    const CATE_CODE = req.CATE_CODE;
    const SUB_CATE_CODE = req.SUB_CATE_CODE;
    const TYPE_CATE_CODE = req.TYPE_CATE_CODE;
    const GOODS_DESC_TH = req.GOODS_DESC_TH;
    const ADMIN_NAME = req.ADMIN_NAME;
    qArr = [];
    pArr = [];
    q =
      'SELECT count(*) as TOTAL FROM "T_GOODS_DESC" WHERE "SHOP_CODE" = $1 and "CATE_CODE" = $2 and "SUB_CATE_CODE" = $3 and "TYPE_CATE_CODE" = $4 ';
    var { rows } = await queryFunc.queryRow(q, [
      SHOP_CODE,
      CATE_CODE,
      SUB_CATE_CODE,
      TYPE_CATE_CODE
    ]);
    qArr = [];
    pArr = [];
    if (rows[0]["total"] == 0) {
      try {
        q = `INSERT INTO public."T_GOODS_DESC"(
            "SHOP_CODE", "CATE_CODE", "SUB_CATE_CODE", "GOODS_DESC_TH", "TYPE_CATE_CODE","ACTION_AT","ACTION_BY")
            VALUES ($1, $2, $3, $4, $5,NOW(),$6);`;
        qArr.push(q);
        p = [
          SHOP_CODE,
          CATE_CODE,
          SUB_CATE_CODE,
          GOODS_DESC_TH,
          TYPE_CATE_CODE,
          ADMIN_NAME
        ];
        pArr.push(p);
        var ACTION_DESC = "INSERT NEW GOODS DESC";
        q = `INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3);`;
        qArr.push(q);
        p = [ADMIN_NAME, SHOP_CODE, ACTION_DESC];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    } else {
      try {
        q = `UPDATE public."T_GOODS_DESC"
              SET "GOODS_DESC_TH"=$1,"ACTION_AT"=NOW(),"ACTION_BY"=$2
              WHERE "SHOP_CODE"=$3 and "CATE_CODE"=$4 and "SUB_CATE_CODE"=$5 and "TYPE_CATE_CODE"=$6 ;`;
        qArr.push(q);
        p = [
          GOODS_DESC_TH,
          ADMIN_NAME,
          SHOP_CODE,
          CATE_CODE,
          SUB_CATE_CODE,
          TYPE_CATE_CODE
        ];
        pArr.push(p);
        var ACTION_DESC = "UPDATE GOODS DESC";
        q = `INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3);`;
        qArr.push(q);
        p = [ADMIN_NAME, SHOP_CODE, ACTION_DESC];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
async function getCart(
  shop_code,
  cate_code,
  sub_cate_code,
  type_cate_code,
  res,
  ip
) {
  try {
    const arrResult = [];
    q = `SELECT  "GOODS_DESC_TH"
        FROM "T_GOODS_DESC" WHERE "SHOP_CODE"=$1 and "CATE_CODE"=$2 and "SUB_CATE_CODE"=$3 and "TYPE_CATE_CODE" =$4;`;
    var { rows } = await queryFunc.queryRow(q, [
      shop_code,
      cate_code,
      sub_cate_code,
      type_cate_code
    ]);
    rows.map((data, index) => {
      arrResult.push({ GOODS_DESC_TH: data["GOODS_DESC_TH"] });
    });

    res.status(200).send({ STATUS: 1, RESULT: arrResult });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
