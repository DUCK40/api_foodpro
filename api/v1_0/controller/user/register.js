//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const crypto = require("crypto");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertMember(req, res, ip);
};

//Section Method
async function insertMember(req, res, ip) {
  try {
    const F_NAME = req.F_NAME;
    const L_NAME = req.L_NAME;
    const EMAIL = req.EMAIL;
    const PASSWORD = req.PASSWORD;
    const TYPE = req.TYPE;
    const PHOTO = req.PHOTO;

    q =
      'SELECT count(*) as TOTAL FROM "T_MEMBER_LOGIN" WHERE "MEM_USERNAME" = $1 ';
    var { rows } = await queryFunc.queryRow(q, [EMAIL]);
    if (rows[0]["total"] == 0) {
      ///////////////////<----------- check eamil
      try {
        /////// getlast index //////
        qArr = [];
        pArr = [];
        const IS_ACTIVE = 1;
        q =
          'SELECT "MEM_CODE" FROM "T_MEMBER_LOGIN" WHERE cast("CREATE_AT" as date) = CAST(NOW() as date) order by "MEM_CODE" desc limit 1';
        var { rows } = await queryFunc.queryRow(q, []);
        if (rows.length == 0) {
          var d = new Date();
          var date = d.getDate();
          date = ("0" + date).slice(-2).toString();
          var month = d.getMonth() + 1;
          month = ("0" + month).slice(-2).toString();
          var str = d.getFullYear().toString();
          var year = str.substring(str.length - 2, str.length);
          MEM_CODE = "U" + year + month + date + "0001";
        } else {
          var d = new Date();
          var date = d.getDate();
          date = ("0" + date).slice(-2).toString();
          var month = d.getMonth() + 1;
          month = ("0" + month).slice(-2).toString();
          var str = d.getFullYear().toString();
          var year = str.substring(str.length - 2, str.length);
          OLD_MEM_CODE = rows[0].MEM_CODE;
          lastIndex =
            parseInt(
              OLD_MEM_CODE.substring(
                OLD_MEM_CODE.length - 4,
                OLD_MEM_CODE.length
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
          MEM_CODE = "U" + year + month + date + lastIndex;
        }
        const algorithm = "aes-256-cbc";
        const secretkey = "qazxswedcvfrtgb";
        const cipher = crypto.createCipher(algorithm, secretkey);
        var encrypted = cipher.update(PASSWORD, "utf8", "hex");
        encrypted += cipher.final("hex");
        q = `INSERT INTO "M_MEMBER"(
                    "MEM_CODE", "MEM_FNAME_TH", "MEM_LNAME_TH", "MEM_CREATE_AT", "IS_SHOP_OWNER","MEM_IMG_PATH")
                    VALUES ($1, $2, $3,NOW(), $4,$5);`;
        qArr.push(q);
        p = [MEM_CODE, F_NAME, L_NAME, 1, PHOTO];
        pArr.push(p);

        q = `INSERT INTO "T_MEMBER_LOGIN"(
                    "MEM_CODE", "MEM_USERNAME", "MEM_PASSWORD", "MEM_LOGIN_TYPE", "CREATE_AT")
                    VALUES ($1, $2, $3, $4, NOW());`;
        qArr.push(q);
        p = [MEM_CODE, EMAIL, encrypted, TYPE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    } else {
      res.status(200).send({ STATUS: 0, RESULT: "Username is Dupplicated" });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
