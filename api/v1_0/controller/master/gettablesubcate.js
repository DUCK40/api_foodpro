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
    q = `SELECT "G_SUBCATEGORY"."CATE_CODE","G_CATEGORY"."CATE_NAME_TH","SUB_CATE_CODE", "SUB_CATE_NAME_TH", "SUB_CATE_NAME_EN",  "SUB_CATE_IMG_PATH", "SUB_CATE_IMG_BANNER"
    FROM public."G_SUBCATEGORY"
    inner join "G_CATEGORY" on "G_SUBCATEGORY"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
    order by "CATE_CODE" asc ,"SUB_CATE_CODE" asc;`;
    var { rows } = await queryFunc.queryRow(q, []);
    rows.map((data, index) => {
      sendArr.push({
        CATE_CODE: data["CATE_CODE"],
        CATE_NAME_TH: data["CATE_NAME_TH"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        SUB_CATE_NAME_TH: data["SUB_CATE_NAME_TH"],
        SUB_CATE_NAME_EN: data["SUB_CATE_NAME_EN"],
        SUB_CATE_IMG_PATH: data["SUB_CATE_IMG_PATH"],
        SUB_CATE_IMG_BANNER: data["SUB_CATE_IMG_BANNER"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
