//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_put = function(path, memcode,IMGTYPE, res) {
  const ip = globalIP;
  insertPicProfile(path, memcode,IMGTYPE, res, ip);
};

//Section Method
async function insertPicProfile(path, memcode,IMGTYPE, res, ip) {
  try {
    qArr = [];
    pArr = [];
    if(IMGTYPE=="Profile"){
      q = `UPDATE public."M_MEMBER"
      SET  "MEM_IMG_PATH"=$1
      WHERE "MEM_CODE"=$2;`;
    }else{
      q = `UPDATE public."M_MEMBER"
        SET  "MEM_IMG_BANNER"=$1
        WHERE "MEM_CODE"=$2;`;
    }
    
    qArr.push(q);
    p = [path, memcode];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
