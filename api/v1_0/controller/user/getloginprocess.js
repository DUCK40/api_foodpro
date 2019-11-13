//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const crypto = require("crypto");

//Section CURD
exports.func_get = function(email, pass, type, res) {
  const ip = globalIP;
  main(email, pass, type, res, ip);
};

//Section Method
async function main(email, pass, type, res, ip) {
  try {
    member = [];
    address = [];
    qArr = [];
    pArr = [];
    const algorithm = "aes-256-cbc";
    const secretkey = "qazxswedcvfrtgb";
    const cipher = crypto.createCipher(algorithm, secretkey);
    var encrypted = cipher.update(pass, "utf8", "hex");
    encrypted += cipher.final("hex");
    q = `SELECT l1."MEM_CODE"
      FROM "T_MEMBER_LOGIN" as l1
      where "MEM_USERNAME" = $1 and "MEM_PASSWORD" = $2 and "MEM_LOGIN_TYPE" = $3`;
    var { rows } = await queryFunc.queryRow(q, [email, encrypted, type]);
    if (rows.length > 0) {
      MEM_CODE = rows[0]["MEM_CODE"];
      q = `INSERT INTO public."T_MEMBER_LOGIN_LOG"(
            "MEM_CODE", "MEM_LASTLOGIN", "MEM_LOGIN_TYPE")
            VALUES ($1, NOW(), $2)`;
      qArr.push(q);
      p = [MEM_CODE, type];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
      member.push({ MEM_CODE: MEM_CODE });
      res.status(200).json({ STATUS: 1, RESULT: member });
    } else {
      var bNull = [];
      res.status(200).send({ STATUS: 3, RESULT: bNull });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.send("Database " + err);
  }
}
