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
        q = `SELECT * FROM "G_SUBCATEGORY" WHERE "CATE_CODE" = $1 and "SUB_CATE_CODE" = $2 ORDER BY "SUB_CATE_CODE" asc`;
        var { rows } = await queryFunc.queryRow(q, [req]);
        rows.map((data, index) => {
          sendArr.push({
            value: data["SUB_CATE_CODE"],
            label: data["SUB_CATE_NAME_TH"]
          });
        });
        if (rows.length > 0) {
          res.status(200).json({ STATUS: 1, RESULT: sendArr });
        } else {
          res.status(200).json({ STATUS: 3, RESULT: sendArr });
        }
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
}
