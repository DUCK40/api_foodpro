//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(mem_code, res) {
  const ip = globalIP;
  main(mem_code, res, ip);
};
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertData(req, res, ip);
};

//Section Method
async function insertData(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const TOKEN = req.TOKEN;
    qArr = [];
    pArr = [];
    q = `SELECT "DEVICE_TOKEN"
    FROM "T_MEMBER_DEVICE"
    where "MEM_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    if (rows.length == 0) {
      q = `INSERT INTO public."T_MEMBER_DEVICE"(
      "MEM_CODE", "DEVICE_TOKEN")
      VALUES ($1, $2)`;
      qArr.push(q);
      p = [MEM_CODE, TOKEN];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
    }

    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function main(mem_code, res, ip) {
  try {
    member = [];
    address = [];
    MEM_CODE = mem_code;

    q = `SELECT  
            "T_MEMBER_ADDRESS"."ADDRESS_ID"
            ,"T_MEMBER_ADDRESS"."F_NAME"
            ,"T_MEMBER_ADDRESS"."L_NAME"
            ,"T_MEMBER_ADDRESS"."ADDRESS_NO"
            ,"G_DISTRICT"."DISTRICT_CODE"
            ,"G_DISTRICT"."DISTRICT_NAME_TH"
            ,"G_DISTRICT"."DISTRICT_CODE"
            ,"G_PROVINCE"."PROVINCE_CODE"
            ,"G_PROVINCE"."PROVINCE_NAME_TH"
            ,"G_DISTRICT"."POSTCODE"
            ,"G_DISTRICT"."IS_DEMAND"
            ,"T_MEMBER_ADDRESS"."IS_DEFAULT_SHIPTO"
            ,"T_MEMBER_ADDRESS"."PHONE"
            FROM "T_MEMBER_ADDRESS"
            INNER JOIN "G_DISTRICT" on "G_DISTRICT"."DISTRICT_CODE" = "T_MEMBER_ADDRESS"."DISTRICT_CODE" and "G_DISTRICT"."PROVINCE_CODE" = "T_MEMBER_ADDRESS"."PROVINCE_CODE"
            INNER JOIN "G_PROVINCE" on "G_PROVINCE"."PROVINCE_CODE" = "T_MEMBER_ADDRESS"."PROVINCE_CODE"
            WHERE "T_MEMBER_ADDRESS" ."MEM_CODE" = $1`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    if (rows.length > 0) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i]["IS_DEFAULT_SHIPTO"] == 0) {
          IS_DEFAULT_SHIPTO = false;
        } else {
          IS_DEFAULT_SHIPTO = true;
        }

        if (rows[i]["IS_DEMAND"] == 0) {
          IS_DEMAND = false;
        } else {
          IS_DEMAND = true;
        }

        address.push({
          ADDRESS_ID: rows[i]["ADDRESS_ID"],
          F_NAME: rows[i]["F_NAME"],
          L_NAME: rows[i]["L_NAME"],
          ADDRESS_NO: rows[i]["ADDRESS_NO"],
          DISTRICT_CODE: rows[i]["DISTRICT_CODE"],
          DISTRICT_NAME_TH: rows[i]["DISTRICT_NAME_TH"],
          PROVINCE_CODE: rows[i]["PROVINCE_CODE"],
          PROVINCE_NAME_TH: rows[i]["PROVINCE_NAME_TH"],
          POSTCODE: rows[i]["POSTCODE"],
          IS_DEFAULT_SHIPTO: IS_DEFAULT_SHIPTO,
          IS_DEMAND: IS_DEMAND,
          PHONE: rows[i]["PHONE"]
        });
      }
    } else {
      address = [];
    }

    q = `SELECT COUNT(*) as TOTAL FROM "T_CART_HISTORY" WHERE "MEM_CODE" = $1`;
    // var { rows } = await query(q, [MEM_CODE]);
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    var COUNT_CART = rows[0]["total"];

    q = `SELECT l1."MEM_CODE", m1."MEM_FNAME_TH", m1."MEM_LNAME_TH", m1."MEM_IMG_PATH", m1."MEM_IMG_BANNER", m1."IS_SHOP_OWNER", s1."SHOP_CODE" ,l1."MEM_LOGIN_TYPE"
            FROM "T_MEMBER_LOGIN" as l1
            inner join "M_MEMBER" as m1 on (m1."MEM_CODE" = l1."MEM_CODE")
            left join "M_SHOP" as s1 on (l1."MEM_CODE" = s1."SHOP_CREATE_BY")
            where l1."MEM_CODE" = $1`;
    // var { rows } = await query(q, [MEM_CODE]);
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    console.log(rows);
    if (rows[0]["MEM_LOGIN_TYPE"] == 2) {
      imgPath =
        "http://graph.facebook.com/" +
        rows[0].MEM_IMG_PATH +
        "/picture?type=large";
    } else if (rows[0]["MEM_LOGIN_TYPE"] == 3) {
      imgPath = rows[0].MEM_IMG_PATH;
    } else {
      if (rows[0]["MEM_IMG_PATH"] == null) {
        imgPath = "";
      } else {
        imgPath = ip + "/api/img/user/" + rows[0].MEM_IMG_PATH;
      }
    }
    let banner = "";
    if (rows[0].MEM_IMG_BANNER != null) {
      banner = ip + "/api/img/BANNER_USER/" + rows[0].MEM_IMG_BANNER;
    } else {
      banner = "";
    }
    member.push({
      MEM_CODE: rows[0].MEM_CODE,
      MEM_FNAME_TH: rows[0].MEM_FNAME_TH,
      MEM_LNAME_TH: rows[0].MEM_LNAME_TH,
      MEM_IMG_PATH: imgPath,
      MEM_IMG_BANNER: banner,
      IS_SHOP_OWNER: rows[0].IS_SHOP_OWNER,
      SHOP_CODE: rows[0].SHOP_CODE,
      LOG_IN_TYPE: rows[0].MEM_LOGIN_TYPE,
      ADDRESS: address,
      COUNT_CART: COUNT_CART
    });
    res.status(200).json({ STATUS: 1, RESULT: member });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.send("Database " + err);
  }
}
