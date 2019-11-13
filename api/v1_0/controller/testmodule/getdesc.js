//Section Include
var logger = require("../../../../logger/logger");
// var queryFunc = require("../../../helpFunction/queryFunction");
// var dimensionblock = require("../../../helpFunction/dimensionblock")
var getDescriptionBlock = require("../../../helpFunction/getDestination");

//Section CURD
exports.func_get = function(pCode, dCode, res) {
  const ip = globalIP;
  getDetail(pCode, dCode, res, ip);
};

//Section Method
async function getDetail(pCode, dCode, res, ip) {
  try {
    let newArr = [];
    var rows = await getDescriptionBlock.getDescription(
        pCode,
        dCode
    );

    res.status(200).json({ STATUS: 1, RESULT: rows });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
