var express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
const socketIo = require("socket.io");
const request = require("request");
const axios = require("axios");
var logger = require("./logger/logger");
const fs = require("fs");
// root router

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors());
app.use("/api", require("./api"));
const portSv = 4200;
// const ipNodeSv = '203.150.52.242'
var server = app.listen(portSv, () => {
  logger.info("running server on from port:::::::" + portSv);
});
const websocket = socketIo.listen(server);
// global.globalIP = 'http://'+ipNodeSv+':'+portSv
const ipNodeSv = "https://apidev.foodproonline.com";
global.globalIP = ipNodeSv;
// global.globalConfig = {
//   user: "postgres",
//   host: "203.150.52.243",
//   database: "postgres",
//   password: "N12jK*Cv",
//   port: 5432,
//   max: 50,
//   idle: 30000
// };

global.globalConfig = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
  max: 50,
  idle: 30000
};


// global.globalConfig = {
//   user: "postgres",
//   host: "192.168.1.3",
//   database: "postgres",
//   password: "N12jK*Cv",
//   port: 5432,
//   max: 50,
//   idle: 30000
// };

app.post("/api/V1_0/uploadpicprofile", (req, res) => {
  const { DATA, TYPE, MEM_CODE, IMG} = req.body;
  var data = DATA.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer.from(data, "base64");
  let path = "";
  if(IMG =="Profile"){
    path = "./api/img/user/";
  }else{
    path = "./api/img/BANNER_USER/";
  }
  let filename = "IMG" + "-" + Date.now() + "." + TYPE.split("/")[1];
  // var filename = "./api/img/user/" + "IMG" + "-" + Date.now() + "." + TYPE.split("/")[1]
  fs.writeFile(
    path+filename,
    buf,
    function(err) {
      if (err) throw err;
      else {
        axios
          .put("http://localhost:4200/api/v1_0/user/uploaduserpicapp", {
            FILENAME: filename,
            MEM_CODE: MEM_CODE,
            IMGTYPE : IMG
          })
          .then(function(response) {
            console.log(response);
            hookRes = 1;
            res.status(200).send({
              STATUS: response.data.STATUS,
              RESULT: response.data.RESULT
            });
          })
          .catch(function(error) {
            console.log(error);
            hookRes = 0;
          });
      }
    }
  );
});


websocket.on("connection", client => {
  console.log("open connect");
});

app.post("/webhook/card", async (req, res) => {
  websocket.sockets.emit("Recieve Token Card", req.body);
  //   res.send("กำลังดำเนินการ");
  // console.log(req.body);
  res.status(200).send({ STATUS: 1, RESULT: req.body });
});

app.post("/webhook/qr", async (req, res) => {
  websocket.sockets.emit("Recieve Token Qr", req.body);
  //   res.send("กำลังดำเนินการ");
  // console.log(req.body);
  // res.status(200).send({ STATUS: 1, RESULT: req.body });
  var bodyHook = req.body;
  const x = "skey_test_308ZCKfxf5O16fMmClAtI7wqXlRxfwCsuwM";
  const amountData = parseFloat(bodyHook.amount)
    .toFixed(4)
    .toString();

  var textForEncode =
    bodyHook.id +
    amountData +
    bodyHook.currency +
    bodyHook.status +
    bodyHook.transaction_state +
    x;
  // console.log(textForEncode)
  var strEncode = sha256(textForEncode);
  // console.log(strEncode)
  var hookRes = 0;
  if (strEncode === bodyHook.checksum) {
    // res.status(200).send({ STATUS: 1, RESULT: req.body });
    hookRes = 1;
    PAYMENT_TYPE = 2;
    SO_CODE = bodyHook.reference_order;
    REF_BANK = bodyHook.id;
    PAYMENT_HOST = "KBANK";
    PRICE = bodyHook.amount;
    CURRENCY = bodyHook.currency;
    axios
      .put("http://localhost:4200/api/v1_0/order/putstatuspayment", {
        SO_CODE: SO_CODE,
        REF_BANK: REF_BANK,
        PAYMENT_TYPE: PAYMENT_TYPE,
        PAYMENT_HOST: PAYMENT_HOST,
        PRICE: PRICE,
        CURRENCY: CURRENCY
      })
      .then(function(response) {
        console.log(response);
        hookRes = 1;
        res.status(200).send({
          STATUS: response.data.STATUS,
          RESULT: response.data.RESULT
        });
        websocket.sockets.emit("Recieve Token Qr", {
          STATUS: response.data.STATUS,
          RESULT: response.data.RESULT
        });
      })
      .catch(function(error) {
        console.log(error);
        hookRes = 0;
      });
  } else {
    hookRes = 0;
    res.status(200).send({ STATUS: 0, RESULT: req.body });
    websocket.sockets.emit("Recieve Token Qr", {
      STATUS: hookRes,
      RESULT: req.body
    });
  }
});

