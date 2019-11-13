//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(
  shop_code,
  cate_code,
  sub_cate_code,
  type_cate_code,
  memid,
  res
) {
  const ip = globalIP;
  var IS_DEMAND = 0.1;
  getDetail(
    shop_code,
    cate_code,
    sub_cate_code,
    type_cate_code,
    memid,
    res,
    ip
  );
};

//Section Method
async function getDetail(
  shop_code,
  cate_code,
  sub_cate_code,
  type_cate_code,
  memid,
  res,
  ip
) {
  try {
    const arrPrice = [];
    const shopArr = [];
    const groupArr = [];
    const sendArr = [];
    q = `SELECT
                "M_SHOP"."SHOP_CODE"
                ,"M_SHOP"."SHOP_NAME_TH"
                ,"M_SHOP"."SHOP_ADDRESS_NO"
                ,"G_DISTRICT"."DISTRICT_NAME_TH"
                ,"G_DISTRICT"."IS_DEMAND"
                ,"G_PROVINCE"."PROVINCE_NAME_TH"
                ,"G_DISTRICT"."POSTCODE"
                ,"M_SHOP"."SHOP_IMG_PATH_PROFILE"
                ,"G_MARKET"."MARKET_CODE"
                ,"G_MARKET"."MARKET_NAME_TH"
                ,(SELECT count(*) FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE" = "M_SHOP"."SHOP_CODE") as TOTAL
                ,(SELECT count(*) FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE" = "M_SHOP"."SHOP_CODE" and "T_SHOP_FOV"."MEM_CODE" = $1) as TOTALA
        FROM "M_SHOP"
        INNER JOIN "G_DISTRICT" on "M_SHOP"."DISTRICT_CODE" = "G_DISTRICT"."DISTRICT_CODE" and "M_SHOP"."PROVINCE_CODE" = "G_DISTRICT"."PROVINCE_CODE"
        INNER JOIN "G_PROVINCE" on "M_SHOP"."PROVINCE_CODE" = "G_PROVINCE"."PROVINCE_CODE"
        LEFT JOIN "G_MARKET" on "M_SHOP"."MARKET_CODE" = "G_MARKET"."MARKET_CODE"
        WHERE "M_SHOP"."SHOP_CODE" = $2`;
    var { rows } = await queryFunc.queryRow(q, [memid, shop_code]);
    rows.map((data, index) => {
      shopImg = ip + "/api/img/shop/" + data["SHOP_IMG_PATH_PROFILE"];
      if (data["totala"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }
      shopArr.push({
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME: data["SHOP_NAME_TH"],
        SH0P_ADDRESS: data["SHOP_ADDRESS_NO"],
        DISTRICT: data["DISTRICT_NAME_TH"],
        PROVINCE: data["PROVINCE_NAME_TH"],
        ZIPCODE: data["POSTCODE"],
        SHOP_IMG: shopImg,
        MARKET_CODE: data["MARKET_CODE"],
        MARKET_NAME: data["MARKET_NAME_TH"],
        SHOP_FOV: data["total"],
        IS_DEMAND: data["IS_DEMAND"],
        ME_FOV: me_fov
      });
    });
    q = `SELECT 
        distinct
                "SM_CODE"
                ,"SM_NAME_TH"
                ,"DP_NAME_TH"
                ,"SM_DESC_TH"
                ,"IS_DEMAND"
                ,"D_IMG_PATH"
                ,"M_GOODS"."SEND_CODE"
                ,"IS_EXPRESS"
                FROM "M_GOODS" 
                inner join "M_DELIVERY_CHOICE" on "M_GOODS"."SEND_CODE" = "M_DELIVERY_CHOICE"."SEND_CODE" 
                inner join "M_DELIVERY_PROVIDER" on "M_DELIVERY_CHOICE"."DP_CODE" = "M_DELIVERY_PROVIDER"."DP_CODE"
                inner join "T_DELIVERY_IMG" on "T_DELIVERY_IMG"."D_IMG_CODE" = "M_DELIVERY_CHOICE"."D_IMG_CODE"
                WHERE "M_GOODS"."SHOP_CODE" = $1 and "M_GOODS"."CATE_CODE"= $2 and "M_GOODS"."SUB_CATE_CODE" = $3
                order by "SM_CODE"`;
    var { rows } = await queryFunc.queryRow(q, [
      shop_code,
      cate_code,
      sub_cate_code
    ]);
    rows.map((data, index) => {
      devImg = ip + "/api/img/shop/" + data["D_IMG_PATH"];
      if (data["IS_EXPRESS"] == 1) {
        if (data["IS_DEMAND"] == 1) {
          // $price = 120;
          if (data["SEND_CODE"] == "S02") {
            $price = 180;
          } else if (data["SEND_CODE"] == "S03") {
            $price = 240;
          } else {
            $price = 120;
          }
        } else {
          if (data["SEND_CODE"] == "S02") {
            $price = 80;
          } else if (data["SEND_CODE"] == "S03") {
            $price = 100;
          } else {
            $price = 60;
          }
        }
      } else {
        $price = 30;
      }
      sendArr.push({
        SM_CODE: data["SM_CODE"],
        SM_NAME_TH: data["SM_NAME_TH"],
        DP_NAME_TH: data["DP_NAME_TH"],
        SM_DESC_TH: data["SM_DESC_TH"],
        IS_DEMAND: data["IS_DEMAND"],
        IMG_PATH: devImg,
        PRICE: $price,
        IS_ACTIVE: false
      });
    });
    q = `SELECT distinct
            "M_GOODS"."GOODS_CODE"
            ,"G_UNIT"."UNIT_NAME_TH"
            ,"M_GOODS"."PRICE"
            ,"T_SHOP_DISCOUNT"."DISCOUNT_TYPE"
            ,"T_SHOP_DISCOUNT"."DISCOUNT_VALUE"
            FROM "M_GOODS"
            INNER JOIN "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE" 
            left join "T_SHOP_DISCOUNT" on "T_SHOP_DISCOUNT"."SHOP_CODE" = "M_GOODS"."SHOP_CODE" 
            and "T_SHOP_DISCOUNT"."CATE_CODE"= "M_GOODS"."CATE_CODE" 
            and "T_SHOP_DISCOUNT"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE"
            and "T_SHOP_DISCOUNT"."IS_ACTIVE" = 1
        WHERE "M_GOODS"."SHOP_CODE" = $1 and "M_GOODS"."CATE_CODE"= $2 and "M_GOODS"."SUB_CATE_CODE" = $3 and "M_GOODS"."TYPE_CATE_CODE" =$4 and "M_GOODS"."IS_STOCK" = 1
         order by "M_GOODS"."PRICE" asc`;
    var { rows } = await queryFunc.queryRow(q, [
      shop_code,
      cate_code,
      sub_cate_code,
      type_cate_code
    ]);
    rows.map((data, index) => {
      if (data["DISCOUNT_TYPE"] == 1) {
        disct = "PERCENT";
        distl = data["DISCOUNT_VALUE"].toString() + " %";
        distv =
          parseFloat(data["PRICE"]) -
          (parseFloat(data["PRICE"]) * parseFloat(data["DISCOUNT_VALUE"])) /
            100;
      } else if (data["DISCOUNT_TYPE"] == 2) {
        disct = "BATH";
        distl = data["DISCOUNT_VALUE"].toString() + " บาท";
        distv = parseFloat(data["PRICE"]) - parseFloat(data["DISCOUNT_VALUE"]);
      } else {
        disct = "0";
        distl = "0";
        distv = 0;
      }
      arrPrice.push({
        GOODS_CODE: data["GOODS_CODE"],
        UNIT_NAME: data["UNIT_NAME_TH"],
        PRICE: data["PRICE"],
        ACTIVE: false,
        DEFAULT: 1,
        DISCOUNT_LABEL: distl,
        DISCOUNT_MODE: disct,
        DISCOUNT_VAL: distv
      });
    });
    q = `SELECT
                distinct
                "M_GOODS"."GOODS_NAME_TH"
                ,"M_GOODS"."SHOP_CODE"
                ,"G_CATEGORY"."CATE_CODE"
                ,"G_CATEGORY"."CATE_NAME_TH"
                ,"G_SUBCATEGORY"."SUB_CATE_CODE"
                ,"G_SUBCATEGORY"."SUB_CATE_NAME_TH"
                ,"G_TYPECATEGORY"."TYPE_CATE_CODE"
                , "G_TYPECATEGORY"."TYPE_CATE_NAME_TH"
                ,"T_GOODS_DESC"."GOODS_DESC_TH"
                ,"G_SEND"."SEND_CODE"
                ,"G_SEND"."SEND_NAME_TH"
                ,"G_SEND"."SEND_RANGE"
                ,"G_SEND"."SEND_IMG_PATH"
                ,(select
                    string_agg("IMG_PATH", ',')
                    from

                    (select "IMG_PATH"
                    from "T_GOODS_IMG"
                    WHERE "T_GOODS_IMG"."CATE_CODE" ="M_GOODS"."CATE_CODE"
                        and "T_GOODS_IMG"."SUB_CATE_CODE" ="M_GOODS"."SUB_CATE_CODE"
                        and "T_GOODS_IMG"."TYPE_CATE_CODE" ="M_GOODS"."TYPE_CATE_CODE"
                        and  "T_GOODS_IMG"."SHOP_CODE" ="M_GOODS"."SHOP_CODE"
                    GROUP BY "T_GOODS_IMG"."SHOP_CODE" ,"T_GOODS_IMG"."CATE_CODE","T_GOODS_IMG"."SUB_CATE_CODE","T_GOODS_IMG"."TYPE_CATE_CODE","T_GOODS_IMG"."IMG_PATH") as S ) AS IMG_PATH
        FROM "M_GOODS"
        inner join "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
        inner join "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
        inner join "G_SEND" on "M_GOODS"."SEND_CODE" = "G_SEND"."SEND_CODE"
        INNER JOIn "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
				and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
        left join "T_GOODS_DESC" on "M_GOODS"."CATE_CODE" = "T_GOODS_DESC"."CATE_CODE" and "M_GOODS"."SUB_CATE_CODE"= "T_GOODS_DESC"."SUB_CATE_CODE" and "M_GOODS"."SHOP_CODE" = "T_GOODS_DESC"."SHOP_CODE" and "T_GOODS_DESC"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"

        WHERE "M_GOODS"."SHOP_CODE" = $1 and "M_GOODS"."CATE_CODE"= $2 and "M_GOODS"."SUB_CATE_CODE" = $3 and "M_GOODS"."TYPE_CATE_CODE" =$4 `;
    const arrImg = [];
    const goodsArr = [];
    var { rows } = await queryFunc.queryRow(q, [
      shop_code,
      cate_code,
      sub_cate_code,
      type_cate_code
    ]);
    const strArrGoodsImg = rows[0]["img_path"];
    const splitArrGoodsImg = strArrGoodsImg.split(",");
    splitArrGoodsImg.map((data, index) => {
      img1 = ip + "/api/img/" + "uploads" + "/" + data;
      arrImg.push(img1);
    });
    const sendBox = ip + "/api/img/BOX/" + rows[0]["SEND_IMG_PATH"];
    const sendName = rows[0]["SEND_NAME_TH"];
    goodsArr.push({
      GOODS_NAME: rows[0]["GOODS_NAME_TH"],
      CATE_CODE: rows[0]["CATE_CODE"],
      CATE_NAME: rows[0]["CATE_NAME_TH"],
      SUB_CATE_CODE: rows[0]["SUB_CATE_CODE"],
      SUB_CATE_NAME: rows[0]["SUB_CATE_NAME_TH"],
      TYPE_CATE_CODE: rows[0]["TYPE_CATE_CODE"],
      TYPE_CATE_NAME_TH: rows[0]["TYPE_CATE_NAME_TH"],
      GOODS_DESC: rows[0]["GOODS_DESC_TH"],
      SEND_CODE: rows[0]["SEND_CODE"],
      SEND_NAME: sendName,
      SEND_IMG: sendBox,
      GOODS_IMG: arrImg,
      COMBO_ITEM: arrPrice,
      DELIVERY_COMBO: sendArr
    });
    groupArr.push({ SHOP_DETAIL: shopArr, GOODS_DETAIL: goodsArr });
    res.status(200).json({ STATUS: 1, RESULT: groupArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
