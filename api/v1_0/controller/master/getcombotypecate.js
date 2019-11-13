//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertData(req, res, ip);
};
exports.func_get = function(req, req2, res) {
  const ip = globalIP;
  getDetail(req, req2, res, ip);
};

//Section Method
async function getDetail(req, req2, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT * FROM "G_TYPECATEGORY" WHERE "CATE_CODE" = $1 and  "SUB_CATE_CODE" = $2 ORDER BY "TYPE_CATE_CODE" asc`;
    var { rows } = await queryFunc.queryRow(q, [req,req2]);
    rows.map((data, index) => {
      sendArr.push({
        value: data["TYPE_CATE_CODE"],
        label: data["TYPE_CATE_NAME_TH"]
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
    const SUB_CATE_CODE = req.SUB_CATE_CODE;
    const TYPE_CATE_NAME_TH = req.TYPE_CATE_NAME_TH;
    qArr =[]
    pArr =[]
    q ='SELECT "TYPE_CATE_CODE" FROM "G_TYPECATEGORY"  order by "TYPE_CATE_CODE" desc limit 1';
    var { rows } = await queryFunc.queryRow(q, []);

    if (rows.length == 0) {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      TYPE_CATE_CODE = "TC" + year + month + "0001";
    } else {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      OLD_TYPE_CATE_CODE = rows[0].TYPE_CATE_CODE;
      // OLD_TYPE_CATE_CODE ='1110'
      var lastMonth = parseInt(
        OLD_TYPE_CATE_CODE.substring(
          OLD_TYPE_CATE_CODE.length - 6,
          OLD_TYPE_CATE_CODE.length - 4
        )
      );
      lastMonth = ("0" + lastMonth).slice(-2).toString();
      if (month != lastMonth) {
        TYPE_CATE_CODE = "TC" + year + month + "0001";
      } else {
        lastIndex =
          parseInt(
            OLD_TYPE_CATE_CODE.substring(
              OLD_TYPE_CATE_CODE.length - 4,
              OLD_TYPE_CATE_CODE.length
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
        TYPE_CATE_CODE = "TC" + year + month + lastIndex;
      }
    }
    q=`INSERT INTO public."G_TYPECATEGORY"(
        "TYPE_CATE_CODE", "TYPE_CATE_NAME_TH", "SUB_CATE_CODE", "CATE_CODE", "CREATE_AT")
        VALUES ($1, $2, $3, $4, NOW());`
    qArr.push(q)
    p= [TYPE_CATE_CODE,TYPE_CATE_NAME_TH,SUB_CATE_CODE,CATE_CODE]
    pArr.push(p)

    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({STATUS:1,RESULT:"SUCCESS",CODE:TYPE_CATE_CODE})
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
