//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(path, catecode, subcatecode, res) {
  const ip = globalIP;
  insertPic(path, catecode, subcatecode, res, ip);
};

//Section Method
async function insertPic(path, catecode, subcatecode, res, ip) {
  try {
    let qArr =[]
    let pArr =[]
    q = `UPDATE public."G_SUBCATEGORY"
        SET   "SUB_CATE_IMG_BANNER"=$1
        WHERE "SUB_CATE_CODE"=$2 and "CATE_CODE"=$3`;
    qArr.push(q);
    p=[path, subcatecode, catecode]
    pArr.push(p)
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
