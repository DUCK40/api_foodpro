//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const request = require("request");
const axios = require("axios");

//Section CURD
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateOrder(req, res, ip);
};

//Section Method
async function updateOrder(req, res, ip) {
  try {
    const SO_CODE = req.SO_CODE;
    const REF_BANK = req.REF_BANK;
    const PAYMENT_TYPE = req.PAYMENT_TYPE;
    const PAYMENT_HOST = req.PAYMENT_HOST;
    const PRICE = req.PRICE;
    const CURRENCY = req.CURRENCY;

    qArr = [];
    pArr = [];

    q = `UPDATE public."T_SALEORDER_PAYMENT"
        SET  "PAYMENT_TYPE"=$1, "PAYMENT_HOST"=$2, "PAYMENT_REF"=$3, "PAYMENT_SUM_COST"=$4,"PAYMENT_CURRENCY" =$5, "PAYMENT_STATUS"=2, "LASTUPDATE_AT"=NOW()
        WHERE "SO_CODE"=$6;`;
    qArr.push(q);
    p = [PAYMENT_TYPE, PAYMENT_HOST, REF_BANK, PRICE, CURRENCY, SO_CODE];
    pArr.push(p);

    q = `UPDATE public."T_SALEORDER_BILLING_ITEM"
        SET  "BILL_STATUS"=2
        WHERE "SO_CODE"=$1;`;
    qArr.push(q);
    p = [SO_CODE];
    pArr.push(p);

    await queryFunc.queryAction(qArr, pArr);

    q = `SELECT distinct "DEVICE_TOKEN" FROM "T_MEMBER_DEVICE" WHERE "MEM_CODE" in 
    (SELECT "M_SHOP"."SHOP_CREATE_BY"
      FROM "T_SALEORDER_BILLING_ITEM"
      inner join "M_SHOP" on "M_SHOP"."SHOP_CODE"="T_SALEORDER_BILLING_ITEM"."SHOP_CODE"
      where "SO_CODE" = $1);`;
    var { rows } = await queryFunc.queryRow(q, [SO_CODE]);
    var arrToken = {TOKENARR:rows}
    let headers = {
      "Content-Type": 'application/json',
      "Authorization": "key=AAAAYPJFEZA:APA91bE24pNjzbtrAX3oVlWSoYtSwya3voapvOiI1sFazvN7iR7anu7J9U_Fn0dWWk0YgUlR2Ci1nzmFMLKh0xzrUFAt5eMh_0waK4anSlv485xMy1YGHeOf9zQwCYdYUmFxxkxV2fGq"
    };
    let url = "https://fcm.googleapis.com/fcm/send";
    console.log("result",rows)
    if(rows.length>0){
      for(var i =0;i<rows.length;i++){
        console.log("rows line:",rows[i])
        // let body = JSON.stringify({
        //   to: rows[i]["DEVICE_TOKEN"],
        //   notification:{
        //     title:"มี Order เข้ามาใหม่",
        //     body:"กดรับ Order เดี๋ยวนี้!"
        //   }
        // });
        // request.post(
        //   {
        //     url:
        //       "https://fcm.googleapis.com/fcm/send",
        //     headers: headers,
        //     body: body
        //   },
        //   (err, res, body) => {
        //     console.log(JSON.stringify(res));
        //   }
        // )
        let body = {
          to: rows[i]["DEVICE_TOKEN"],
          notification:{
            title:"มี Order เข้ามาใหม่",
            body:"กดรับ Order เดี๋ยวนี้!"
          }
        };
        axios.post(url,body, {headers})
        .then(function(response) {
          console.log(response.data);
          console.log(response.data.results);
          // hookRes = 1;
          // res.status(200).send({
          //   STATUS: response.data.STATUS,
          //   RESULT: response.data.RESULT
          // });
          // websocket.sockets.emit("Recieve Token Qr", {
          //   STATUS: response.data.STATUS,
          //   RESULT: response.data.RESULT
          // });
        })
        .catch(function(error) {
          console.log(error);
          hookRes = 0;
        });
      }
    }
    res.status(200).send({ STATUS: 1, RESULT: arrToken });
  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
