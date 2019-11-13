//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(
  path,
  shopcode,
  catecode,
  subcatecode,
  typecatecode,
  adminname,
  res
) {
  const ip = globalIP;
  insertPicProfile(
    path,
    shopcode,
    catecode,
    subcatecode,
    typecatecode,
    adminname,
    res,
    ip
  );
};

//Section Method
async function insertPicProfile(
  path,
  SHOP_CODE,
  catecode,
  subcatecode,
  typecatecode,
  ADMIN_NAME,
  res,
  ip
) {
  try {
    qArr = [];
    pArr = [];
    q = `INSERT INTO public."T_GOODS_IMG"(
			"SHOP_CODE", "CATE_CODE", "SUB_CATE_CODE", "IMG_PATH", "TYPE_CATE_CODE","ACTION_AT","ACTION_BY")
			VALUES ($1, $2, $3, $4, $5,NOW(),$6);`;
    qArr.push(q);
    p = [SHOP_CODE, catecode, subcatecode, path, typecatecode,ADMIN_NAME];
    pArr.push(p);

    var ACTION_DESC = "INSERT SHOP ITEM PIC";
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