app.post("/charge/card", async (req, result) => {
  var data = req.body;
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
      //   console.log("status = " + res.statusCode);
      //   console.log("body = " + body);
      var jsonData = JSON.parse(body);

      var SO_CODE = "";
      var REF_BANK = "";
      var PAYMENT_HOST = "";
      var PRICE = 0;
      var CURRENCY = "";
      if (
        jsonData["transaction_state"] === "Authorized" &&
        jsonData["status"] === "success"
      ) {
        var PAYMENT_TYPE;
        if (jsonData["source"]["object"] == "card") {
          PAYMENT_TYPE = 1;
        } else if (jsonData["source"]["object"] == "qr") {
          PAYMENT_TYPE = 2;
        } else {
          PAYMENT_TYPE = 3;
        }
        SO_CODE = jsonData["reference_order"];
        REF_BANK = jsonData["id"];
        PAYMENT_HOST = "KBANK";
        PRICE = jsonData["amount"];
        CURRENCY = jsonData["currency"];
        axios
          .put("http://localhost:4200/api/v1_0/order/putstatuspayment", {
            SO_CODE: SO_CODE,
            REF_BANK: REF_BANK,
            PAYMENT_TYPE: PAYMENT_TYPE,
            PAYMENT_HOST: PAYMENT_HOST,
            PRICE: PRICE,
            CURRENCY: CURRENCY
          })
          .then(function(response) {
            // console.log(response);
            result.status(200).send({
              STATUS: response.data.STATUS,
              RESULT: response.data.RESULT
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  );
});
app.get("/charge/qr", (req, res) => {
  res.send({ STATUS: 1, DATA: req.body });
  // console.log("I AM GET");
});
app.post("/charge/qr", async (req, result) => {
  var data = req.body;
  // console.log(data);
  let headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "x-api-key": "skey_test_308ZCKfxf5O16fMmClAtI7wqXlRxfwCsuwM"
  };
  // let body = JSON.stringify({
  //   amount: data.amount,
  //   currency: data.currency,
  //   description: data.description,
  //   source_type: data.source_type,
  //   mode: data.mode,
  //   token: data.token,
  //   reference_order: data.reference_order
  // });
  var url =
    "https://dev-kpaymentgateway-services.kasikornbank.com/qr/v2/qr/" + data.id;
  // console.log(url)
  request.get(
    {
      url: url,
      headers: headers
    },
    (err, res, body) => {
      // console.log(JSON.stringify(res));
      //     //   console.log("status = " + res.statusCode);
      //     //   console.log("body = " + body);
      var jsonData = JSON.parse(body);
      var SO_CODE = "";
      var REF_BANK = "";
      var PAYMENT_HOST = "";
      var PRICE = 0;
      var CURRENCY = "";
      if (
        jsonData["transaction_state"] === "Authorized" &&
        jsonData["status"] === "success"
      ) {
        var PAYMENT_TYPE;
        if (jsonData["source"]["object"] == "card") {
          PAYMENT_TYPE = 1;
        } else if (jsonData["source"]["object"] == "qr") {
          PAYMENT_TYPE = 2;
        } else {
          PAYMENT_TYPE = 3;
        }
        SO_CODE = jsonData["reference_order"];
        REF_BANK = jsonData["id"];
        PAYMENT_HOST = "KBANK";
        PRICE = jsonData["amount"];
        CURRENCY = jsonData["currency"];
        axios
          .put("http://localhost:4200/api/v1_0/order/putstatuspayment", {
            SO_CODE: SO_CODE,
            REF_BANK: REF_BANK,
            PAYMENT_TYPE: PAYMENT_TYPE,
            PAYMENT_HOST: PAYMENT_HOST,
            PRICE: PRICE,
            CURRENCY: CURRENCY
          })
          .then(function(response) {
            // console.log(response);
            result.status(200).send({
              STATUS: response.data.STATUS,
              RESULT: response.data.RESULT
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      //   result.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
    }
  );
});
