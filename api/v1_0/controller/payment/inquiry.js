//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const request = require("request");
const axios = require("axios");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertData(req, res, ip);
};

//Section Method
async function insertData(req, resp, ip) {
  try {
    const SO_CODE = req.SO_CODE;
    const AMOUNT = req.AMOUNT;
    const ORDER_ID = req.ORDER_ID;
    qArr = [];
    pArr = [];
    let headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "x-api-key": "skey_test_308ZCKfxf5O16fMmClAtI7wqXlRxfwCsuwM"
    };

    var url =
      "https://dev-kpaymentgateway-services.kasikornbank.com/qr/v2/order/" +
      ORDER_ID;
    request.get(
      {
        url: url,
        headers: headers
      },
      async (err, res, body) => {
        var jsonData = JSON.parse(body);

        if (jsonData.id == null) {
          // console.log('timeout')
          // }else{
          // console.log('intime')
          // let body = JSON.stringify({
          //   amount: AMOUNT,
          //   currency: "THB",
          //   source_type: "qr",
          //   reference_order: SO_CODE
          // });
          // request.post(
          //   {
          //     url:
          //       "https://dev-kpaymentgateway-services.kasikornbank.com/qr/v2/order",
          //     headers: headers,
          //     body: body
          //   },
          //   async (err, res1, body1) => {
          //     // console.log(JSON.stringify(res1));
          //     // console.log("status = " + res.statusCode);
          //     var jsonData2 = JSON.parse(body1);
          //     var REF_BANK = jsonData2["id"];
          //     q = `UPDATE "T_SALEORDER_PAYMENT" SET
          //     "PAYMENT_TEMP" = $1
          //     WHERE "SO_CODE" = $2`;
          //     qArr.push(q);
          //     p = [REF_BANK, SO_CODE];
          //     pArr.push(p);
          //     await queryArr(qArr, pArr);
          //   }
          // );
          q = `DELETE FROM "T_SALEORDER_BILLING_ITEM"
              WHERE "SO_CODE" = $1`;
          qArr.push(q);
          p = [SO_CODE];
          pArr.push(p);
          q = `DELETE FROM "T_SALEORDER_BILLING_SEND"
          WHERE "SO_CODE" = $1`;
          qArr.push(q);
          p = [SO_CODE];
          pArr.push(p);
          q = `DELETE FROM "T_SALEORDER_PAYMENT"
          WHERE "SO_CODE" = $1`;
          qArr.push(q);
          p = [SO_CODE];
          pArr.push(p);
          q = `DELETE FROM "T_SALEORDER_HEADER"
          WHERE "SO_CODE" = $1`;
          qArr.push(q);
          p = [SO_CODE];
          pArr.push(p);
          await queryFunc.queryAction(qArr, pArr);
          resp.status(200).send({ STATUS: 3, RESULT: "SUCCESS" });
        } else {
          resp.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
        }
      }
    );
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
