//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};

//Section Method
async function getDetail(req, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT "TYPE_CATE_CODE", "TYPE_CATE_NAME_TH", "SUB_CATE_CODE", "CATE_CODE"
    FROM public."G_TYPECATEGORY"
    order by "CATE_CODE","SUB_CATE_CODE";`;
    var { rows } = await queryFunc.queryRow(q, []);
    rows.map((data, index) => {
      sendArr.push({
        TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
        TYPE_CATE_NAME_TH: data["TYPE_CATE_NAME_TH"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        CATE_CODE: data["CATE_CODE"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
