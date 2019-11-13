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
    q = `SELECT * FROM "G_DISTRICT" WHERE "PROVINCE_CODE" = $1 ORDER BY "DISTRICT_CODE" asc`;
    var { rows } = await queryFunc.queryRow(q, [req]);
    rows.map((data, index) => {
      sendArr.push({
        value: data["DISTRICT_CODE"],
        label: data["DISTRICT_NAME_TH"],
        PROVINCE_CODE: data["PROVINCE_CODE"],
        POSTCODE: data["POSTCODE"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
