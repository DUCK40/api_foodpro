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
    q = `SELECT * FROM public."G_SEND" order by "SEND_CODE" asc`;
    var { rows } = await queryFunc.queryRow(q, []);
    rows.map((data, index) => {
      sendArr.push({ value: data["SEND_CODE"],
      label: data["SEND_NAME_TH"] });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
