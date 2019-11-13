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
    q = `SELECT * FROM "G_SUBCATEGORY" WHERE "CATE_CODE" = $1 ORDER BY "SUB_CATE_CODE" asc`;
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

async function insertData(req, res, ip) {
  try {
    const CATE_CODE = req.CATE_CODE;
    const SUB_CATE_NAME_TH = req.SUB_CATE_NAME_TH;
    const SUB_CATE_NAME_EN = req.SUB_CATE_NAME_EN;
    qArr = [];
    pArr = [];

    //Get last SUB_CATE_CODE
    q =
      'SELECT "SUB_CATE_CODE" FROM "G_SUBCATEGORY"  order by "SUB_CATE_CODE" desc limit 1';
    var { rows } = await queryFunc.queryRow(q, []);
    //Check Row if null = Not have record in table
    //SUB_CATE_CODE @Format: SC+Year(2)+Month(2)+ XXX(Running number in month)(3)
    if (rows.length == 0) {
      //if null
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      SUB_CATE_CODE = "SC" + year + month + "001";
    } else {
      //not null
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      OLD_SUB_CATE_CODE = rows[0].SUB_CATE_CODE;
      //Substring last index to get month and parse to int and add 1 to new Index month
      var lastMonth = parseInt(
        OLD_SUB_CATE_CODE.substring(
          OLD_SUB_CATE_CODE.length - 5,
          OLD_SUB_CATE_CODE.length - 3
        )
      );
      //change new Index month from get before to integer 2 digit
      lastMonth = ("0" + lastMonth).slice(-2).toString();
      //check month
      if (month != lastMonth) {
        //New month
        SUB_CATE_CODE = "SC" + year + month + "001";
      } else {
        //Same month
        lastIndex =
          parseInt(
            OLD_SUB_CATE_CODE.substring(
              OLD_SUB_CATE_CODE.length - 3,
              OLD_SUB_CATE_CODE.length
            )
          ) + 1;
        //New Index of code change to 3 digit
        if (lastIndex <= 9) {
          lastIndex = ("00" + lastIndex).slice(-3).toString();
        } else if (lastIndex >= 10 && lastIndex <= 99) {
          lastIndex = ("0" + lastIndex).slice(-3).toString();
        } else {
          lastIndex = lastIndex.toString();
        }
        SUB_CATE_CODE = "SC" + year + month + lastIndex;
      }
    }
    q = `INSERT INTO public."G_SUBCATEGORY"(
        "SUB_CATE_CODE", "SUB_CATE_NAME_TH", "SUB_CATE_NAME_EN", "CATE_CODE", "CREATE_AT")
        VALUES ($1, $2, $3, $4, NOW());`;
    qArr.push(q);
    p = [SUB_CATE_CODE, SUB_CATE_NAME_TH, SUB_CATE_NAME_EN, CATE_CODE];
    pArr.push(p);

    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS", CODE: SUB_CATE_CODE });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
