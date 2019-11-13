//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateStock(req, res, ip);
};
exports.func_get = function(SHOP_CODE, res) {
  const ip = globalIP;
  getShopItem(SHOP_CODE, res, ip);
};
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertNewItem(req, res, ip);
};

//Section Method
async function insertNewItem(req, res, ip) {
  try {
    qArr = [];
    pArr = [];
    var f = 0; // 0 insert new name,1 insert old name
    var ex = ""; //temp old name
    const CATE_CODE = req.CATE_CODE;
    const SUB_CATE_CODE = req.SUB_CATE_CODE;
    const UNIT_CODE = req.UNIT_CODE;
    const SEND_CODE = req.SEND_CODE;
    const GOODS_NAME_TH = req.GOODS_NAME_TH;
    const DIM_CODE = req.DIM_CODE;
    const SHOP_CODE = req.SHOP_CODE;
    const PRICE = req.PRICE;
    const IS_PROMOTE = req.IS_PROMOTE;
    const IS_STOCK = req.IS_STOCK;
    const SHARE_LINK = req.SHARE_LINK;
    const TYPE_CATE_CODE = req.TYPE_CATE_CODE;
    const SUM_WEIGHT = req.SUM_WEIGHT;
    const CREATE_BY = req.CREATE_BY;
    const GOODS_DIM_X = req.GOODS_DIM_X;
    const GOODS_DIM_Y = req.GOODS_DIM_Y;
    const GOODS_DIM_Z = req.GOODS_DIM_Z;


    q =
      'SELECT "GOODS_NAME_TH","PRICE","UNIT_CODE" FROM "M_GOODS" WHERE "SHOP_CODE" = $1 AND "CATE_CODE" = $2 AND "SUB_CATE_CODE" = $3 AND "TYPE_CATE_CODE" = $4';
    var { rows } = await queryFunc.queryRow(q, [
      SHOP_CODE,
      CATE_CODE,
      SUB_CATE_CODE,
      TYPE_CATE_CODE
    ]);
    if (rows.length == 0) {
      f = 0;
      ex = GOODS_NAME_TH;
    } else {
      if (
        rows[0].GOODS_NAME_TH == GOODS_NAME_TH &&
        rows[0].PRICE == PRICE &&
        rows[0].UNIT_CODE == UNIT_CODE
      ) {
        f = 2;
        ex = rows[0].GOODS_NAME_TH;
      } else {
        f = 1;
        ex = rows[0].GOODS_NAME_TH;
      }
    }
    if (f != 2) {
      q =
        'SELECT "GOODS_CODE" FROM "M_GOODS" WHERE cast("CREATE_AT" as date) = CAST(NOW() as date) and "SHOP_CODE" = $1 order by "GOODS_CODE" desc limit 1';
      var { rows } = await queryFunc.queryRow(q, [SHOP_CODE]);
      if (rows.length == 0) {
        var d = new Date();
        var date = d.getDate();
        date = ("0" + date).slice(-2).toString();
        var month = d.getMonth() + 1;
        month = ("0" + month).slice(-2).toString();
        var str = d.getFullYear().toString();
        var year = str.substring(str.length - 2, str.length);
        GOODS_CODE = SHOP_CODE + year + month + date + "001";
      } else {
        var d = new Date();
        var date = d.getDate();
        date = ("0" + date).slice(-2).toString();
        var month = d.getMonth() + 1;
        month = ("0" + month).slice(-2).toString();
        var str = d.getFullYear().toString();
        var year = str.substring(str.length - 2, str.length);
        OLD_GOODS_CODE = rows[0].GOODS_CODE;
        lastIndex =
          parseInt(
            OLD_GOODS_CODE.substring(
              OLD_GOODS_CODE.length - 3,
              OLD_GOODS_CODE.length
            )
          ) + 1;
        if (lastIndex <= 9) {
          lastIndex = ("00" + lastIndex).slice(-3).toString();
        } else if (lastIndex >= 10 && lastIndex <= 99) {
          lastIndex = ("0" + lastIndex).slice(-3).toString();
        } else {
          lastIndex = lastIndex.toString();
        }
        GOODS_CODE = SHOP_CODE + year + month + date + lastIndex;
      }
      q = `INSERT INTO public."M_GOODS"(
                "GOODS_CODE", "CATE_CODE", "SUB_CATE_CODE", "UNIT_CODE", "SEND_CODE",
                 "GOODS_NAME_TH", "DIM_CODE", "PRICE", "SHOP_CODE",
                   "IS_PROMOTE", "IS_STOCK", "SHARE_LINK", "LASTUPDATE_AT",
                   "LASTUPDATE_BY", "CREATE_AT", "CREATE_BY", "TYPE_CATE_CODE", "SUM_WEIGHT","GOODS_DIM_X","GOODS_DIM_Y","GOODS_DIM_Z")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 , NOW() ,$13,NOW(), $14, $15, $16, $17, $18, $19);`;
      qArr.push(q);
      p = [
        GOODS_CODE,
        CATE_CODE,
        SUB_CATE_CODE,
        UNIT_CODE,
        SEND_CODE,
        ex,
        DIM_CODE,
        PRICE,
        SHOP_CODE,
        IS_PROMOTE,
        IS_STOCK,
        SHARE_LINK,
        CREATE_BY,
        CREATE_BY,
        TYPE_CATE_CODE,
        SUM_WEIGHT,
        GOODS_DIM_X,
        GOODS_DIM_Y,
        GOODS_DIM_Z
      ];
      pArr.push(p);

      var ACTION_DESC = "INSERT NEW GOODS";
        q = `INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1", "REF_KEY_3","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3,$4);`;
        qArr.push(q);
        p = [CREATE_BY, SHOP_CODE, GOODS_CODE, ACTION_DESC];
        pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
      res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
    } else {
      res.status(200).send({ STATUS: 0, RESULT: "DATA DUPLICATE IN PRICE" });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function updateStock(req, res, ip) {
  try {
    qArr = [];
    pArr = [];
    const SHOP_CODE = req.SHOP_CODE;
    const GOODS_CODE = req.GOODS_CODE;
    q = `SELECT DISTINCT "IS_STOCK" FROM "M_GOODS" WHERE "SHOP_CODE" = $1 and "GOODS_CODE" = $2`;
    var { rows } = await queryFunc.queryRow(q, [SHOP_CODE, GOODS_CODE]);
    if (rows[0]["IS_STOCK"] == 1) {
      q = `UPDATE public."M_GOODS"
            SET "IS_STOCK"= 0
            WHERE "SHOP_CODE" = $1 and "GOODS_CODE" = $2`;
      qArr.push(q);
      p = [SHOP_CODE, GOODS_CODE];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
    } else {
      q = `UPDATE public."M_GOODS"
            SET "IS_STOCK"= 1
            WHERE "SHOP_CODE" = $1 and "GOODS_CODE" = $2`;
      qArr.push(q);
      p = [SHOP_CODE, GOODS_CODE];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
    }
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function getShopItem(SHOP_CODE, res, ip) {
  try {
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
                        order by s."CATE_CODE" asc,s."SUB_CATE_CODE" asc,s."TYPE_CATE_CODE" asc,s."PRICE" asc `;
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
        GOODS_CODE: data["GOODS_CODE"],
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
    if (shopArr.length > 0) {
      res.status(200).send({ STATUS: 1, RESULT: shopArr });
    } else {
      res.status(200).send({ STATUS: 3, RESULT: [] });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
