//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateData(req, res, ip);
};

//Section Method
async function updateData(req, res, ip) {
  try {
    // console.log(req)
    const SO_CODE = req.SO_CODE;
    const MEM_CODE = req.MEM_CODE;
    const PROCESS_ID = req.PROCESS_ID;
    const EXP_STATUS = req.EXP_STATUS;

    q = `SELECT "SO_STATUS" FROM public."T_SALEORDER_HEADER" WHERE "SO_CODE" = $1 and "MEM_CODE" = $2`; // String query
    var { rows } = await queryFunc.queryRow(q, [SO_CODE, MEM_CODE]);
    // console.log(rows[0].SO_STATUS)
    if (PROCESS_ID == 2) {
      if (EXP_STATUS == 1) {
        qArr = [];
        pArr = [];
        if (rows[0].SO_STATUS == 1) {
          q = `UPDATE public."T_SALEORDER_HEADER" set "SO_STATUS" = 0 , "LASTUPDATE_AT" = NOW(), "LASTUPDATE_BY" = $1, "CANCEL_AT" = NOW(), "CANCEL_BY" = $2 , "CANCEL_REASON" = 'ผู้ซื้อยกเลิก Order จาก Application' WHERE "SO_CODE" = $3 and "MEM_CODE" = $4`;
          qArr.push(q);
          p = [MEM_CODE, MEM_CODE,SO_CODE, MEM_CODE];
          pArr.push(p);
          await queryFunc.queryAction(qArr, pArr);
          res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
        } else if (rows[0].SO_STATUS == 2) {
          /// return status canceled
          res.status(200).send({ STATUS: 3, RESULT: "SUCCESS" });
        }
      } else {
        qArr = [];
        pArr = [];
        q = `UPDATE public."T_SALEORDER_HEADER" set "SO_STATUS" = 2, "LASTUPDATE_AT" = NOW(), "LASTUPDATE_BY" = $1 WHERE "SO_CODE" = $2 and "MEM_CODE" = $3`;
        qArr.push(q);
        p = [MEM_CODE, SO_CODE, MEM_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      }
    } else {
      /// delete order
      // console.log('done')
      qArr = [];
      pArr = [];
      q = `DELETE FROM public."T_SALEORDER_HEADER" WHERE "SO_CODE" = $1 and "MEM_CODE" = $2`;
      qArr.push(q);
      p = [SO_CODE, MEM_CODE];
      pArr.push(p);

      q = `DELETE FROM "T_SALEORDER_BILLING_ITEM" WHERE "SO_CODE" = $1`;
      qArr.push(q);
      p = [SO_CODE];
      pArr.push(p);

      q = `DELETE FROM "T_SALEORDER_BILLING_SEND" WHERE "SO_CODE" = $1`;
      qArr.push(q);
      p = [SO_CODE];
      pArr.push(p);

      q = `DELETE FROM "T_SALEORDER_PAYMENT" WHERE "SO_CODE" = $1 `;
      qArr.push(q);
      p = [SO_CODE];
      pArr.push(p);
      // console.log(qArr)
      // console.log(pArr)
      await queryFunc.queryAction(qArr, pArr);
      res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
    }
  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
