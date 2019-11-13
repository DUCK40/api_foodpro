var express = require("express");
const crypto = require("crypto");
const pg = require("pg");
const axios = require("axios");
const pool = new pg.Pool(globalConfig);
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertCart(req, res, ip);
};

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
  const algorithm = "aes-256-cbc";
  console.log(req);
  const secretkey = "qazxswedcvfrtgb";
  const cipher = crypto.createCipher(algorithm, secretkey);
  var encrypted = cipher.update(req, "utf8", "hex");
  encrypted += cipher.final("hex");
  console.log(encrypted);

  const decipher = crypto.createDecipher(algorithm, secretkey);
  var decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(decrypted);
  res.send({ req: req, encrypted: encrypted, decrypted: decrypted });
}

async function insertCart(req, res, ip) {
  // console.log(req)
  //   res.status(200).send({STATUS:1,RESULT: req})
  axios.post("http://ebooking.iel.co.th/services/checkPrice.php", {
    bill_type: "PU",
    from_location_province_id: "001",
    from_location_district_id: "001-01",
    from_location_postal_code: "10110",
    destination_province_id: "001",
    destination_district_id: "001-02",
    destination_postal_code: "10600",
    box_amount_total: 2,
    service_location_id: "B1",
    box_details: [
      {
        id: "ID1",
        type: 1,
        express: "Y",
        size: "A",
        amount: 2,
        weight: 0,
        volume: 0,
        repack: "N",
        repack_type: "NO",
        repack_size: ""
      },
      {
        id: "ID2",
        type: 1,
        express: "N",
        size: "A",
        amount: 1,
        weight: 0,
        volume: 0,
        repack: "Y",
        repack_type: "CH",
        repack_size: "A"
      }
    ]
  }).then(function(response) {
      console.log(response.data.data.home_total)
    })
    .catch(function(error) {
      console.log(error)
    });
    res.send(req)
}
