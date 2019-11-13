//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertData(req, res, ip);
};
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};

//Section Method
async function getDetail(GOODS_CODE, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT "GOODS_DIM_X","GOODS_DIM_Y","GOODS_DIM_Z"  FROM public."M_GOODS" WHERE "GOODS_CODE" = $1 `;
    var { rows } = await queryFunc.queryRow(q, [GOODS_CODE]);
    rows.map((data, index) => {
      sendArr.push({
        GOODS_DIM_X: data["GOODS_DIM_X"],
        GOODS_DIM_Y: data["GOODS_DIM_Y"],
        GOODS_DIM_Z: data["GOODS_DIM_Z"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function insertData(req, res, ip) {
  try {
    qArr =[]
    pArr =[]
    const GOODS_CODE = req.GOODS_CODE;
    const GOODS_DIM_X = req.GOODS_DIM_X;
    const GOODS_DIM_Y = req.GOODS_DIM_Y;
    const GOODS_DIM_Z = req.GOODS_DIM_Z;
    const ADMIN_NAME = req.ADMIN_NAME;
    const SHOP_CODE = req.SHOP_CODE;
    q = `UPDATE "M_GOODS" SET "GOODS_DIM_X" = $1 ,"GOODS_DIM_Y" = $2,"GOODS_DIM_Z" = $3 WHERE "GOODS_CODE" = $4`;
    qArr.push(q);
    p = [GOODS_DIM_X, GOODS_DIM_Y, GOODS_DIM_Z, GOODS_CODE];
    pArr.push(p);

    var ACTION_DESC = "UPDATE DIMENSION GOODS";
    q = `INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1", "REF_KEY_3","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3, $4);`;
    qArr.push(q);
    p = [ADMIN_NAME, SHOP_CODE, GOODS_CODE, ACTION_DESC];
    pArr.push(p);

    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
