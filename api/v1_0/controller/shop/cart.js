//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertCart(req, res, ip);
};
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateCart(req, res, ip);
};
exports.func_get = function(req, res) {
  const ip = globalIP;
  getCart(req, res, ip);
};
exports.func_del = function(memcode, goodscode, res) {
  const ip = globalIP;
  delCart(memcode, goodscode, res, ip);
};

//Section Method
async function updateCart(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const ITEM = req.ITEM;
    qArr = [];
    pArr = [];

    q = 'UPDATE "T_CART_HISTORY" set "IS_ACTIVE" = 1 WHERE "MEM_CODE" = $1';
    qArr.push(q);
    p = [MEM_CODE];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);

    qArr = [];
    pArr = [];
    for (var i = 0; i < ITEM.length; i++) {
      q = `UPDATE "T_CART_HISTORY" set "IS_ACTIVE" = 2 ,"DEFAULT_VAL" = $3 WHERE "MEM_CODE" = $1 and "GOODS_CODE" =$2 `;
      qArr.push(q);
      p = [MEM_CODE, ITEM[i]["GOODS_CODE"], ITEM[i]["DEFAULT_VAL"]];
      pArr.push(p);
    }
    await queryFunc.queryAction(qArr, pArr);
    q = `SELECT COUNT(*) as TOTAL FROM "T_CART_HISTORY" WHERE "MEM_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    var COUNT_CART = { COUNT_CART: rows[0]["total"] };
    res.status(200).send({ STATUS: 1, RESULT: COUNT_CART });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function insertCart(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const GOODS_CODE = req.GOODS_CODE.GOODS_CODE;
    const SHOP_CODE = req.SHOP_CODE;
    const AMOUNT = req.GOODS_CODE.DEFAULT;
    qArr = [];
    pArr = [];
    q =
      'SELECT count(*) as TOTAL FROM "T_CART_HISTORY" WHERE "T_CART_HISTORY"."MEM_CODE" = $1 and "T_CART_HISTORY"."GOODS_CODE" = $2 and "T_CART_HISTORY"."SHOP_CODE" = $3 ';
    var { rows } = await queryFunc.queryRow(q, [
      MEM_CODE,
      GOODS_CODE,
      SHOP_CODE
    ]);
    if (rows[0]["total"] == 0) {
      try {
        const IS_ACTIVE = 1;
        q =
          'insert into  "T_CART_HISTORY"("MEM_CODE","GOODS_CODE","SHOP_CODE","IS_ACTIVE","DEFAULT_VAL") values($1,$2,$3,$4,$5)';
        qArr.push(q);
        p = [MEM_CODE, GOODS_CODE, SHOP_CODE, IS_ACTIVE, AMOUNT];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        q = `SELECT COUNT(*) as TOTAL FROM "T_CART_HISTORY" WHERE "MEM_CODE" = $1`;
        var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
        var COUNT_CART = { COUNT_CART: rows[0]["total"] };

        res.status(200).send({ STATUS: 1, RESULT: COUNT_CART });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    } else {
      res.status(200).send({ STATUS: 0, RESULT: "DATA Dupplicate" });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function getCart(req, res, ip) {
  try {
    const arrResult = [];
    q = `SELECT COUNT(*) as TOTAL FROM "T_CART_HISTORY" WHERE "MEM_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [req]);
    var COUNT_CART = rows[0]["total"];
    q = `SELECT   distinct
        "M_GOODS"."GOODS_CODE"
        ,"M_GOODS"."SHOP_CODE"
        ,"M_GOODS"."CATE_CODE"
        ,"M_GOODS"."SUB_CATE_CODE"
        ,"M_GOODS"."SEND_CODE"
        ,"G_SEND"."SEND_NAME_TH"
        ,"G_TYPECATEGORY"."TYPE_CATE_CODE"
        ,"G_TYPECATEGORY"."TYPE_CATE_NAME_TH"
        ,"M_GOODS"."GOODS_NAME_TH"
        ,"T_CART_HISTORY"."DEFAULT_VAL"
        ,"M_SHOP"."SHOP_NAME_TH"
		,"M_SHOP"."SHOP_ADDRESS_NO"
		,"G_DISTRICT"."DISTRICT_CODE"
		,"G_DISTRICT"."DISTRICT_NAME_TH"
		,"G_PROVINCE"."PROVINCE_CODE"
		,"G_PROVINCE"."PROVINCE_NAME_TH"
		,"G_DISTRICT"."POSTCODE"
		,"G_DISTRICT"."IS_DEMAND"
        ,"G_UNIT"."UNIT_NAME_TH"
        ,"M_GOODS"."PRICE"
		,"M_SHOP"."IS_ACTIVE_LALAMOVE"
		,"M_SHOP"."IS_OWNER_PACKING"
        ,"M_SHOP"."IS_RECEIVE_FROM_HOME"
        ,"G_DIMENSION"."DIM_NAME_TH"
		,case when "G_DIMENSION"."DIM_HEIGHT" IS NULL then '0'
 		else "G_DIMENSION"."DIM_HEIGHT" end
		,case when "G_DIMENSION"."DIM_LENGTH" IS NULL then '0'
 		else "G_DIMENSION"."DIM_LENGTH" end
		,case when "G_DIMENSION"."DIM_WIDTH" IS NULL then '0'
 		else "G_DIMENSION"."DIM_WIDTH" end
		,case when "T_SHOP_DISCOUNT"."DISCOUNT_TYPE" IS NULL then '0'
 		else "T_SHOP_DISCOUNT"."DISCOUNT_TYPE" end
		,case when "T_SHOP_DISCOUNT"."DISCOUNT_VALUE" IS NULL then '0'
 		else "T_SHOP_DISCOUNT"."DISCOUNT_VALUE" end
        ,(SELECT "T_GOODS_IMG"."IMG_PATH" FROM "T_GOODS_IMG" WHERE "T_GOODS_IMG"."SHOP_CODE"="T_CART_HISTORY"."SHOP_CODE" 
		  and "T_GOODS_IMG"."CATE_CODE" = "G_CATEGORY"."CATE_CODE" and "T_GOODS_IMG"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" 
		  and "T_GOODS_IMG"."TYPE_CATE_CODE" =  "G_TYPECATEGORY"."TYPE_CATE_CODE" limit 1) as IMG_PATH
        FROM "T_CART_HISTORY"
        inner join "M_GOODS" on "T_CART_HISTORY"."GOODS_CODE" = "M_GOODS"."GOODS_CODE" and "T_CART_HISTORY"."SHOP_CODE" = "M_GOODS"."SHOP_CODE"
        inner join "G_CATEGORY" on "M_GOODS"."CATE_CODE" = "G_CATEGORY"."CATE_CODE"
        inner join "G_SUBCATEGORY" on "M_GOODS"."SUB_CATE_CODE" = "G_SUBCATEGORY"."SUB_CATE_CODE" and "M_GOODS"."CATE_CODE"= "G_SUBCATEGORY"."CATE_CODE"
        inner join "G_TYPECATEGORY" on "G_TYPECATEGORY"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "G_TYPECATEGORY"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
				and "G_TYPECATEGORY"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE"
        inner join "G_SEND" on "M_GOODS"."SEND_CODE" = "G_SEND"."SEND_CODE"
        inner join "M_SHOP" on "T_CART_HISTORY"."SHOP_CODE" = "M_SHOP"."SHOP_CODE"
		inner join "G_DISTRICT" on "G_DISTRICT"."DISTRICT_CODE" = "M_SHOP"."DISTRICT_CODE"  and "G_DISTRICT"."PROVINCE_CODE" = "M_SHOP"."PROVINCE_CODE"
		inner join "G_PROVINCE" on "G_PROVINCE"."PROVINCE_CODE" = "M_SHOP"."PROVINCE_CODE"
        inner join "G_UNIT" on "M_GOODS"."UNIT_CODE" = "G_UNIT"."UNIT_CODE" 
        inner join "G_DIMENSION" on "G_DIMENSION"."DIM_CODE" = "M_GOODS"."DIM_CODE"
		left join "T_SHOP_DISCOUNT" on "T_SHOP_DISCOUNT"."CATE_CODE" = "M_GOODS"."CATE_CODE" and "T_SHOP_DISCOUNT"."SUB_CATE_CODE" = "M_GOODS"."SUB_CATE_CODE" 
				and "T_SHOP_DISCOUNT"."TYPE_CATE_CODE" = "M_GOODS"."TYPE_CATE_CODE" and "T_SHOP_DISCOUNT"."IS_ACTIVE" = 1
        where "T_CART_HISTORY"."MEM_CODE" =$1
        order by "M_GOODS"."SHOP_CODE" asc ,"M_GOODS"."SEND_CODE" asc,"M_GOODS"."GOODS_CODE" asc`;

    var { rows } = await queryFunc.queryRow(q, [req]);
    rows.map((data, index) => {
      img = ip + "/api/img/" + "uploads" + "/" + data["img_path"];
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
        distv = parseFloat(data["PRICE"]) - parseFloat(data["DISCOUNT_VALUE"]);
      }

      if (data["IS_DEMAND"] == 0) {
        IS_DEMAND = false;
      } else {
        IS_DEMAND = true;
      }
      arrResult.push({
        GOODS_CODE: data["GOODS_CODE"],
        SHOP_CODE: data["SHOP_CODE"],
        CATE_CODE: data["CATE_CODE"],
        SUB_CATE_CODE: data["SUB_CATE_CODE"],
        GOODS_NAME_TH: data["GOODS_NAME_TH"],
        TYPE_CATE_CODE: data["TYPE_CATE_CODE"],
        TYPE_CATE_NAME_TH: data["TYPE_CATE_NAME_TH"],
        DEFAULT_VAL: data["DEFAULT_VAL"],
        SHOP_NAME_TH: data["SHOP_NAME_TH"],
        UNIT_NAME_TH: data["UNIT_NAME_TH"],
        PRICE: data["PRICE"],
        IMG_PATH: img,
        IS_ACTIVE: true,
        SEND_CODE: data["SEND_CODE"],
        SEND_NAME_TH: data["SEND_NAME_TH"],
        DISCOUNT_LABEL: distl,
        DISCOUNT_MODE: disct,
        DISCOUNT_VAL: distv,
        SHOP_ADDRESS_NO: data["SHOP_ADDRESS_NO"],
        DISTRICT_CODE: data["DISTRICT_CODE"],
        DISTRICT_NAME_TH: data["DISTRICT_NAME_TH"],
        PROVINCE_CODE: data["PROVINCE_CODE"],
        PROVINCE_NAME_TH: data["PROVINCE_NAME_TH"],
        POSTCODE: data["POSTCODE"],
        IS_ACTIVE_LALAMOVE: data["IS_ACTIVE_LALAMOVE"],
        IS_OWNER_PACKING: data["IS_OWNER_PACKING"],
        IS_RECEIVE_FROM_HOME: data["IS_RECEIVE_FROM_HOME"],
        DIM_NAME_TH: data["DIM_NAME_TH"],
        DIM_HEIGHT: data["DIM_HEIGHT"],
        DIM_LENGTH: data["DIM_LENGTH"],
        DIM_WIDTH: data["DIM_WIDTH"],
        IS_DEMAND: IS_DEMAND,
        COUNT_CART: COUNT_CART
      });
    });
    res.status(200).send({ STATUS: 1, RESULT: arrResult });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function delCart(MEM_CODE, goodscode, res, ip) {
  try {
    qArr = [];
    pArr = [];
    q = `DELETE FROM "T_CART_HISTORY" WHERE "MEM_CODE" =$1 and "GOODS_CODE" =$2`;
    qArr.push(q);
    p = [MEM_CODE, goodscode];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);

    q = `SELECT COUNT(*) as TOTAL FROM "T_CART_HISTORY" WHERE "MEM_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    var COUNT_CART = { COUNT_CART: rows[0]["total"] };
    res.status(200).send({ STATUS: 1, RESULT: COUNT_CART });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
