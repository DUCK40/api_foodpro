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
    // const arrPrice =[]
    const sendArr = [];
    // const groupArr=[];
    q = `SELECT "UNIT_CODE", "UNIT_NAME_TH"
    FROM public."G_UNIT"
    order by "UNIT_CODE";`;
    var { rows } = await queryFunc.queryRow(q, []);
    // console.log(JSON.stringify(rows))
    rows.map((data, index) => {
      sendArr.push({
        UNIT_CODE: data["UNIT_CODE"],
        UNIT_NAME_TH: data["UNIT_NAME_TH"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    // console.log("Database " + err);
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
