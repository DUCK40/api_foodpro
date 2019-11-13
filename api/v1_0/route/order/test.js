var express = require("express");
var bodyParser = require("body-parser");
var CryptoJS = require("crypto-js");
const crypto = require('crypto');
const request = require("request");
var router = express.Router();
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
router.route("/").get((req, res) => {
  const SECRET = "MCwCAQACBQDDym2lAgMBAAECBDHB";
  const time = new Date().getTime().toString(); // => `1545880607433`

  const method = "POST";
  const path = "/v2/quotations";
  // const body = JSON.stringify({...}); // => the whole body for '/v2/quotations'
  var body = JSON.stringify({
    serviceType: "MOTORCYCLE",
    scheduleAt: "2018-06-13T12:00:00:00Z", // Note: This is in UTC Timezone
    specialRequests: [],
    requesterContact: {
      name: "Draco Yam",
      phone: "+6592344758"
    },
    stops: [
      {
        location: { lat: "1.284318", lng: "103.851335" },
        addresses: {
          en_SG: {
            displayString:
              "1 Raffles Place #04-00, One Raffles Place Shopping Mall, Singapore",
            country: "SG"
          }
        }
      },
      {
        location: { lat: "1.278578", lng: "103.851860" },
        addresses: {
          en_SG: {
            displayString: "Asia Square Tower 1, 8 Marina View, Singapore",
            country: "SG"
          }
        }
      }
    ],
    deliveries: [
      {
        toStop: 1,
        toContact: {
          name: "Brian Garcia",
          phone: "+6592344837"
        },
        remarks: "ORDER #: 1234, ITEM 1 x 1, ITEM 2 x 2"
      }
    ]
  });

  const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${body}`;
  // => '1546222219293\r\nPOST\r\n/v2/quotations\r\n\r\n{\n \"scheduleAt\": \"2018-12-31T14:30:00.00Z\",\n \"serviceType\": \"MOTORCYCLE\",\n \"requesterContact\": { \"name\": \"Peter Pan\", \"phone\": \"232\" },\n \"stops\": [\n {\n \"location\": { \"lat\": \"-6.255431000000001\", \"lng\": \"106.60114290000001\" },\n \"addresses\": {\n \"en_ID\": {\n \"displayString\":\n \"Jl. Perum Dasana Indah No.SD 3/ 17-18, RT.3/RW.1, Bojong Nangka, Klp. Dua, Tangerang, Banten 15810, Indonesia\",\n \"country\": \"ID\"\n }\n }\n },\n {\n \"location\": { \"lat\": \"-6.404722800000001\", \"lng\": \"106.81902130000003\" },\n \"addresses\": {\n \"en_ID\": {\n \"displayString\": \"Jl. Kartini, Ruko No. 1E, Depok, Pancoran MAS, Kota Depok, Jawa Barat 16431, Indonesia\",\n \"country\": \"ID\"\n }\n }\n }\n ],\n \"deliveries\": [\n {\n \"toStop\": 1,\n \"toContact\": {\n \"name\": \"mm\",\n \"phone\": \"9999999\"\n }\n }\n ]\n}\n'
  console.log(rawSignature);
  const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, SECRET).toString();
  console.log(SIGNATURE);
  const Secret = "MC0CAQACBQDdnCPHAgMBAAECBG/KVVECAwDlPwIDAPd5AgMAq30CAwDkcQIC";
  const API_KEY = "badcd1c9583d4d90a8b3b0c32eed82ea";
  const TOKEN = `${API_KEY}:${time}:${SIGNATURE}`;
  console.log(TOKEN);
  let nonce = crypto.randomBytes(16).toString('base64');
  console.log(nonce);

  let headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "x-api-key": "skey_test_308ZCKfxf5O16fMmClAtI7wqXlRxfwCsuwM"
  };
  let body = JSON.stringify({
    amount: data.amount,
    currency: data.currency,
    description: data.description,
    source_type: data.source_type,
    mode: data.mode,
    token: data.token,
    reference_order: data.reference_order
  });
  request.post(
    {
      url:
        "https://dev-kpaymentgateway-services.kasikornbank.com/card/v2/charge",
      headers: headers,
      body: body
    },
    (err, res, body) => {
        console.log(JSON.stringify(res));
    });
});
module.exports = router;
