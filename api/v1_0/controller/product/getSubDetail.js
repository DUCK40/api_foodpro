//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(cate_code, sub_cate_code, mem_code, res) {
  const ip = globalIP;
  getDetail(cate_code, sub_cate_code, mem_code, res, ip);
};

//Section Method
async function getDetail(cate_code, sub_cate_code, mem_code, res, ip) {
  try {
    const shopArr = [];
    const dataArr = [];
    const arrPro = [];
    q = `SELECT
        DISTINCT
            "M_GOODS"."SHOP_CODE"
            ,"M_SHOP"."SHOP_NAME_TH"
            ,"M_GOODS"."GOODS_NAME_TH"
            ,"G_CATEGORY"."CATE_CODE"
            ,"G_CATEGORY"."CATE_NAME_TH"
            , "G_SUBCATEGORY"."SUB_CATE_CODE"
            , "G_SUBCATEGORY"."SUB_CATE_NAME_TH"
			, "G_SUBCATEGORY"."SUB_CATE_IMG_BANNER"
			,"G_MARKET"."MARKET_NAME_TH"
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
            ,(SELECT to_char(M2."LASTUPDATE_AT", 'DD/MM/YYYY') as LASTUPDATE_AT  FROM "M_GOODS" AS  M2 
			  WHERE "M_GOODS"."SUB_CATE_CODE" = M2."SUB_CATE_CODE" 
			  and "M_GOODS"."CATE_CODE"= M2."CATE_CODE" 
			  and M2."SHOP_CODE" = "M_GOODS"."SHOP_CODE" 
			  and "M_GOODS"."TYPE_CATE_CODE"= M2."TYPE_CATE_CODE" 
			  order by M2."PRICE" ASC limit 1)
            ,(SELECT COUNT(*) AS TOTAL FROM "T_MEMBER_GOODS_FOV" WHERE "T_MEMBER_GOODS_FOV"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE"  
                and "M_GOODS"."SUB_CATE_CODE" = "T_MEMBER_GOODS_FOV"."SUB_CATE_CODE" 
                and "M_GOODS"."CATE_CODE"= "T_MEMBER_GOODS_FOV"."CATE_CODE"
			  	and "M_GOODS"."TYPE_CATE_CODE"= "T_MEMBER_GOODS_FOV"."TYPE_CATE_CODE"
                and "T_MEMBER_GOODS_FOV"."MEM_CODE" = $3)
                FROM "M_GOODS" 
                INNER JOIN "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE" 
                INNER JOIN "M_SHOP" on "M_SHOP"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE" and "M_SHOP"."SHOP_STATUS" =2
				INNER JOIN "G_MARKET" on "G_MARKET"."MARKET_CODE" = "M_SHOP"."MARKET_CODE"
                INNER JOIN "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
                INNER JOIN "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
				INNER JOIn "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
				and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
            where "M_GOODS"."CATE_CODE" = $1 and "M_GOODS"."SUB_CATE_CODE" =$2 and "M_GOODS"."IS_STOCK" =1`;
    var { rows } = await queryFunc.queryRow(q, [
      cate_code,
      sub_cate_code,
      mem_code
    ]);
    if (rows.length > 0) {
      rows.map((data, index) => {
        shopImg = ip + "/api/img/uploads/" + data["IMG_PATH"];

        if (data["total"] == 1) {
          me_fov = true;
        } else {
          me_fov = false;
        }

        dataArr.push({
          TITLE_NAME: data["SHOP_NAME_TH"],
          SHOP_CODE: data["SHOP_CODE"],
          GOODS_NAME_TH: data["GOODS_NAME_TH"],
          CATE_CODE: data["CATE_CODE"],
          SUB_CATE_CODE: data["SUB_CATE_CODE"],
          TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
          TYPE_CATE_NAME_TH: data["TYPE_CATE_NAME_TH"],
          MARKET_NAME: data["MARKET_NAME_TH"],
          LAST_UPDATE: data["lastupdate_at"],
          PRICE: data["PRICE"],
          UNIT_NAME_TH:data["UNIT_NAME_TH"],
          ME_FOV: me_fov,
          IMG: shopImg,
          LINK: data["SHARE_LINK"]
        });
      });
      q = `SELECT
                DISTINCT
                "G_CATEGORY"."CATE_CODE"
                ,"G_CATEGORY"."CATE_NAME_TH"
                , "G_SUBCATEGORY"."SUB_CATE_CODE"
                , "G_SUBCATEGORY"."SUB_CATE_NAME_TH"
                , "G_SUBCATEGORY"."SUB_CATE_NAME_EN"
                , "G_SUBCATEGORY"."SUB_CATE_IMG_BANNER"
                    FROM  "G_CATEGORY"
                    INNER JOIN "G_SUBCATEGORY" on  "G_CATEGORY"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
                where "G_CATEGORY"."CATE_CODE" = $1 and "G_SUBCATEGORY"."SUB_CATE_CODE" =$2`;
      var { rows } = await queryFunc.queryRow(q, [
        cate_code, sub_cate_code
      ]);
      shopImg = ip + "/api/img/banner/" + rows[0]["SUB_CATE_IMG_BANNER"];

      arrPro.push({
        CATE_CODE: cate_code,
        SUB_CATE_CODE: sub_cate_code,
        SUB_CATE_NAME_TH: rows[0]["SUB_CATE_NAME_TH"],
        SUB_CATE_NAME_EN: rows[0]["SUB_CATE_NAME_EN"],
        SUB_CATE_IMG_PATH_BANNER: shopImg,
        DATA: dataArr
      });
    }
    if (arrPro.length == 0) {
      res.status(200).json({ STATUS: 3, RESULT: arrPro });
    } else {
      res.status(200).json({ STATUS: 1, RESULT: arrPro });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
