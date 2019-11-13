//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertStoryFov(req, res, ip);
};

//Section Method
async function insertStoryFov(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const SHOP_CODE = req.SHOP_CODE;
    qArr = [];
    pArr = [];
    q = `SELECT count(*) as TOTAL FROM "T_SHOP_FOV"
        WHERE "T_SHOP_FOV"."MEM_CODE" = $1
        and "T_SHOP_FOV"."SHOP_CODE" = $2 `;

    var { rows } = await queryFunc.queryRow(q, [MEM_CODE, SHOP_CODE]);
    if (rows[0]["total"] == 0) {
      try {
        q = `INSERT INTO public."T_SHOP_FOV"(
                    "MEM_CODE", "SHOP_CODE","FOV_AT")
                    VALUES ($1, $2,NOW());`;
        qArr.push(q);
        p = [MEM_CODE, SHOP_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    } else {
      try {
        q = `DELETE FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."MEM_CODE" = $1
                and "T_SHOP_FOV"."SHOP_CODE" = $2  ;`;
        qArr.push(q);
        p = [MEM_CODE, SHOP_CODE];
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
