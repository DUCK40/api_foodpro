//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_update = function(req, res) {
  const ip = globalIP;
  updateUserAddress(req, res, ip);
};

//Section Method
async function updateUserAddress(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const ADDRESS_ID = req.ADDRESS_ID;

    qArr = [];
    pArr = [];
    q =
      'UPDATE "T_MEMBER_ADDRESS" SET "IS_DEFAULT_SHIPTO" = 0 WHERE "MEM_CODE" = $1';

    qArr.push(q);
    p = [MEM_CODE];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    qArr = [];
    pArr = [];
    q = `UPDATE public."T_MEMBER_ADDRESS"
        SET  "IS_DEFAULT_SHIPTO"= 1
        WHERE "MEM_CODE"=$1 and "ADDRESS_ID"=$2;`;
    qArr.push(q);
    p = [MEM_CODE, ADDRESS_ID];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
