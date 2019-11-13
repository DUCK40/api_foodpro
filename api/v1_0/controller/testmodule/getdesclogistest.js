//Section Include
var logger = require("../../../../logger/logger");
// var queryFunc = require("../../../helpFunction/queryFunction");
// var dimensionblock = require("../../../helpFunction/dimensionblock")
var descLogisBlock = require("../../../helpFunction/desclogisblock");

//Section CURD
exports.func_get = function(from, to, send, express, receive, res) {
  const ip = globalIP;
  getDetail(from, to, send, express, receive, res, ip);
};

//Section Method
async function getDetail(from, to, send, express, receive, res, ip) {
  try {
    let newArr = [];
    var rows = await descLogisBlock.getDescription(
      from,
      to,
      send,
      express,
      receive
    );
    res.status(200).json({ STATUS: 1, RESULT: rows.RESULT });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
