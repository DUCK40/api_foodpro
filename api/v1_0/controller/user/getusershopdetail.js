//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(SHOP_CODE, res) {
  const ip = globalIP;
  main(SHOP_CODE, res, ip);
};

//Section Method
async function main(SHOP_CODE, res, ip) {
  try {
    shop = [];
    shopArr = [];
    q = `SELECT *
        from(
          SELECT
            "M_GOODS"."SHOP_CODE"
            ,"M_SHOP"."SHOP_NAME_TH"
  ,"M_GOODS"."GOODS_CODE"
            ,"M_GOODS"."GOODS_NAME_TH"
            ,"G_CATEGORY"."CATE_CODE"
            ,"G_CATEGORY"."CATE_NAME_TH"
            , "G_SUBCATEGORY"."SUB_CATE_CODE"
            , "G_SUBCATEGORY"."SUB_CATE_NAME_TH"
            , "G_TYPECATEGORY"."TYPE_CATE_CODE"
            , "G_TYPECATEGORY"."TYPE_CATE_NAME_TH"
            ,"M_GOODS"."IS_STOCK"
  ,"M_GOODS"."SHARE_LINK"
            ,(SELECT "T_GOODS_IMG"."IMG_PATH" FROM "T_GOODS_IMG" WHERE "T_GOODS_IMG"."SHOP_CODE"="M_GOODS"."SHOP_CODE" 
            and "T_GOODS_IMG"."CATE_CODE" = "G_CATEGORY"."CATE_CODE" 
            and "T_GOODS_IMG"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" 
            and "T_GOODS_IMG"."TYPE_CATE_CODE" =  "G_TYPECATEGORY"."TYPE_CATE_CODE" limit 1) 
            ,"M_GOODS"."PRICE"
            ,"G_UNIT"."UNIT_NAME_TH"
            ,TO_CHAR("M_GOODS"."LASTUPDATE_AT", 'dd/MM/YYYY') as LASTUPDATE_AT  
            FROM "M_GOODS" 
            INNER JOIN "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE" 
            INNER JOIN "M_SHOP" on "M_SHOP"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE" 
            INNER JOIN "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
            INNER JOIN "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
            INNER JOIn "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
            and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
            WHERE  "M_GOODS"."SHOP_CODE" =$1) as s
                order by s."CATE_CODE" asc,s."SUB_CATE_CODE" asc,s."TYPE_CATE_CODE" asc,s."PRICE" asc`;
    var { rows } = await queryFunc.queryRow(q, [SHOP_CODE]);
    rows.map((data, index) => {
      shopImg = ip + "/api/img/uploads/" + data["IMG_PATH"];
      if (data["IS_STOCK"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }

      shopArr.push({
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME: data["SHOP_NAME_TH"],
        GOODS_NAME_TH: data["GOODS_NAME_TH"],
        CATE_CODE: data["CATE_CODE"],
        CATE_NAME: data["CATE_NAME_TH"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        SUB_CATE_NAME: data["SUB_CATE_NAME_TH"],
        TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
        TYPE_CATE_NAME_TH: data["TYPE_CATE_NAME_TH"],
        GOODS_IMG: shopImg,
        PRICE: data["PRICE"],
        LINK: data["SHARE_LINK"],
        LASTUPDATE: data["lastupdate_at"],
        IS_STOCK: me_fov,
        UNIT_NAME_TH: data["UNIT_NAME_TH"]
      });
    });

    q = `SELECT MS."SHOP_CODE"
        ,MS."SHOP_NAME_TH"
        ,TO_CHAR(MS."SHOP_CREATE_AT", 'dd/MM/YYYY') as SHOP_CREATE_AT
        ,MS."SHOP_ADDRESS_NO"
        ,MS."DISTRICT_CODE"
        ,GD."DISTRICT_NAME_TH"
        ,MS."PROVINCE_CODE"
        ,GP."PROVINCE_NAME_TH"
        ,GD."POSTCODE"
        ,MS."SHOP_UID"
        ,MS."SHOP_TAX"
        ,MS."SHOP_IMG_PATH_PROFILE"
        ,MS."MARKET_CODE"
        ,GM."MARKET_NAME_TH"
        ,TO_CHAR(MS."SHOP_VERIFY_AT", 'dd/MM/YYYY') as SHOP_VERIFY_AT
        ,MS."SHOP_EMAIL"
        ,MS."SHOP_PHONE"
        FROM "M_SHOP" as MS
        INNER JOIN "G_DISTRICT" as GD on MS."DISTRICT_CODE" = GD."DISTRICT_CODE" and MS."PROVINCE_CODE" = GD."PROVINCE_CODE"
        INNER JOIN "G_PROVINCE" as GP on MS."PROVINCE_CODE"	= GP."PROVINCE_CODE"
        INNER JOIN "G_MARKET" as GM on MS."MARKET_CODE" = GM."MARKET_CODE"
        WHERE MS."SHOP_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [SHOP_CODE]);
    if (rows.length > 0) {
      data = rows[0];
      shopImg = ip + "/api/img/shop/" + data["SHOP_IMG_PATH_PROFILE"];
      shop.push({
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME_TH: data["SHOP_NAME_TH"],
        shop_create_at: data["shop_create_at"],
        SHOP_ADDRESS_NO: data["SHOP_ADDRESS_NO"],
        DISTRICT_CODE: data["DISTRICT_CODE"],
        DISTRICT_NAME_TH: data["DISTRICT_NAME_TH"],
        PROVINCE_CODE: data["PROVINCE_CODE"],
        PROVINCE_NAME_TH: data["PROVINCE_NAME_TH"],
        POSTCODE: data["POSTCODE"],
        SHOP_UID: data["SHOP_UID"],
        SHOP_TAX: data["SHOP_TAX"],
        SHOP_IMG_PATH_PROFILE: shopImg,
        MARKET_CODE: data["MARKET_CODE"],
        MARKET_NAME_TH: data["MARKET_NAME_TH"],
        shop_verify_at: data["shop_verify_at"],
        SHOP_EMAIL: data["SHOP_EMAIL"],
        SHOP_PHONE: data["SHOP_PHONE"],
        SHOPITEMDETAIL: shopArr
      });
      res.status(200).json({ STATUS: 1, RESULT: shop });
    } else {
      res.status(200).json({ STATUS: 3, RESULT: [] });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
