//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  getCart(req, res, ip);
};

exports.func_put = function(req, res) {
  const ip = globalIP;
  updateData(req, res, ip);
};

//Section Method
async function getCart(req, res, ip) {
  try {
    const arrResult = [];
    q = `SELECT
        "T_SALEORDER_HEADER"."SO_CODE",
        "T_SALEORDER_HEADER"."SO_STATUS",
        to_char("T_SALEORDER_HEADER"."SO_CREATE_AT",'dd/MM/YYYY') as SO_CREATE_AT_DATE,
        to_char("T_SALEORDER_HEADER"."SO_CREATE_AT" at time zone 'Asia/Bangkok','HH24:MI:SS') as SO_CREATE_AT_TIME,
        to_char("T_SALEORDER_HEADER"."SO_CREATE_AT" at time zone 'Asia/Bangkok','dd/MM/YYYY HH24:MI:SS') as SO_CREATE_AT_DATETIME,
        "T_SALEORDER_BILLING_ITEM"."BILL_ITEM_CODE",
        "T_SALEORDER_BILLING_ITEM"."SHOP_CODE",
        "M_SHOP"."SHOP_NAME_TH",
        "M_SHOP"."DC_NAME",
        "M_SHOP"."DC_LOCATION_ID",
        "M_SHOP"."SHOP_IMG_PATH_PROFILE",
        "M_SHOP"."IS_RECEIVE_FROM_HOME",
        "T_SALEORDER_BILLING_ITEM"."GOODS_CODE",
        "M_GOODS"."GOODS_NAME_TH",
        "T_SALEORDER_BILLING_ITEM"."AMOUNT",
        "T_SALEORDER_BILLING_ITEM"."SUM_PRICE",
        "G_UNIT"."UNIT_NAME_TH",
        (SELECT "T_GOODS_IMG"."IMG_PATH" FROM "T_GOODS_IMG" WHERE "T_GOODS_IMG"."SHOP_CODE"="M_GOODS"."SHOP_CODE" 
                  and "T_GOODS_IMG"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "T_GOODS_IMG"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
                  and "T_GOODS_IMG"."TYPE_CATE_CODE" =  "M_GOODS"."TYPE_CATE_CODE" limit 1),
        "T_SALEORDER_BILLING_ITEM"."BILL_ITEM_CODE",
        "T_SALEORDER_BILLING_SEND"."BILL_SEND_CODE",
        "T_SALEORDER_BILLING_SEND"."DELIVERY_HOST",
        "T_SALEORDER_BILLING_SEND"."DELIVERY_DESC",
        "T_SALEORDER_BILLING_SEND"."DELIVERY_TYPE",
        "M_DELIVERY_CHOICE"."SM_NAME_TH",
        "T_SALEORDER_BILLING_SEND"."DELIVERY_COST",
        "T_SALEORDER_PAYMENT"."PAYMENT_TYPE",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_ADDRESS_NO",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_DISTRICT",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_PROVINCE",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_POSTCODE",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_FNAME",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_LNAME",
        "T_SALEORDER_BILLING_SEND"."SHIPTO_PHONE"

        FROM "T_SALEORDER_HEADER"
        INNER JOIN "T_SALEORDER_BILLING_ITEM" ON "T_SALEORDER_BILLING_ITEM"."SO_CODE" = "T_SALEORDER_HEADER"."SO_CODE" 
        AND "T_SALEORDER_BILLING_ITEM"."MEM_CODE" = "T_SALEORDER_HEADER"."MEM_CODE" and "T_SALEORDER_BILLING_ITEM"."BILL_STATUS" = 2
        and "T_SALEORDER_BILLING_ITEM"."SHOP_CODE"  = $1
        INNER JOIN "M_GOODS" ON "M_GOODS"."GOODS_CODE" = "T_SALEORDER_BILLING_ITEM"."GOODS_CODE"
        INNER JOIN "G_UNIT" ON "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE"
        INNER JOIN "M_SHOP" ON "M_SHOP"."SHOP_CODE" = "T_SALEORDER_BILLING_ITEM"."SHOP_CODE"
        INNER JOIN "T_SALEORDER_BILLING_SEND" ON "T_SALEORDER_BILLING_SEND"."SO_CODE" = "T_SALEORDER_HEADER"."SO_CODE" 
        AND "T_SALEORDER_BILLING_SEND"."MEM_CODE" = "T_SALEORDER_HEADER"."MEM_CODE" 
        AND "T_SALEORDER_BILLING_SEND"."BILL_SEND_CODE" = "T_SALEORDER_BILLING_ITEM"."BILL_SEND_CODE"
        AND "T_SALEORDER_BILLING_SEND"."DELIVERY_END_STATUS" = 1
        inner join "M_DELIVERY_CHOICE" on "T_SALEORDER_BILLING_SEND"."DELIVERY_TYPE" = "M_DELIVERY_CHOICE"."SEND_CODE" 
        and "T_SALEORDER_BILLING_SEND"."DELIVERY_DESC" = "M_DELIVERY_CHOICE"."SM_CODE" 
        INNER JOIN "T_SALEORDER_PAYMENT" on "T_SALEORDER_PAYMENT"."SO_CODE" = "T_SALEORDER_HEADER"."SO_CODE" 
        and  "T_SALEORDER_PAYMENT"."PAYMENT_STATUS" = 2

        WHERE "T_SALEORDER_HEADER"."SO_STATUS" <> 0
        order by "T_SALEORDER_HEADER"."SO_CREATE_AT" asc`;

    var { rows } = await queryFunc.queryRow(q, [req]);
    rows.map((data, index) => {
      SHOP_IMG_PATH_PROFILE =
        ip + "/api/img/" + "shop" + "/" + data["SHOP_IMG_PATH_PROFILE"];
      IMG_PATH = ip + "/api/img/" + "uploads" + "/" + data["IMG_PATH"];

      arrResult.push({
        SO_CODE: data["SO_CODE"],
        SO_STATUS: data["SO_STATUS"],
        SO_CREATE_AT_DATE: data["so_create_at_date"],
        SO_CREATE_AT_TIME: data["so_create_at_time"],
        SO_CREATE_AT_DATETIME: data["so_create_at_datetime"],
        BILL_ITEM_CODE: data["BILL_ITEM_CODE"],
        SHOP_CODE: data["SHOP_CODE"],
        DC_NAME: data["DC_NAME"],
        DC_LOCATION_ID: data["DC_LOCATION_ID"],
        SHOP_NAME_TH: data["SHOP_NAME_TH"],
        SHOP_IMG_PATH_PROFILE: SHOP_IMG_PATH_PROFILE,
        GOODS_CODE: data["GOODS_CODE"],
        GOODS_NAME_TH: data["GOODS_NAME_TH"],
        AMOUNT: data["AMOUNT"],
        SUM_PRICE: data["SUM_PRICE"],
        ITEM_IMG_PATH: IMG_PATH,
        UNIT_NAME_TH: data["UNIT_NAME_TH"],
        BILL_SEND_CODE: data["BILL_SEND_CODE"],
        DELIVERY_HOST: data["DELIVERY_HOST"],
        DELIVERY_DESC: data["DELIVERY_DESC"],
        DELIVERY_TYPE: data["DELIVERY_TYPE"],
        SM_NAME_TH: data["SM_NAME_TH"],
        DELIVERY_COST: data["DELIVERY_COST"],
        PAYMENT_TYPE: data["PAYMENT_TYPE"],
        SHIPTO_ADDRESS_NO: data["SHIPTO_ADDRESS_NO"],
        SHIPTO_DISTRICT: data["SHIPTO_DISTRICT"],
        SHIPTO_PROVINCE: data["SHIPTO_PROVINCE"],
        SHIPTO_POSTCODE: data["SHIPTO_POSTCODE"],
        SHIPTO_FNAME: data["SHIPTO_FNAME"],
        SHIPTO_LNAME: data["SHIPTO_LNAME"],
        SHIPTO_PHONE: data["SHIPTO_PHONE"],
        IS_RECEIVE_FROM_HOME: data["IS_RECEIVE_FROM_HOME"]
      });
    });
    if (arrResult.length > 0) {
      var header = [];
      var detail = [];
      var sum_so_item = 0;
      var sum_so_send = 0;
      var sum_so = 0;
      var obj = [];
      var sum_amount = 0;
      if (arrResult.length == 1) {
        detail.push({
          BILL_ITEM_CODE: arrResult[0]["BILL_ITEM_CODE"],
          SHOP_CODE: arrResult[0]["SHOP_CODE"],
          DC_NAME: arrResult[0]["DC_NAME"],
          DC_LOCATION_ID: arrResult[0]["DC_LOCATION_ID"],
          SHOP_NAME_TH: arrResult[0]["SHOP_NAME_TH"],
          SHOP_IMG_PATH_PROFILE: arrResult[0]["SHOP_IMG_PATH_PROFILE"],
          GOODS_CODE: arrResult[0]["GOODS_CODE"],
          GOODS_NAME_TH: arrResult[0]["GOODS_NAME_TH"],
          AMOUNT: arrResult[0]["AMOUNT"],
          SUM_PRICE: arrResult[0]["SUM_PRICE"],
          ITEM_IMG_PATH: arrResult[0]["ITEM_IMG_PATH"],
          UNIT_NAME_TH: arrResult[0]["UNIT_NAME_TH"],
          BILL_SEND_CODE: arrResult[0]["BILL_SEND_CODE"],
          DELIVERY_HOST: arrResult[0]["DELIVERY_HOST"],
          DELIVERY_DESC: arrResult[0]["DELIVERY_DESC"],
          DELIVERY_TYPE: arrResult[0]["DELIVERY_TYPE"],
          SM_NAME_TH: arrResult[0]["SM_NAME_TH"],
          DELIVERY_COST: arrResult[0]["DELIVERY_COST"]
        });
        sum_so_item =
          parseFloat(sum_so_item) + parseFloat(arrResult[0]["SUM_PRICE"]);
        sum_so_send =
          parseFloat(sum_so_send) + parseFloat(arrResult[0]["DELIVERY_COST"]);
        sum_so = parseFloat(sum_so_send) + parseFloat(sum_so_item);
        sum_amount =
          parseFloat(sum_amount) + parseFloat(arrResult[0]["AMOUNT"]);
        header.push({
          IS_ACTIVE: false,
          SO_CODE: arrResult[0]["SO_CODE"],
          SO_CREATE_AT_DATE: arrResult[0]["SO_CREATE_AT_DATE"],
          PAYMENT_TYPE: arrResult[0]["PAYMENT_TYPE"],
          SO_CREATE_AT_TIME: arrResult[0]["SO_CREATE_AT_TIME"],
          SO_CREATE_AT_DATETIME: arrResult[0]["SO_CREATE_AT_DATETIME"],
          SUM_ITEM: sum_so_item,
          SUM_SEND: sum_so_send,
          SUM_ALL: sum_so,
          SUM_AMOUNT: sum_amount,
          SO_STATUS: arrResult[0]["SO_STATUS"],
          SHIPTO_FNAME: arrResult[0]["SHIPTO_FNAME"],
          SHIPTO_LNAME: arrResult[0]["SHIPTO_LNAME"],
          SHIPTO_PHONE: arrResult[0]["SHIPTO_PHONE"],
          SHIPTO_ADDRESS_NO: arrResult[0]["SHIPTO_ADDRESS_NO"],
          SHIPTO_DISTRICT: arrResult[0]["SHIPTO_DISTRICT"],
          SHIPTO_PROVINCE: arrResult[0]["SHIPTO_PROVINCE"],
          SHIPTO_POSTCODE: arrResult[0]["SHIPTO_POSTCODE"],
          IS_RECEIVE_FROM_HOME: arrResult[0]["IS_RECEIVE_FROM_HOME"],
          DETAIL: detail
        });
      } else {
        for (var i = 0; i < arrResult.length; i++) {
          if (i == 0) {
            detail.push({
              BILL_ITEM_CODE: arrResult[i]["BILL_ITEM_CODE"],
              SHOP_CODE: arrResult[i]["SHOP_CODE"],
              DC_NAME: arrResult[i]["DC_NAME"],
              DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
              SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
              SHOP_IMG_PATH_PROFILE: arrResult[i]["SHOP_IMG_PATH_PROFILE"],
              GOODS_CODE: arrResult[i]["GOODS_CODE"],
              GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
              AMOUNT: arrResult[i]["AMOUNT"],
              SUM_PRICE: arrResult[i]["SUM_PRICE"],
              ITEM_IMG_PATH: arrResult[i]["ITEM_IMG_PATH"],
              UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
              BILL_SEND_CODE: arrResult[i]["BILL_SEND_CODE"],
              DELIVERY_HOST: arrResult[i]["DELIVERY_HOST"],
              DELIVERY_DESC: arrResult[i]["DELIVERY_DESC"],
              DELIVERY_TYPE: arrResult[i]["DELIVERY_TYPE"],
              SM_NAME_TH: arrResult[i]["SM_NAME_TH"],
              DELIVERY_COST: arrResult[i]["DELIVERY_COST"]
            });
            sum_so_item =
              parseFloat(sum_so_item) + parseFloat(arrResult[i]["SUM_PRICE"]);
            sum_so_send =
              parseFloat(sum_so_send) +
              parseFloat(arrResult[i]["DELIVERY_COST"]);
            sum_so = parseFloat(sum_so_send) + parseFloat(sum_so_item);
            sum_amount =
              parseFloat(sum_amount) + parseFloat(arrResult[0]["AMOUNT"]);
          } else if (i == arrResult.length - 1) {
            if (arrResult[i]["SO_CODE"] == arrResult[i - 1]["SO_CODE"]) {
              detail.push({
                BILL_ITEM_CODE: arrResult[i]["BILL_ITEM_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                DC_NAME: arrResult[i]["DC_NAME"],
                DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                SHOP_IMG_PATH_PROFILE: arrResult[i]["SHOP_IMG_PATH_PROFILE"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                AMOUNT: arrResult[i]["AMOUNT"],
                SUM_PRICE: arrResult[i]["SUM_PRICE"],
                ITEM_IMG_PATH: arrResult[i]["ITEM_IMG_PATH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                BILL_SEND_CODE: arrResult[i]["BILL_SEND_CODE"],
                DELIVERY_HOST: arrResult[i]["DELIVERY_HOST"],
                DELIVERY_DESC: arrResult[i]["DELIVERY_DESC"],
                DELIVERY_TYPE: arrResult[i]["DELIVERY_TYPE"],
                SM_NAME_TH: arrResult[i]["SM_NAME_TH"],
                DELIVERY_COST: arrResult[i]["DELIVERY_COST"]
              });
              sum_so_item =
                parseFloat(sum_so_item) + parseFloat(arrResult[i]["SUM_PRICE"]);
              sum_so_send =
                parseFloat(sum_so_send) +
                parseFloat(arrResult[i]["DELIVERY_COST"]);
              sum_so = parseFloat(sum_so_send) + parseFloat(sum_so_item);
              sum_amount =
                parseFloat(sum_amount) + parseFloat(arrResult[0]["AMOUNT"]);
              header.push({
                IS_ACTIVE: false,
                SO_CODE: arrResult[i]["SO_CODE"],
                SO_CREATE_AT_DATE: arrResult[i]["SO_CREATE_AT_DATE"],
                PAYMENT_TYPE: arrResult[i]["PAYMENT_TYPE"],
                SO_CREATE_AT_TIME: arrResult[i]["SO_CREATE_AT_TIME"],
                SO_CREATE_AT_DATETIME: arrResult[i]["SO_CREATE_AT_DATETIME"],
                SUM_ITEM: sum_so_item,
                SUM_SEND: sum_so_send,
                SUM_ALL: sum_so,
                SUM_AMOUNT: sum_amount,
                SO_STATUS: arrResult[i]["SO_STATUS"],
                SHIPTO_FNAME: arrResult[i]["SHIPTO_FNAME"],
                SHIPTO_LNAME: arrResult[i]["SHIPTO_LNAME"],
                SHIPTO_PHONE: arrResult[i]["SHIPTO_PHONE"],
                SHIPTO_ADDRESS_NO: arrResult[i]["SHIPTO_ADDRESS_NO"],
                SHIPTO_DISTRICT: arrResult[i]["SHIPTO_DISTRICT"],
                SHIPTO_PROVINCE: arrResult[i]["SHIPTO_PROVINCE"],
                SHIPTO_POSTCODE: arrResult[i]["SHIPTO_POSTCODE"],
                IS_RECEIVE_FROM_HOME: arrResult[i]["IS_RECEIVE_FROM_HOME"],
                DETAIL: detail
              });
            } else {
              header.push({
                IS_ACTIVE: false,
                SO_CODE: arrResult[i - 1]["SO_CODE"],
                SO_CREATE_AT_DATE: arrResult[i - 1]["SO_CREATE_AT_DATE"],
                PAYMENT_TYPE: arrResult[i - 1]["PAYMENT_TYPE"],
                SO_CREATE_AT_TIME: arrResult[i - 1]["SO_CREATE_AT_TIME"],
                SO_CREATE_AT_DATETIME:
                  arrResult[i - 1]["SO_CREATE_AT_DATETIME"],
                SUM_ITEM: sum_so_item,
                SUM_SEND: sum_so_send,
                SUM_ALL: sum_so,
                SUM_AMOUNT: sum_amount,
                SO_STATUS: arrResult[i - 1]["SO_STATUS"],
                SHIPTO_FNAME: arrResult[i - 1]["SHIPTO_FNAME"],
                SHIPTO_LNAME: arrResult[i - 1]["SHIPTO_LNAME"],
                SHIPTO_PHONE: arrResult[i - 1]["SHIPTO_PHONE"],
                SHIPTO_ADDRESS_NO: arrResult[i - 1]["SHIPTO_ADDRESS_NO"],
                SHIPTO_DISTRICT: arrResult[i - 1]["SHIPTO_DISTRICT"],
                SHIPTO_PROVINCE: arrResult[i - 1]["SHIPTO_PROVINCE"],
                SHIPTO_POSTCODE: arrResult[i - 1]["SHIPTO_POSTCODE"],
                IS_RECEIVE_FROM_HOME: arrResult[i - 1]["IS_RECEIVE_FROM_HOME"],
                DETAIL: detail
              });
              detail = [];
              sum_so_item = 0;
              sum_so_send = 0;
              sum_so = 0;
              sum_amount = 0;
              detail.push({
                BILL_ITEM_CODE: arrResult[i]["BILL_ITEM_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                DC_NAME: arrResult[i]["DC_NAME"],
                DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                SHOP_IMG_PATH_PROFILE: arrResult[i]["SHOP_IMG_PATH_PROFILE"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                AMOUNT: arrResult[i]["AMOUNT"],
                SUM_PRICE: arrResult[i]["SUM_PRICE"],
                ITEM_IMG_PATH: arrResult[i]["ITEM_IMG_PATH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                BILL_SEND_CODE: arrResult[i]["BILL_SEND_CODE"],
                DELIVERY_HOST: arrResult[i]["DELIVERY_HOST"],
                DELIVERY_DESC: arrResult[i]["DELIVERY_DESC"],
                DELIVERY_TYPE: arrResult[i]["DELIVERY_TYPE"],
                SM_NAME_TH: arrResult[i]["SM_NAME_TH"],
                DELIVERY_COST: arrResult[i]["DELIVERY_COST"]
              });
              sum_so_item =
                parseFloat(sum_so_item) + parseFloat(arrResult[i]["SUM_PRICE"]);
              sum_so_send =
                parseFloat(sum_so_send) +
                parseFloat(arrResult[i]["DELIVERY_COST"]);
              sum_so = parseFloat(sum_so_send) + parseFloat(sum_so_item);
              sum_amount =
                parseFloat(sum_amount) + parseFloat(arrResult[0]["AMOUNT"]);
              header.push({
                IS_ACTIVE: false,
                SO_CODE: arrResult[i]["SO_CODE"],
                SO_CREATE_AT_DATE: arrResult[i]["SO_CREATE_AT_DATE"],
                PAYMENT_TYPE: arrResult[i]["PAYMENT_TYPE"],
                SO_CREATE_AT_TIME: arrResult[i]["SO_CREATE_AT_TIME"],
                SO_CREATE_AT_DATETIME: arrResult[i]["SO_CREATE_AT_DATETIME"],
                SUM_ITEM: sum_so_item,
                SUM_SEND: sum_so_send,
                SUM_ALL: sum_so,
                SUM_AMOUNT: sum_amount,
                SO_STATUS: arrResult[i]["SO_STATUS"],
                SHIPTO_FNAME: arrResult[i]["SHIPTO_FNAME"],
                SHIPTO_LNAME: arrResult[i]["SHIPTO_LNAME"],
                SHIPTO_PHONE: arrResult[i]["SHIPTO_PHONE"],
                SHIPTO_ADDRESS_NO: arrResult[i]["SHIPTO_ADDRESS_NO"],
                SHIPTO_DISTRICT: arrResult[i]["SHIPTO_DISTRICT"],
                SHIPTO_PROVINCE: arrResult[i]["SHIPTO_PROVINCE"],
                SHIPTO_POSTCODE: arrResult[i]["SHIPTO_POSTCODE"],
                IS_RECEIVE_FROM_HOME: arrResult[i]["IS_RECEIVE_FROM_HOME"],
                DETAIL: detail
              });
            }
          } else {
            if (arrResult[i]["SO_CODE"] == arrResult[i - 1]["SO_CODE"]) {
              detail.push({
                BILL_ITEM_CODE: arrResult[i]["BILL_ITEM_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                DC_NAME: arrResult[i]["DC_NAME"],
                DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                SHOP_IMG_PATH_PROFILE: arrResult[i]["SHOP_IMG_PATH_PROFILE"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                AMOUNT: arrResult[i]["AMOUNT"],
                SUM_PRICE: arrResult[i]["SUM_PRICE"],
                ITEM_IMG_PATH: arrResult[i]["ITEM_IMG_PATH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                BILL_SEND_CODE: arrResult[i]["BILL_SEND_CODE"],
                DELIVERY_HOST: arrResult[i]["DELIVERY_HOST"],
                DELIVERY_DESC: arrResult[i]["DELIVERY_DESC"],
                DELIVERY_TYPE: arrResult[i]["DELIVERY_TYPE"],
                SM_NAME_TH: arrResult[i]["SM_NAME_TH"],
                DELIVERY_COST: arrResult[i]["DELIVERY_COST"]
              });
              sum_so_item =
                parseFloat(sum_so_item) + parseFloat(arrResult[i]["SUM_PRICE"]);
              sum_so_send =
                parseFloat(sum_so_send) +
                parseFloat(arrResult[i]["DELIVERY_COST"]);
              sum_so = parseFloat(sum_so_send) + parseFloat(sum_so_item);
              sum_amount =
                parseFloat(sum_amount) + parseFloat(arrResult[0]["AMOUNT"]);
            } else {
              header.push({
                IS_ACTIVE: false,
                SO_CODE: arrResult[i - 1]["SO_CODE"],
                SO_CREATE_AT_DATE: arrResult[i - 1]["SO_CREATE_AT_DATE"],
                PAYMENT_TYPE: arrResult[i - 1]["PAYMENT_TYPE"],
                SO_CREATE_AT_TIME: arrResult[i - 1]["SO_CREATE_AT_TIME"],
                SO_CREATE_AT_DATETIME:
                  arrResult[i - 1]["SO_CREATE_AT_DATETIME"],
                SUM_ITEM: sum_so_item,
                SUM_SEND: sum_so_send,
                SUM_ALL: sum_so,
                SUM_AMOUNT: sum_amount,
                SO_STATUS: arrResult[i - 1]["SO_STATUS"],
                SHIPTO_FNAME: arrResult[i - 1]["SHIPTO_FNAME"],
                SHIPTO_LNAME: arrResult[i - 1]["SHIPTO_LNAME"],
                SHIPTO_PHONE: arrResult[i - 1]["SHIPTO_PHONE"],
                SHIPTO_ADDRESS_NO: arrResult[i - 1]["SHIPTO_ADDRESS_NO"],
                SHIPTO_DISTRICT: arrResult[i - 1]["SHIPTO_DISTRICT"],
                SHIPTO_PROVINCE: arrResult[i - 1]["SHIPTO_PROVINCE"],
                SHIPTO_POSTCODE: arrResult[i - 1]["SHIPTO_POSTCODE"],
                IS_RECEIVE_FROM_HOME: arrResult[i - 1]["IS_RECEIVE_FROM_HOME"],
                DETAIL: detail
              });
              detail = [];
              sum_so_item = 0;
              sum_so_send = 0;
              sum_so = 0;
              sum_amount = 0;
              detail.push({
                BILL_ITEM_CODE: arrResult[i]["BILL_ITEM_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                DC_NAME: arrResult[i]["DC_NAME"],
                DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                SHOP_IMG_PATH_PROFILE: arrResult[i]["SHOP_IMG_PATH_PROFILE"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                AMOUNT: arrResult[i]["AMOUNT"],
                SUM_PRICE: arrResult[i]["SUM_PRICE"],
                ITEM_IMG_PATH: arrResult[i]["ITEM_IMG_PATH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                BILL_SEND_CODE: arrResult[i]["BILL_SEND_CODE"],
                DELIVERY_HOST: arrResult[i]["DELIVERY_HOST"],
                DELIVERY_DESC: arrResult[i]["DELIVERY_DESC"],
                DELIVERY_TYPE: arrResult[i]["DELIVERY_TYPE"],
                SM_NAME_TH: arrResult[i]["SM_NAME_TH"],
                DELIVERY_COST: arrResult[i]["DELIVERY_COST"]
              });
              sum_so_item =
                parseFloat(sum_so_item) + parseFloat(arrResult[i]["SUM_PRICE"]);
              sum_so_send =
                parseFloat(sum_so_send) +
                parseFloat(arrResult[i]["DELIVERY_COST"]);
              sum_so = parseFloat(sum_so_send) + parseFloat(sum_so_item);
              sum_amount =
                parseFloat(sum_amount) + parseFloat(arrResult[0]["AMOUNT"]);
            }
          }
        }
      }
      res.status(200).send({ STATUS: 1, RESULT: header });
    } else {
      res.status(200).send({ STATUS: 3, RESULT: arrResult });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function updateData(req, res, ip) {
  try {
    console.log(req);
    qArr = [];
    pArr = [];
    //step จ่ายเงิน bill status 2 > confirm รับ เป็น 3
    //check last order in so_code not in 2 change to 2 from 1
    let SO_CODE = req.SO_CODE;
    let SHOP_CODE = req.SHOP_CODE;
    if (req.length == 3) {
      q = `UPDATE "T_SALEORDER_BILLING_ITEM"
      SET "BILL_STATUS"= 3
      WHERE  "SO_CODE" = $1 and "SHOP_CODE" = $2`;
      qArr.push(q);
      p = [SO_CODE, SHOP_CODE];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
    } else {
      let DATE_TEMP = req.DATE_TEMP;
      let DATE_TEMP_split = DATE_TEMP.split("/");
      let newDATE =
        DATE_TEMP_split[2] +
        "-" +
        DATE_TEMP_split[1] +
        "-" +
        DATE_TEMP_split[0];
      let TIME_TEMP = req.TIME_TEMP;
      q = `UPDATE "T_SALEORDER_BILLING_ITEM"
    SET "BILL_STATUS"= 3 , "PU_DATE_SET" = $1 ,"PU_TIME_SET" = $2
    WHERE  "SO_CODE" = $3 and "SHOP_CODE" = $4`;
      qArr.push(q);
      p = [newDATE, TIME_TEMP, SO_CODE, SHOP_CODE];
      
      pArr.push(p);

      await queryFunc.queryAction(qArr, pArr);
    }
    let MEM_CODE = req.MEM_CODE;
    q = `SELECT count("SO_CODE") as total FROM "T_SALEORDER_BILLING_ITEM" WHERE "SO_CODE" = $1 and "BILL_STATUS" =2`; // String query
    var { rows } = await queryFunc.queryRow(q, [SO_CODE]);
    console.log("dasaaaaa"+rows[0].total);
    if (rows[0].total == 0) {
      qArr = [];
      pArr = [];
      q = `UPDATE public."T_SALEORDER_HEADER" set "SO_STATUS" = 2, "LASTUPDATE_AT" = NOW(), "LASTUPDATE_BY" = $1 WHERE "SO_CODE" = $2 and "MEM_CODE" = $3`;
      qArr.push(q);
      p = [MEM_CODE, SO_CODE, MEM_CODE];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
    }
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
