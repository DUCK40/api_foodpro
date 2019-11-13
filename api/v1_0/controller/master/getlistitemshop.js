//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};

//Section Method
async function getDetail(req, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT
        "M_SHOP"."SHOP_NAME_TH",
        "M_GOODS"."GOODS_CODE",
        "M_GOODS"."GOODS_NAME_TH",
        "G_CATEGORY"."CATE_CODE",
        "G_CATEGORY"."CATE_NAME_TH",
        "G_SUBCATEGORY"."SUB_CATE_CODE",
        "G_SUBCATEGORY"."SUB_CATE_NAME_TH",
        "G_TYPECATEGORY"."TYPE_CATE_CODE",
        "G_TYPECATEGORY"."TYPE_CATE_NAME_TH",
        "G_UNIT"."UNIT_NAME_TH",
        "M_GOODS"."SUM_WEIGHT",
        "G_SEND"."SEND_NAME_TH",
        "G_DIMENSION"."DIM_NAME_TH",
        "M_GOODS"."PRICE",
        "M_GOODS"."IS_PROMOTE",
        "M_GOODS"."IS_STOCK",
        "M_GOODS"."SHARE_LINK",
        "M_GOODS"."CREATE_BY",
        "M_GOODS"."GOODS_DIM_X",
        (SELECT  COUNT(*) AS TOTAL FROM (select  distinct * from "T_GOODS_IMG" WHERE"T_GOODS_IMG"."CATE_CODE" =  "M_GOODS"."CATE_CODE" 
		 and "T_GOODS_IMG"."SUB_CATE_CODE" =  "M_GOODS"."SUB_CATE_CODE"
		and "T_GOODS_IMG"."TYPE_CATE_CODE" =  "M_GOODS"."TYPE_CATE_CODE"
    and "T_GOODS_IMG"."SHOP_CODE" =  "M_GOODS"."SHOP_CODE") as S),
    "T_GOODS_DESC"."GOODS_DESC_TH"
            FROM "M_GOODS"
            INNER JOIN "G_CATEGORY" ON "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
            INNER JOIN "G_SUBCATEGORY" ON "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE"
            INNER JOIN "G_UNIT" ON "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE"
            INNER JOIN "G_SEND" ON "M_GOODS"."SEND_CODE" = "G_SEND"."SEND_CODE"
            INNER JOIN "G_DIMENSION" ON "M_GOODS"."DIM_CODE" = "G_DIMENSION"."DIM_CODE"
            INNER JOIN "M_SHOP" ON "M_GOODS"."SHOP_CODE" = "M_SHOP"."SHOP_CODE"
            INNER JOIN "G_TYPECATEGORY" ON "M_GOODS"."TYPE_CATE_CODE" = "G_TYPECATEGORY"."TYPE_CATE_CODE"
            LEFT JOIN  "T_GOODS_DESC" on "T_GOODS_DESC"."CATE_CODE" =  "M_GOODS"."CATE_CODE"
            and "T_GOODS_DESC"."SUB_CATE_CODE" =  "M_GOODS"."SUB_CATE_CODE"
           and "T_GOODS_DESC"."TYPE_CATE_CODE" =  "M_GOODS"."TYPE_CATE_CODE"
           and "T_GOODS_DESC"."SHOP_CODE" =  "M_GOODS"."SHOP_CODE"
            WHERE "M_GOODS"."SHOP_CODE" = $1
            ORDER BY "M_GOODS"."GOODS_CODE" desc`;
    var { rows } = await queryFunc.queryRow(q, [req]);
    rows.map((data, index) => {
      sendArr.push({
        SHOP_NAME_TH: data["SHOP_NAME_TH"],
        GOODS_CODE: data["GOODS_CODE"],
        GOODS_NAME_TH: data["GOODS_NAME_TH"],
        CATE_CODE: data["CATE_CODE"],
        CATE_NAME_TH: data["CATE_NAME_TH"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        SHOP_NAME_TH: data["SHOP_NAME_TH"],
        SUB_CATE_NAME_TH: data["SUB_CATE_NAME_TH"],
        TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
        TYPE_CATE_NAME_TH: data["TYPE_CATE_NAME_TH"],
        UNIT_NAME_TH: data["UNIT_NAME_TH"],
        SUM_WEIGHT: data["SUM_WEIGHT"],
        SEND_NAME_TH: data["SEND_NAME_TH"],
        DIM_NAME_TH: data["DIM_NAME_TH"],
        PRICE: data["PRICE"],
        IS_PROMOTE: data["IS_PROMOTE"],
        IS_STOCK: data["IS_STOCK"],
        SHARE_LINK: data["SHARE_LINK"],
        CREATE_BY: data["CREATE_BY"],
        IMG: data["total"],
        DESC: data["GOODS_DESC_TH"],
        GOODS_DIM_X: data["GOODS_DIM_X"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
