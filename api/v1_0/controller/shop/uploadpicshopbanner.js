//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(path, shopcode,ADMIN_NAME, res) {
  const ip = globalIP;
  insertPicProfile(path, shopcode,ADMIN_NAME, res, ip);
};

//Section Method
async function insertPicProfile(path, SHOP_CODE,ADMIN_NAME, res, ip) {
  try {
    qArr = [];
    pArr = [];
    q = `UPDATE public."M_SHOP"
        SET  "SHOP_IMG_PATH_BANNER"=$1
        WHERE "SHOP_CODE"=$2;`;
    qArr.push(q);
    p = [path, SHOP_CODE];
    pArr.push(p);

    var ACTION_DESC = "UPDATE PIC SHOP BANNER";
    q = `INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1", "REF_KEY_2","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3,$4);`;
    qArr.push(q);
    p = [ADMIN_NAME, SHOP_CODE,path ,ACTION_DESC];
    pArr.push(p);

    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
