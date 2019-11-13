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
    // Section Define Variable
    const sendArr = [];

    // Section Method of Function
    q = `select "IMG_PATH" from "T_HOME_BANNER" where "IMG_STATUS" = 1 and "PRIORITY_FLAG" =  2 and cast( NOW() as date) < "EXP_DATE" ORDER BY random() limit 4`; // String query
    var { rows } = await queryFunc.queryRow(q, []);
    if (rows.length > 0) {
      rows.map((data, index) => {
        shopImg = ip + "/api/img/BANNER_HOME/" + data["IMG_PATH"];
        sendArr.push({
          IMG_PATH: shopImg
        });
      });
      if (rows.length <= 4) {
        let diff = 4 - rows.length;
        if (diff > 0) {
          // Section Method of Function
          q = `select "IMG_PATH" from "T_HOME_BANNER" where "IMG_STATUS" = 1 and "PRIORITY_FLAG" =  1 and cast( NOW() as date) < "EXP_DATE" ORDER BY random() limit $1`; // String query
          var { rows } = await queryFunc.queryRow(q, [diff]);
          rows.map((data, index) => {
            shopImg = ip + "/api/img/BANNER_HOME/" + data["IMG_PATH"];
            sendArr.push({
              IMG_PATH: shopImg
            });
          });
        }
      }
    } else {
      let diff = 4;
      q = `select "IMG_PATH" from "T_HOME_BANNER" where "IMG_STATUS" = 1 and "PRIORITY_FLAG" =  1 and cast( NOW() as date) < "EXP_DATE" ORDER BY random() limit $1`; // String query
      var { rows } = await queryFunc.queryRow(q, [diff]);
      rows.map((data, index) => {
        shopImg = ip + "/api/img/BANNER_HOME/" + data["IMG_PATH"];
        sendArr.push({
          IMG_PATH: shopImg
        });
      });
    }

    // Section Response Normal Data
    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    // Section Response Exception Data
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
