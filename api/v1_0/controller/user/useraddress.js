//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertUserAddress(req, res, ip);
};
exports.func_get = function(req, res) {
  const ip = globalIP;
  getUserAddress(req, res, ip);
};
exports.func_del = function(memcode, addressid, res) {
  const ip = globalIP;
  delUserAddress(memcode, addressid, res, ip);
};
exports.func_update = function(req, res) {
  const ip = globalIP;
  updateUserAddress(req, res, ip);
};

//Section Method
async function insertUserAddress(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const ADDRESS_NO = req.ADDRESS_NO;
    const F_NAME = req.F_NAME;
    const L_NAME = req.L_NAME;
    const DISTRICT_CODE = req.DISTRICT_CODE;
    const PROVINCE_CODE = req.PROVINCE_CODE;
    const PHONE = req.PHONE;
    const IS_DEFAULT_SHIPTO = req.IS_DEFAULT_SHIPTO;
    qArr = [];
    pArr = [];
    q =
      'SELECT  "ADDRESS_ID" from "T_MEMBER_ADDRESS" WHERE "MEM_CODE" = $1 ORDER BY "ADDRESS_ID" desc limit 1';

    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    if (rows.length == 0) {
      ADDRESS_ID = "AD001";
    } else {
      OLD_MEM_CODE = rows[0].ADDRESS_ID;
      lastIndex =
        parseInt(
          OLD_MEM_CODE.substring(OLD_MEM_CODE.length - 3, OLD_MEM_CODE.length)
        ) + 1;
      if (lastIndex <= 9) {
        lastIndex = ("000" + lastIndex).slice(-3).toString();
      } else if (lastIndex >= 10 && lastIndex <= 99) {
        lastIndex = ("00" + lastIndex).slice(-3).toString();
      } else {
        lastIndex = ("0" + lastIndex).slice(-3).toString();
      }
      ADDRESS_ID = "AD" + lastIndex;
    }
    var flag = 0;
    if (IS_DEFAULT_SHIPTO == true) {
      q =
        'UPDATE "T_MEMBER_ADDRESS" SET "IS_DEFAULT_SHIPTO" = 0 WHERE "MEM_CODE" = $1';
      qArr.push(q);
      p = [MEM_CODE];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
      flag = 1;
      qArr = [];
      pArr = [];
    }
    var z = 0;
    q = `INSERT INTO public."T_MEMBER_ADDRESS"(
            "MEM_CODE", "ADDRESS_ID", "ADDRESS_NO", "DISTRICT_CODE", "PROVINCE_CODE", "PHONE", "IS_DEFAULT_SHIPTO", "IS_BILLTO","F_NAME","L_NAME")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10);`;
    qArr.push(q);
    p = [
      MEM_CODE,
      ADDRESS_ID,
      ADDRESS_NO,
      DISTRICT_CODE,
      PROVINCE_CODE,
      PHONE,
      flag,
      z,
      F_NAME,
      L_NAME
    ];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function getUserAddress(req, res, ip) {
  try {
    const arrResult = [];
    address = [];
    q = `SELECT
        "T_MEMBER_ADDRESS"."ADDRESS_ID"
        ,"T_MEMBER_ADDRESS"."F_NAME"
        ,"T_MEMBER_ADDRESS"."L_NAME"
        ,"T_MEMBER_ADDRESS"."ADDRESS_NO"
        ,"G_DISTRICT"."DISTRICT_CODE"
        ,"G_DISTRICT"."DISTRICT_NAME_TH"
        ,"G_PROVINCE"."PROVINCE_CODE"
        ,"G_PROVINCE"."PROVINCE_NAME_TH"
        ,"G_DISTRICT"."POSTCODE"
        ,"T_MEMBER_ADDRESS"."IS_DEFAULT_SHIPTO"
        ,"T_MEMBER_ADDRESS"."PHONE"
        ,"G_DISTRICT"."IS_DEMAND"
        FROM "T_MEMBER_ADDRESS" 
        INNER JOIN "G_DISTRICT" on "G_DISTRICT"."DISTRICT_CODE" = "T_MEMBER_ADDRESS"."DISTRICT_CODE" and "G_DISTRICT"."PROVINCE_CODE" = "T_MEMBER_ADDRESS"."PROVINCE_CODE"
        INNER JOIN "G_PROVINCE" on "G_PROVINCE"."PROVINCE_CODE" = "T_MEMBER_ADDRESS"."PROVINCE_CODE"
        WHERE "T_MEMBER_ADDRESS" ."MEM_CODE" = $1
        ORDER BY "T_MEMBER_ADDRESS"."ADDRESS_ID" asc`;
    var { rows } = await queryFunc.queryRow(q, [req]);
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
          PHONE: rows[i]["PHONE"],
          IS_DEMAND: IS_DEMAND
        });
      }
    } else {
      address = [];
    }
    if (address.length > 0) {
      res.status(200).send({ STATUS: 1, RESULT: { ADDRESS: address } });
    } else {
      res.status(200).send({ STATUS: 3, RESULT: { ADDRESS: address } });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function delUserAddress(memcode, addressid, res, ip) {
  try {
    qArr = [];
    pArr = [];
    q = `DELETE FROM "T_MEMBER_ADDRESS" WHERE "MEM_CODE" =$1 and "ADDRESS_ID" =$2`;
    qArr.push(q);
    p = [memcode, addressid];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function updateUserAddress(req, res, ip) {
  try {
    const MEM_CODE = req.MEM_CODE;
    const ADDRESS_ID = req.ADDRESS_ID;
    const F_NAME = req.F_NAME;
    const L_NAME = req.L_NAME;
    const ADDRESS_NO = req.ADDRESS_NO;
    const DISTRICT_CODE = req.DISTRICT_CODE;
    const PROVINCE_CODE = req.PROVINCE_CODE;
    const PHONE = req.PHONE;
    const IS_DEFAULT_SHIPTO = req.IS_DEFAULT_SHIPTO;
    qArr = [];
    pArr = [];
    var flag = 0;
    if (IS_DEFAULT_SHIPTO == true) {
      q =
        'UPDATE "T_MEMBER_ADDRESS" SET "IS_DEFAULT_SHIPTO" = 0 WHERE "MEM_CODE" = $1';
        qArr.push(q);
        p = [MEM_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        flag = 1;
        qArr = [];
        pArr = [];
    }
    q = `UPDATE public."T_MEMBER_ADDRESS"
        SET "ADDRESS_NO"=$1, "DISTRICT_CODE"=$2, "PROVINCE_CODE"=$3, "PHONE"=$4, "IS_DEFAULT_SHIPTO"=$5,"F_NAME" =$6,"L_NAME"=$7
        WHERE "MEM_CODE"=$8 and "ADDRESS_ID"=$9;`;
    qArr.push(q);
    p = [
      ADDRESS_NO,
      DISTRICT_CODE,
      PROVINCE_CODE,
      PHONE,
      flag,
      F_NAME,
      L_NAME,
      MEM_CODE,
      ADDRESS_ID
    ];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
