//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(market_code, memid, res) {
  const ip = globalIP;
  getDetail(market_code, memid, res, ip);
};

//Section Method
async function getDetail(market_code, memid, res, ip) {
  try {
    const shopArr = [];
    q = `SELECT "SHOP_CODE"
        ,"SHOP_NAME_TH"
        ,MS."MARKET_CODE"
        ,"MARKET_NAME_TH"
        ,"SHOP_IMG_PATH_PROFILE"
        ,"SHARE_LINK"
        ,(SELECT COUNT(*) AS TOTAL FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE"  = MS."SHOP_CODE" 
                        and "T_SHOP_FOV"."MEM_CODE" = $1)
        FROM "M_SHOP" as MS
        INNER JOIN "G_MARKET" as GM on MS."MARKET_CODE" = GM."MARKET_CODE" and GM."MARKET_CODE" = $2
        ORDER BY "SHOP_CREATE_AT" desc
        `;
    var { rows } = await queryFunc.queryRow(q, [memid,market_code]);
    if (rows.length > 0) {
      // try{
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
          SHOP_IMG: shopImg,
          LINK: data["SHARE_LINK"],
          ME_FOV: me_fov
        });
      });

      if (shopArr.length > 0) {
        let newArr = [];
        let shopArr2 = [];
        for (let i = 0; i < shopArr.length; i++) {
          try {
            let SHOP_CODE = shopArr[i]["SHOP_CODE"];
            q1 = `SELECT * FROM (SELECT 
                    DISTINCT
                        "M_GOODS"."SHOP_CODE"
                        ,"M_SHOP"."SHOP_NAME_TH"
                        ,"M_GOODS"."GOODS_NAME_TH"
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
                        ,(SELECT COUNT(*) AS TOTAL FROM "T_MEMBER_GOODS_FOV" WHERE "T_MEMBER_GOODS_FOV"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE"  
                            and "M_GOODS"."SUB_CATE_CODE" = "T_MEMBER_GOODS_FOV"."SUB_CATE_CODE" 
                            and "M_GOODS"."CATE_CODE"= "T_MEMBER_GOODS_FOV"."CATE_CODE"
                            and "M_GOODS"."TYPE_CATE_CODE"= "T_MEMBER_GOODS_FOV"."TYPE_CATE_CODE" 
                            and "T_MEMBER_GOODS_FOV"."MEM_CODE" = $1)
                            FROM "M_GOODS" 
                            INNER JOIN "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE" 
                            INNER JOIN "M_SHOP" on "M_SHOP"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE" 
                            INNER JOIN "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
                            INNER JOIN "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
                            INNER JOIn "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
                            and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
                            where "M_GOODS"."SHOP_CODE" =$2) AS s limit 4`;
            var { rows } = await queryFunc.queryRow(q1, [memid, SHOP_CODE]);
            rows.map((data, index) => {
              shopImg = ip + "/api/img/uploads/" + data["IMG_PATH"];
              if (data["total"] == 1) {
                me_fov = true;
              } else {
                me_fov = false;
              }

              shopArr2.push({
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
                ME_FOV: me_fov
              });
            });
            if (shopArr2.length > 0) {
              newArr.push({
                MARKET_CODE: shopArr[i]["MARKET_CODE"],
                SHOP_CODE: shopArr[i]["SHOP_CODE"],
                SHOP_NAME: shopArr[i]["SHOP_NAME"],
                MARKET_NAME: shopArr[i]["MARKET_NAME"],
                SHOP_IMG: shopArr[i]["SHOP_IMG"],
                LINK: shopArr[i]["LINK"],
                ME_FOV: shopArr[i]["ME_FOV"],
                DATA: shopArr2
              });
            }

            shopArr2 = [];
          } catch (err) {
            logger.error("Database:::::::" + err);
            res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
          }
        }
        res.status(200).json({ STATUS: 1, RESULT: newArr });
      } else {
        let nArr = [];
        res.status(200).json({ STATUS: 3, RESULT: nArr });
      }
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

