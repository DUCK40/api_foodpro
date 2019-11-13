//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(memid, res) {
  const ip = globalIP;
  getGoodsFov(memid, res, ip);
};
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertGoodsFov(req, res, ip);
};

//Section Method
async function getGoodsFov(memid, res, ip) {
  try {
    const shopArr = [];
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
            FROM "M_GOODS"
            INNER JOIN "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE"
            INNER JOIN "M_SHOP" on "M_SHOP"."SHOP_CODE"  = "M_GOODS"."SHOP_CODE" and "M_SHOP"."SHOP_STATUS" =2
            INNER JOIN "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
            INNER JOIN "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
            INNER JOIn "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
				and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
            INNER JOIN "T_MEMBER_GOODS_FOV" on "T_MEMBER_GOODS_FOV"."SHOP_CODE" = "M_GOODS"."SHOP_CODE"

            and "M_GOODS"."SUB_CATE_CODE" = "T_MEMBER_GOODS_FOV"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "T_MEMBER_GOODS_FOV"."CATE_CODE" and "M_GOODS"."TYPE_CATE_CODE" = "T_MEMBER_GOODS_FOV"."TYPE_CATE_CODE" and  "T_MEMBER_GOODS_FOV" ."MEM_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [memid]);
    rows.map((data, index) => {
      shopImg = ip + "/api/img/uploads/" + data["IMG_PATH"];
      me_fov = true;
      shopArr.push({
        SHOP_CODE: data["SHOP_CODE"],
        SHOP_NAME: data["SHOP_NAME_TH"],
        GOODS_NAME_TH: data["GOODS_NAME_TH"],
        GOODS_NAME_EN: data["GOODS_NAME_EN"],
        CATE_CODE: data["CATE_CODE"],
        CATE_NAME: data["CATE_NAME_TH"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        SUB_CATE_NAME: data["SUB_CATE_NAME_TH"],
        TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
        UNIT_NAME_TH:data["UNIT_NAME_TH"],
        GOODS_IMG: shopImg,
        PRICE: data["PRICE"],
        LINK: data["SHARE_LINK"],
        ME_FOV: me_fov,
        ME: memid
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: shopArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function insertGoodsFov(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const SHOP_CODE = req.SHOP_CODE;
    const CATE_CODE = req.CATE_CODE;
    const SUB_CATE_CODE = req.SUB_CATE_CODE;
    const TYPE_CATE_CODE = req.TYPE_CATE_CODE;

    q = `SELECT count(*) as TOTAL FROM "T_MEMBER_GOODS_FOV" WHERE "T_MEMBER_GOODS_FOV"."MEM_CODE" = $1 
        and "T_MEMBER_GOODS_FOV"."SHOP_CODE" = $2 and "T_MEMBER_GOODS_FOV"."CATE_CODE" = $3  and "T_MEMBER_GOODS_FOV"."SUB_CATE_CODE" = $4  and "T_MEMBER_GOODS_FOV"."TYPE_CATE_CODE" =$5`;

    const { rows } = await queryFunc.queryRow(q, [
      MEM_CODE,
      SHOP_CODE,
      CATE_CODE,
      SUB_CATE_CODE,
      TYPE_CATE_CODE
    ]);
    if (rows[0]["total"] == 0) {
      try {
        let qArr = [];
        let pArr = [];
        q = `INSERT INTO public."T_MEMBER_GOODS_FOV"(
                    "MEM_CODE", "SHOP_CODE", "CATE_CODE", "SUB_CATE_CODE","TYPE_CATE_CODE","FOV_AT")
                    VALUES ($1, $2, $3, $4,$5,NOW());`;
        qArr.push(q);
        p = [MEM_CODE, SHOP_CODE, CATE_CODE, SUB_CATE_CODE, TYPE_CATE_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    } else {
      try {
        let qArr = [];
        let pArr = [];
        q = `DELETE FROM "T_MEMBER_GOODS_FOV" WHERE "T_MEMBER_GOODS_FOV"."MEM_CODE" = $1
                and "T_MEMBER_GOODS_FOV"."SHOP_CODE" = $2 and "T_MEMBER_GOODS_FOV"."CATE_CODE" = $3
                and "T_MEMBER_GOODS_FOV"."SUB_CATE_CODE" = $4 and "T_MEMBER_GOODS_FOV"."TYPE_CATE_CODE" =$5;`;
        qArr.push(q);
        p = [MEM_CODE, SHOP_CODE, CATE_CODE, SUB_CATE_CODE, TYPE_CATE_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
