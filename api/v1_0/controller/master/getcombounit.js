//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertData(req, res, ip);
};
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};

//Section Method
async function getDetail(req, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT * FROM public."G_UNIT" order by "UNIT_CODE" asc `;
    var { rows } = await queryFunc.queryRow(q, []);
    rows.map((data, index) => {
      sendArr.push({ value: data["UNIT_CODE"], label: data["UNIT_NAME_TH"] });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function insertData(req, res, ip) {
  try {
    const UNIT_NAME_TH = req.UNIT_NAME_TH;
    qArr = [];
    pArr = [];
    q = 'SELECT "UNIT_CODE" FROM "G_UNIT"  order by "UNIT_CODE" desc limit 1';
    var { rows } = await queryFunc.queryRow(q, []);
    if (rows.length == 0) {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      UNIT_CODE = "UT" + year + month + date + "0001";
    } else {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      OLD_UNIT_CODE = rows[0].UNIT_CODE;
      var lastDate = parseInt(
        OLD_UNIT_CODE.substring(
          OLD_UNIT_CODE.length - 6,
          OLD_UNIT_CODE.length - 4
        )
      );
      var lastMonth = parseInt(
        OLD_UNIT_CODE.substring(
          OLD_UNIT_CODE.length - 8,
          OLD_UNIT_CODE.length - 6
        )
      );
      lastDate = ("0" + lastDate).slice(-2).toString();
      lastMonth = ("0" + lastMonth).slice(-2).toString();
      if (month != lastMonth) {
        UNIT_CODE = "UT" + year + month + date + "0001";
      } else {
        if (lastDate != date) {
          UNIT_CODE = "UT" + year + month + date + "0001";
        } else {
          lastIndex =
            parseInt(
              OLD_UNIT_CODE.substring(
                OLD_UNIT_CODE.length - 4,
                OLD_UNIT_CODE.length
              )
            ) + 1;
          if (lastIndex <= 9) {
            lastIndex = ("000" + lastIndex).slice(-4).toString();
          } else if (lastIndex >= 10 && lastIndex <= 99) {
            lastIndex = ("00" + lastIndex).slice(-4).toString();
          } else if (lastIndex >= 100 && lastIndex <= 999) {
            lastIndex = ("0" + lastIndex).slice(-4).toString();
          } else {
            lastIndex = lastIndex.toString();
          }
          UNIT_CODE = "UT" + year + month + date + lastIndex;
        }
      }
    }
    q = `INSERT INTO public."G_UNIT"(
              "UNIT_CODE", "UNIT_NAME_TH")
              VALUES ($1, $2);`;
    qArr.push(q);
    p = [UNIT_CODE, UNIT_NAME_TH];
    pArr.push(p);

    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS", CODE: UNIT_CODE });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
