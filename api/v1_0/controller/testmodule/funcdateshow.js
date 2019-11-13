var express = require("express");
const pg = require("pg");
const pool = new pg.Pool(globalConfig);

exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};
async function query(q, p) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    try {
      res = await client.query(q, p);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

async function getDetail(req, res, ip) {
  try {
    // const arrPrice =[]
    const sendArr = [];
    // const groupArr=[];
    q = `SELECT * FROM "G_DISTRICT" WHERE "PROVINCE_CODE" = $1 ORDER BY "DISTRICT_CODE" asc`;
    var { rows } = await query(q, [req]);
    // console.log(JSON.stringify(rows))
    rows.map((data, index) => {
      sendArr.push({
        value: data["DISTRICT_CODE"],
        label: data["DISTRICT_NAME_TH"],
        PROVINCE_CODE: data["PROVINCE_CODE"],
        POSTCODE: data["POSTCODE"]
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
