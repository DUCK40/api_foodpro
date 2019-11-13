//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(txt, MEM_CODE, res) {
  const ip = globalIP;
  getDetail(txt, MEM_CODE, res, ip);
};

//Section Method
async function getDetail(txt, MEM_CODE, res, ip) {
  try {
    // Section Method of Function
    txt = txt.toUpperCase()
    const shopArr = [];
    // const groupArr=[];
    const itemArr = [];
    q = `SELECT ss.*
        FROM
        (SELECT "SHOP_CODE"
                ,"SHOP_NAME_TH"
                ,MS."MARKET_CODE"
                ,"MARKET_NAME_TH"
                ,"SHOP_IMG_PATH_PROFILE"
                 ,"SHOP_CREATE_AT"
                 ,GD."DISTRICT_NAME_TH"
                 ,GP."PROVINCE_NAME_TH"
                 ,GD."POSTCODE"
                ,"SHARE_LINK"
                ,(SELECT count(*) as TOTALA FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE" = MS."SHOP_CODE")
                ,(SELECT COUNT(*) AS TOTAL FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE"  = MS."SHOP_CODE"
                                and "T_SHOP_FOV"."MEM_CODE" = $1)
                FROM "M_SHOP" as MS
                INNER JOIN "G_MARKET" as GM on MS."MARKET_CODE" = GM."MARKET_CODE"
                INNER JOIN "G_DISTRICT" as GD on GD."DISTRICT_CODE" = MS."DISTRICT_CODE" and GD."PROVINCE_CODE" = MS."PROVINCE_CODE"
                INNER JOIN "G_PROVINCE" as GP on  GP."PROVINCE_CODE" = MS."PROVINCE_CODE"
                WHERE MS."SHOP_STATUS" =2 and upper(MS."SHOP_NAME_TH") like $2) as ss
                ORDER BY "totala" desc , ss."SHOP_CREATE_AT" desc limit 4`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE, "%" + txt + "%"]);
    rows.map((data, index) => {
      shopImg = ip + "/api/img/shop/" + data["SHOP_IMG_PATH_PROFILE"];
      if (data["total"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }
      shopArr.push({
        MARKET_CODE: data["MARKET_CODE"],
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME: data["SHOP_NAME_TH"],
        MARKET_NAME: data["MARKET_NAME_TH"],
        DISTRICT_NAME_TH: data["DISTRICT_NAME_TH"],
        PROVINCE_NAME_TH: data["PROVINCE_NAME_TH"],
        POSTCODE: data["POSTCODE"],
        SHOP_IMG: shopImg,
        LINK: data["SHARE_LINK"],
        ME_FOV: me_fov
      });
    });
    q = `SELECT
        DISTINCT
            "M_GOODS"."SHOP_CODE"
            ,"M_SHOP"."SHOP_NAME_TH"
            ,"M_GOODS"."GOODS_NAME_TH"
            ,"M_GOODS"."GOODS_NAME_EN"
            ,"G_CATEGORY"."CATE_CODE"
            ,"G_CATEGORY"."CATE_NAME_TH"
            , "G_SUBCATEGORY"."SUB_CATE_CODE"
            , "G_SUBCATEGORY"."SUB_CATE_NAME_TH"
            , "G_TYPECATEGORY"."TYPE_CATE_CODE"
			, "G_TYPECATEGORY"."TYPE_CATE_NAME_TH"
            ,(SELECT M2."SHARE_LINK" FROM "M_GOODS" AS  M2
			  WHERE "M_GOODS"."SUB_CATE_CODE" = M2."SUB_CATE_CODE"
			  and "M_GOODS"."CATE_CODE"= M2."CATE_CODE"
			  and "M_GOODS"."TYPE_CATE_CODE"= M2."TYPE_CATE_CODE"
			  and M2."SHOP_CODE" = "M_GOODS"."SHOP_CODE"
			  order by M2."PRICE" ASC limit 1)
            ,(SELECT "T_GOODS_IMG"."IMG_PATH" FROM "T_GOODS_IMG" WHERE "T_GOODS_IMG"."SHOP_CODE"="M_GOODS"."SHOP_CODE"
			  and "T_GOODS_IMG"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
			  and "T_GOODS_IMG"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE"
			  and "T_GOODS_IMG"."TYPE_CATE_CODE" =  "G_TYPECATEGORY"."TYPE_CATE_CODE" limit 1)
            ,(SELECT M2."PRICE" FROM "M_GOODS" AS  M2
			  WHERE "M_GOODS"."SUB_CATE_CODE" = M2."SUB_CATE_CODE"
			  and "M_GOODS"."CATE_CODE"= M2."CATE_CODE"
			  and "M_GOODS"."TYPE_CATE_CODE"= M2."TYPE_CATE_CODE"
			  and M2."SHOP_CODE" = "M_GOODS"."SHOP_CODE"
			  order by M2."PRICE" ASC limit 1)
            ,(SELECT U."UNIT_NAME_TH" FROM "M_GOODS" AS  M2 INNER JOIN "G_UNIT" AS U on M2."UNIT_CODE" = U."UNIT_CODE"
			  WHERE "M_GOODS"."SUB_CATE_CODE" = M2."SUB_CATE_CODE"
			  and "M_GOODS"."CATE_CODE"= M2."CATE_CODE"
			  and "M_GOODS"."TYPE_CATE_CODE"= M2."TYPE_CATE_CODE"
			  and M2."SHOP_CODE" = "M_GOODS"."SHOP_CODE"  order by M2."PRICE" ASC limit 1)
            ,"T_SHOP_DISCOUNT"."DISCOUNT_TYPE"
            ,"T_SHOP_DISCOUNT"."DISCOUNT_VALUE"
            ,(SELECT COUNT(*) AS TOTAL FROM "T_MEMBER_GOODS_FOV" WHERE "T_MEMBER_GOODS_FOV"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE"
                and "M_GOODS"."SUB_CATE_CODE" = "T_MEMBER_GOODS_FOV"."SUB_CATE_CODE"
                and "M_GOODS"."CATE_CODE"= "T_MEMBER_GOODS_FOV"."CATE_CODE"
                and "M_GOODS"."TYPE_CATE_CODE"= "T_MEMBER_GOODS_FOV"."TYPE_CATE_CODE"
                and "T_MEMBER_GOODS_FOV"."MEM_CODE" = $1)
                FROM "M_GOODS"
                INNER JOIN "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE"
                INNER JOIN "M_SHOP" on "M_SHOP"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE" and "M_SHOP"."SHOP_STATUS" =2
                INNER JOIN "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
                INNER JOIN "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
                INNER JOIn "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE"
				and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
                left JOIN "T_SHOP_DISCOUNT" on "T_SHOP_DISCOUNT"."SHOP_CODE" = "M_GOODS"."SHOP_CODE"
                and "T_SHOP_DISCOUNT"."CATE_CODE"= "M_GOODS"."CATE_CODE"
                and "T_SHOP_DISCOUNT"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE"
                and "T_SHOP_DISCOUNT"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
                and "T_SHOP_DISCOUNT"."IS_ACTIVE" = 1
                WHERE "M_GOODS"."IS_STOCK" = 1 and upper("M_GOODS"."GOODS_NAME_TH") like  $2
                order by "T_SHOP_DISCOUNT"."DISCOUNT_VALUE" desc limit 10`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE, "%" + txt + "%"]);
    rows.map((data, index) => {
      shopImg = ip + "/api/img/uploads/" + data["IMG_PATH"];
      if (data["total"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }

      if (data["DISCOUNT_TYPE"] == 1) {
        disct = "PERCENT";
        distl = data["DISCOUNT_VALUE"].toString() + " %";
        distv =
          parseFloat(data["PRICE"]) -
          (parseFloat(data["PRICE"]) * parseInt(data["DISCOUNT_VALUE"])) / 100;
      } else if (data["DISCOUNT_TYPE"] == 2) {
        disct = "BATH";
        distl = data["DISCOUNT_VALUE"].toString() + " บาท";
        distv = parseFloat(data["PRICE"]) - parseFloat(data["DISCOUNT_VALUE"]);
      } else {
        disct = "0";
        distl = "0";
        distv = 0;
      }
      itemArr.push({
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME: data["SHOP_NAME_TH"],
        GOODS_NAME_TH: data["GOODS_NAME_TH"],
        GOODS_NAME_EN: data["GOODS_NAME_EN"],
        CATE_CODE: data["CATE_CODE"],
        CATE_NAME: data["CATE_NAME_TH"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        SUB_CATE_NAME: data["SUB_CATE_NAME_TH"],
        TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
        TYPE_CATE_NAME_TH: data["TYPE_CATE_NAME_TH"],
        GOODS_IMG: shopImg,
        PRICE: data["PRICE"],
        LINK: data["SHARE_LINK"],
        DISCOUNT_LABEL: distl,
        DISCOUNT_MODE: disct,
        DISCOUNT_VAL: distv,
        ME_FOV: me_fov
      });
    });

    // Section Response Normal Data
    res.status(200).json({ STATUS: 1, RESULT: {SHOP_ARR: shopArr,ITEMS_ARR: itemArr}});
  } catch (err) {
    // Section Response Exception Data
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
