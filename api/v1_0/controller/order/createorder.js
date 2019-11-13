//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
var descLogisBlock = require("../../../helpFunction/desclogisblock");
var getDescriptionBlock = require("../../../helpFunction/getDestination");
var dimensionblock = require("../../../helpFunction/dimensionblock");
var express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const request = require("request");

//Section CURD
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertOrder(req, res, ip);
};
exports.func_get = function(req, res) {
  const ip = globalIP;
  getCart(req, res, ip);
};

//Section Method
function getNormalSize(volume, weight) {
  let size;
  let total;
  if (weight <= 30) {
    total = 1;
    if (volume <= 50000) {
      if (weight <= 20) {
        size = "A";
      } else {
        if (weight > 20 && weight <= 30) {
          size = "B";
        } else {
          size = "C";
        }
      }
    } else if (volume > 50000 && volume <= 100000) {
      if (weight > 20 && weight <= 30) {
        size = "B";
      } else {
        size = "C";
      }
    } else {
      size = "C";
    }
    return [{ SIZE: size, TOTAL: total }];
  } else {
    let roundData = parseInt(weight / 30);
    let getRound = roundData;
    let subtract = weight - parseInt(getRound * 30);
    if (subtract <= 20) {
      size = "A";
    } else {
      if (weight > 20 && weight <= 30) {
        size = "B";
      } else {
        size = "C";
      }
    }
    return [{ SIZE: "C", TOTAL: getRound }, { SIZE: size, TOTAL: 1 }];
  }

  // return { SIZE: size, TOTAL: total };
}
async function insertOrder(req, resp, ip) {
  try {
    // console.log(req);
    const MEM_CODE = req.MEM_CODE;
    const DEST_ADDRESS = req.DEST_ADDRESS;
    const PAYMENT_TYPE = req.PAYMENT_TYPE;
    const QR = req.QR;
    const TOTAL = req.TOTAL;
    const TRANS = req.TRANS;
    const DATAITEM = req.DATAITEM;
    const OPTION = req.OPTION;
    var arr = [];
    var dataArr = [];
    for (var i = 0; i < DATAITEM.length; i++) {
      var DELIVERY_OPTION = DATAITEM[i]["DELIVERY_OPTION"];
      var DETAIL = DATAITEM[i]["DETAIL"];

      for (var j = 0; j < DETAIL.length; j++) {
        var ITEM = DETAIL[j]["ITEM"];
        for (var k = 0; k < ITEM.length; k++) {
          var DP_NAME_TH = DELIVERY_OPTION["DP_NAME_TH"];
          var SM_CODE = DELIVERY_OPTION["SM_CODE"];
          var IS_EXPRESS = DELIVERY_OPTION["IS_EXPRESS"];
          var VENDER_DISTRICT_CODE = DETAIL[j]["DISTRICT_CODE"];
          var VENDER_DISTRICT_NAME_TH = DETAIL[j]["DISTRICT_NAME_TH"];
          var IS_ACTIVE_LALAMOVE = DETAIL[j]["IS_ACTIVE_LALAMOVE"];
          var IS_DEMAND = DETAIL[j]["IS_DEMAND"];
          var IS_OWNER_PACKING = DETAIL[j]["IS_OWNER_PACKING"];
          var IS_RECEIVE_FROM_HOME;
          var VENDER_POSTCODE = DETAIL[j]["POSTCODE"];
          var VENDER_PROVINCE_CODE = DETAIL[j]["PROVINCE_CODE"];
          var VENDER_PROVINCE_NAME_TH = DETAIL[j]["PROVINCE_NAME_TH"];
          var SEND_CODE = DETAIL[j]["SEND_CODE"];
          var SEND_NAME_TH = DETAIL[j]["SEND_NAME_TH"];
          var SHOP_ADDRESS_NO = DETAIL[j]["SHOP_ADDRESS_NO"];
          var SHOP_CODE = DETAIL[j]["SHOP_CODE"];
          var SHOP_NAME_TH = DETAIL[j]["SHOP_NAME_TH"];
          var DC_LOCATION_ID = DETAIL[j]["DC_LOCATION_ID"];

          // DEST
          var DEST_ADDRESS_NO = DEST_ADDRESS["ADDRESS_NO"];
          var DEST_DISTRICT_CODE = DEST_ADDRESS["DISTRICT_CODE"];
          var DEST_DISTRICT_NAME_TH = DEST_ADDRESS["DISTRICT_NAME_TH"];
          var DEST_PROVINCE_CODE = DEST_ADDRESS["PROVINCE_CODE"];
          var DEST_PROVINCE_NAME_TH = DEST_ADDRESS["PROVINCE_NAME_TH"];
          var DEST_POSTCODE = DEST_ADDRESS["POSTCODE"];
          var IS_DEFAULT_SHIPTO = DEST_ADDRESS["IS_DEFAULT_SHIPTO"];
          var IS_DEMAND = DEST_ADDRESS["IS_DEMAND"];
          var F_NAME = DEST_ADDRESS["F_NAME"];
          var L_NAME = DEST_ADDRESS["L_NAME"];
          var PHONE = DEST_ADDRESS["PHONE"];
          // console.log(VENDER_PROVINCE_NAME_TH,DEST_PROVINCE_NAME_TH)

          var DEFAULT_VAL = ITEM[k]["DEFAULT_VAL"];
          var DIM_NAME_TH = ITEM[k]["DIM_NAME_TH"];
          var DIM_HEIGHT = ITEM[k]["DIM_HEIGHT"];
          var DIM_LENGTH = ITEM[k]["DIM_LENGTH"];
          var DIM_WIDTH = ITEM[k]["DIM_WIDTH"];
          // var PRICE = ITEM[k]["PRICE"];
          var PRICE = ITEM[k]["DISCOUNT_VAL"];
          var SEND_CODE = ITEM[k]["SEND_CODE"];
          var WEIGHT = ITEM[k]["WEIGHT"];
          var SHOP_CODE = ITEM[k]["SHOP_CODE"];
          var GOODS_CODE = ITEM[k]["GOODS_CODE"];
          var arrL = [];
          var locationId;
          var formPName;
          if (DETAIL[j]["IS_RECEIVE_FROM_HOME"] == 1) {
            // console.log('DONE')
            IS_RECEIVE_FROM_HOME = "PU";
            arrL.push({
              from_location_district_id: VENDER_DISTRICT_CODE,
              from_location_postal_code: VENDER_POSTCODE,
              from_location_province_id: VENDER_PROVINCE_CODE
            });

            // console.log(VENDER_PROVINCE_CODE,VENDER_DISTRICT_CODE)
            formPName = await getDescriptionBlock.getDescription(
              VENDER_PROVINCE_CODE,
              VENDER_DISTRICT_CODE
            );
            // console.log('formPName:'+formPName);

            var ok = await axios
              .get("http://ebooking.iel.co.th:3001/location/all")
              .then(function(response) {
                return response.data.data;
              })
              .catch(function(error) {
                logger.error("Database:::::::" + error);
              });

            for (var a = 0; a < ok.length; a++) {
              for (var b = 0; b < arrL.length; b++) {
                if (
                  ok[a]["province_code"] ==
                    arrL[b]["from_location_province_id"] &&
                  ok[a]["district_code"] ==
                    arrL[b]["from_location_district_id"] &&
                  ok[a]["postal_code"] == arrL[b]["from_location_postal_code"]
                ) {
                  locationId = ok[a]["service_location_id"];
                }
              }
            }
          } else {
            // console.log("done 1");
            IS_RECEIVE_FROM_HOME = "DO";
            if (DC_LOCATION_ID == "0") {
              // console.log("done 1.1");
              IS_RECEIVE_FROM_HOME = "PU";
              arrL.push({
                from_location_district_id: VENDER_DISTRICT_CODE,
                from_location_postal_code: VENDER_POSTCODE,
                from_location_province_id: VENDER_PROVINCE_CODE
              });

              formPName = await getDescriptionBlock.getDescription(
                VENDER_PROVINCE_CODE,
                VENDER_DISTRICT_CODE
              );
              console.log(formPName);

              var ok = await axios
                .get("http://ebooking.iel.co.th:3001/location/all")
                .then(function(response) {
                  return response.data.data;
                })
                .catch(function(error) {
                  logger.error("Database:::::::" + error);
                });

              for (var a = 0; a < ok.length; a++) {
                for (var b = 0; b < arrL.length; b++) {
                  if (
                    ok[a]["province_code"] ==
                      arrL[b]["from_location_province_id"] &&
                    ok[a]["district_code"] ==
                      arrL[b]["from_location_district_id"] &&
                    ok[a]["postal_code"] == arrL[b]["from_location_postal_code"]
                  ) {
                    locationId = ok[a]["service_location_id"];
                  }
                }
              }
            } else {
              console.log("done 1.2");
              // console.log(DATA[0]["DC_LOCATION_ID"], DATA[0]["DC_LOCATION_ID"]);
              formPName = DC_LOCATION_ID;
              locationId = DC_LOCATION_ID;
            }
          }
          // console.log(formPName, locationId);
          // arrL.push({
          //   from_location_district_id: VENDER_DISTRICT_CODE,
          //   from_location_postal_code: VENDER_POSTCODE,
          //   from_location_province_id: VENDER_PROVINCE_CODE
          // });
          // var ok = await axios
          //   .get("http://ebooking.iel.co.th:3001/location/all")
          //   .then(function(response) {
          //     return response.data.data;
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
          // var locationId;
          // for (var a = 0; a < ok.length; a++) {
          //   for (var b = 0; b < arrL.length; b++) {
          //     if (
          //       ok[a]["province_code"] ==
          //         arrL[b]["from_location_province_id"] &&
          //       ok[a]["district_code"] ==
          //         arrL[b]["from_location_district_id"] &&
          //       ok[a]["postal_code"] == arrL[b]["from_location_postal_code"]
          //     ) {
          //       locationId = ok[a]["service_location_id"];
          //     }
          //   }
          // }

          if (DP_NAME_TH == "IEL") {
            if (SEND_CODE == "S01") {
              arr = [];
              if (IS_OWNER_PACKING == 0) {
              } else {
                if (IS_EXPRESS == 1) {
                  express = "Y";
                } else {
                  express = "N";
                }
                repack_type = "NO";
                repack = false;
                repack_size = "";
                type = 0;
                volume =
                  parseFloat(DIM_HEIGHT) *
                  parseFloat(DIM_LENGTH) *
                  parseFloat(DIM_WIDTH) *
                  parseFloat(DEFAULT_VAL);
                weight = parseFloat(WEIGHT) * parseFloat(DEFAULT_VAL);
                // if (volume <= 50000 && weight <= 20) {
                //   size = "A";
                // } else if (volume <= 100000 && weight <= 30) {
                //   size = "B";
                // } else if (volume > 100000 || weight > 30) {
                //   size = "C";
                // }
                // const algorithm = "aes-256-cbc";
                // const secretkey = "qazxswedcvfrtgb" + i + j + k;
                // const cipher = crypto.createCipher(algorithm, secretkey);
                // var encrypted = cipher.update(Date(), "utf8", "hex");
                // encrypted += cipher.final("hex");
                let getSize = getNormalSize(volume, weight);
                let box_details = [];
                let numPack = 0;
                for (var kk = 0; kk < getSize.length; kk++) {
                  let algorithm = "aes-256-cbc";
                  let secretkey = "qazxswedcvfrtgb" + i + j + kk;
                  let cipher = crypto.createCipher(algorithm, secretkey);
                  var encrypted = cipher.update(Date(), "utf8", "hex");
                  encrypted += cipher.final("hex");
                  numPack = parseInt(numPack) + parseInt(getSize[kk].TOTAL);
                  if (getSize[kk].SIZE == "C") {
                    size = "C";
                    weightG = 40;
                  } else if (
                    getSize[kk].SIZE == "B1" ||
                    getSize[kk].SIZE == "B2" ||
                    getSize[kk].SIZE == "B"
                  ) {
                    size = "B";
                    weightG = 30;
                  } else {
                    size = "A";
                    weightG = 20;
                  }
                  box_details.push({
                    amount: getSize[kk].TOTAL,
                    express: express,
                    id: encrypted,
                    repack: repack,
                    repack_size: "",
                    repack_type: repack_type,
                    size: size,
                    type: 0,
                    volume: volume,
                    weight: weightG
                  });
                }
                // console.log(box_details)
                arr.push({
                  sender: DP_NAME_TH,
                  SM_CODE: SM_CODE,
                  destination_district_id: DEST_DISTRICT_CODE,
                  destination_postal_code: DEST_POSTCODE,
                  destination_province_id: DEST_PROVINCE_CODE,
                  from_location_district_id: VENDER_DISTRICT_CODE,
                  from_location_postal_code: VENDER_POSTCODE,
                  from_location_province_id: VENDER_PROVINCE_CODE,
                  service_location_id: locationId,
                  bill_type: IS_RECEIVE_FROM_HOME,
                  box_amount_total: numPack,
                  box_details: box_details
                });
              }
              // console.log(arr)
              var pData = arr[0];
              var ok = await axios
                .post(
                  "http://ebooking.iel.co.th/services/checkPrice.php",
                  pData
                )
                .then(function(response) {
                  // console.log(response.data.data.price_details);
                  let home_total = response.data.data.home_total;
                  let loopPU = response.data.data.price_details;
                  let sumPU = 0;
                  if (loopPU.length > 0) {
                    for (var cc = 0; cc < loopPU.length; cc++) {
                      sumPU =
                        parseFloat(sumPU) + parseFloat(loopPU[cc].home_price);
                    }
                  }
                  // console.log(sumPU)
                  return { TOTAL: home_total, PU: sumPU };
                })
                .catch(function(error) {
                  console.log(error);
                });
              var D_COST = parseFloat(ok.TOTAL) - parseFloat(ok.PU);
              var PU = ok.PU;
              // console.log(D_COST)
            } else if (SEND_CODE == "S02") {
              // console.log("DONE");
              arr = [];
              express = "Y";
              repack_type = "CH";
              if (IS_OWNER_PACKING == 0) {
                //// ielpack
                repack = true;
                repack_size = DIM_NAME_TH;
                size = DIM_NAME_TH;
                type = 0;
                volume = 0;
                let dimX = parseFloat(DIM_WIDTH);
                let dimY = parseFloat(DIM_LENGTH);
                let dimZ = parseFloat(DIM_HEIGHT);
                let amount = parseFloat(DEFAULT_VAL);
                let weightG = parseFloat(WEIGHT);
                var dBlock = await dimensionblock.chooseBox(
                  dimX,
                  dimY,
                  dimZ,
                  amount,
                  weightG,
                  repack_type
                );
                // console.log(dBlock);
                newArr = [];
                if (dBlock.DATA[0].SIZE != "-") {
                  let n = 0;
                  for (var m = 0; m < dBlock.DATA.length; m++) {
                    // console.log(dBlock.DATA[m]);
                    if (dBlock.DATA[m].SIZE == "C") {
                      newArr.pop();
                      n = n + dBlock.DATA[m].TOTAL;
                      newArr.push({ SIZE: "C", TOTAL: n });
                    } else {
                      newArr.push({
                        SIZE: dBlock.DATA[m].SIZE,
                        TOTAL: dBlock.DATA[m].TOTAL
                      });
                    }
                  }
                }
                let numPack = 0;
                let box_details = [];
                for (var kk = 0; kk < newArr.length; kk++) {
                  let algorithm = "aes-256-cbc";
                  let secretkey = "qazxswedcvfrtgb" + i + j + kk;
                  let cipher = crypto.createCipher(algorithm, secretkey);
                  var encrypted = cipher.update(Date(), "utf8", "hex");
                  encrypted += cipher.final("hex");
                  numPack = parseInt(numPack) + parseInt(newArr[kk].TOTAL);
                  if (newArr[kk].SIZE == "C") {
                    size = "C";
                    weight = 40;
                  } else if (
                    newArr[kk].SIZE == "B1" ||
                    newArr[kk].SIZE == "B2"
                  ) {
                    size = "B";
                    weight = 30;
                  } else {
                    size = "A";
                    weight = 20;
                  }
                  box_details.push({
                    amount: newArr[kk].TOTAL,
                    express: express,
                    id: encrypted,
                    repack: repack,
                    repack_size: newArr[kk].SIZE,
                    repack_type: repack_type,
                    size: size,
                    type: 0,
                    volume: 0,
                    weight: 0
                  });
                }

                DestPName = await getDescriptionBlock.getDescription(
                  DEST_PROVINCE_CODE,
                  DEST_DISTRICT_CODE
                );
                // console.log(DestPName);
                // console.log(formPName);
                descLogisTxt = await descLogisBlock.getDescription(
                  formPName,
                  DestPName,
                  0,
                  0,
                  0
                );
                // console.log(descLogisTxt.RESULT);
                // console.log(box_details)
                // const algorithm = "aes-256-cbc";
                // const secretkey = "qazxswedcvfrtgb" + i + j + k;
                // const cipher = crypto.createCipher(algorithm, secretkey);
                // var encrypted = cipher.update(Date(), "utf8", "hex");
                // encrypted += cipher.final("hex");
                arr.push({
                  sender: DP_NAME_TH,
                  SM_CODE: SM_CODE,
                  destination_district_id: DEST_DISTRICT_CODE,
                  destination_postal_code: DEST_POSTCODE,
                  destination_province_id: DEST_PROVINCE_CODE,
                  from_location_district_id: VENDER_DISTRICT_CODE,
                  from_location_postal_code: VENDER_POSTCODE,
                  from_location_province_id: VENDER_PROVINCE_CODE,
                  service_location_id: locationId,
                  bill_type: IS_RECEIVE_FROM_HOME,
                  box_amount_total: numPack,
                  box_details: box_details
                });
                // console.log(arr)
              } else {
                //// owner pack
                repack = true;
                repack_size = "";
                type = 0;
                volume =
                  parseFloat(DIM_HEIGHT) *
                  parseFloat(DIM_LENGTH) *
                  parseFloat(DIM_WIDTH);
                weight = parseFloat(WEIGHT) * parseFloat(DEFAULT_VAL);
                // if (volume <= 50000 && weight <= 20) {
                //   size = "A";
                // } else if (volume <= 100000 && weight <= 30) {
                //   size = "B";
                // } else if (volume > 100000 || weight > 30) {
                //   size = "C";
                // }
                // const algorithm = "aes-256-cbc";
                // const secretkey = "qazxswedcvfrtgb" + i + j + k;
                // const cipher = crypto.createCipher(algorithm, secretkey);
                // var encrypted = cipher.update(Date(), "utf8", "hex");
                // encrypted += cipher.final("hex");
                let dimX = parseFloat(DIM_WIDTH);
                let dimY = parseFloat(DIM_LENGTH);
                let dimZ = parseFloat(DIM_HEIGHT);
                let amount = parseFloat(DEFAULT_VAL);
                let weightG = parseFloat(WEIGHT);
                var dBlock = await dimensionblock.chooseBox(
                  dimX,
                  dimY,
                  dimZ,
                  amount,
                  weightG,
                  repack_type
                );
                // console.log(dBlock);
                newArr = [];
                if (dBlock.DATA[0].SIZE != "-") {
                  let n = 0;
                  for (var m = 0; m < dBlock.DATA.length; m++) {
                    // console.log(dBlock.DATA[m]);
                    if (dBlock.DATA[m].SIZE == "C") {
                      newArr.pop();
                      n = n + dBlock.DATA[m].TOTAL;
                      newArr.push({ SIZE: "C", TOTAL: n });
                    } else {
                      newArr.push({
                        SIZE: dBlock.DATA[m].SIZE,
                        TOTAL: dBlock.DATA[m].TOTAL
                      });
                    }
                  }
                }
                let numPack = 0;
                let box_details = [];
                for (var kk = 0; kk < newArr.length; kk++) {
                  let algorithm = "aes-256-cbc";
                  let secretkey = "qazxswedcvfrtgb" + i + j + kk;
                  let cipher = crypto.createCipher(algorithm, secretkey);
                  var encrypted = cipher.update(Date(), "utf8", "hex");
                  encrypted += cipher.final("hex");
                  numPack = parseInt(numPack) + parseInt(newArr[kk].TOTAL);
                  if (newArr[kk].SIZE == "C") {
                    size = "C";
                    weight = 40;
                  } else if (
                    newArr[kk].SIZE == "B1" ||
                    newArr[kk].SIZE == "B2"
                  ) {
                    size = "B";
                    weight = 30;
                  } else {
                    size = "A";
                    weight = 20;
                  }
                  box_details.push({
                    amount: newArr[kk].TOTAL,
                    express: express,
                    id: encrypted,
                    repack: repack,
                    repack_size: newArr[kk].SIZE,
                    repack_type: repack_type,
                    size: size,
                    type: 0,
                    volume: 0,
                    weight: 0
                  });
                }

                DestPName = await getDescriptionBlock.getDescription(
                  DEST_PROVINCE_CODE,
                  DEST_DISTRICT_CODE
                );
                // console.log(DestPName);
                // console.log(formPName);
                descLogisTxt = await descLogisBlock.getDescription(
                  formPName,
                  DestPName,
                  0,
                  0,
                  0
                );
                arr.push({
                  sender: DP_NAME_TH,
                  SM_CODE: SM_CODE,
                  destination_district_id: DEST_DISTRICT_CODE,
                  destination_postal_code: DEST_POSTCODE,
                  destination_province_id: DEST_PROVINCE_CODE,
                  from_location_district_id: VENDER_DISTRICT_CODE,
                  from_location_postal_code: VENDER_POSTCODE,
                  from_location_province_id: VENDER_PROVINCE_CODE,
                  service_location_id: locationId,
                  bill_type: IS_RECEIVE_FROM_HOME,
                  box_amount_total: numPack,
                  box_details: box_details
                });
              }
              var pData = arr[0];
              var ok = await axios
                .post(
                  "http://ebooking.iel.co.th/services/checkPrice.php",
                  pData
                )
                .then(function(response) {
                  // console.log(response.data.data.price_details);
                  let home_total = response.data.data.home_total;
                  let loopPU = response.data.data.price_details;
                  let sumPU = 0;
                  if (loopPU.length > 0) {
                    for (var cc = 0; cc < loopPU.length; cc++) {
                      sumPU =
                        parseFloat(sumPU) + parseFloat(loopPU[cc].home_price);
                    }
                  }
                  // console.log(sumPU)
                  return { TOTAL: home_total, PU: sumPU };
                })
                .catch(function(error) {
                  console.log(error);
                });
              var D_COST = parseFloat(ok.TOTAL) - parseFloat(ok.PU);
              var PU = ok.PU;
              // console.log(D_COST);
            } else if (SEND_CODE == "S03") {
              arr = [];
              express = "Y";
              repack_type = "FR";
              if (IS_OWNER_PACKING == 0) {
                //// ielpack
                repack = true;
                repack_size = DIM_NAME_TH;
                size = DIM_NAME_TH;
                type = 0;
                volume = 0;
                volume =
                  parseFloat(DIM_HEIGHT) *
                  parseFloat(DIM_LENGTH) *
                  parseFloat(DIM_WIDTH);
                weight = parseFloat(WEIGHT) * parseFloat(DEFAULT_VAL);
                let dimX = parseFloat(DIM_WIDTH);
                let dimY = parseFloat(DIM_LENGTH);
                let dimZ = parseFloat(DIM_HEIGHT);
                let amount = parseFloat(DEFAULT_VAL);
                let weightG = parseFloat(WEIGHT);
                var dBlock = await dimensionblock.chooseBox(
                  dimX,
                  dimY,
                  dimZ,
                  amount,
                  weightG,
                  repack_type
                );
                newArr = [];
                if (dBlock.DATA[0].SIZE != "-") {
                  let n = 0;
                  for (var m = 0; m < dBlock.DATA.length; m++) {
                    // console.log(dBlock.DATA[m]);
                    if (dBlock.DATA[m].SIZE == "C") {
                      newArr.pop();
                      n = n + dBlock.DATA[m].TOTAL;
                      newArr.push({ SIZE: "C", TOTAL: n });
                    } else {
                      newArr.push({
                        SIZE: dBlock.DATA[m].SIZE,
                        TOTAL: dBlock.DATA[m].TOTAL
                      });
                    }
                  }
                }
                let numPack = 0;
                let box_details = [];
                for (var kk = 0; kk < newArr.length; kk++) {
                  let algorithm = "aes-256-cbc";
                  let secretkey = "qazxswedcvfrtgb" + i + j + kk;
                  let cipher = crypto.createCipher(algorithm, secretkey);
                  var encrypted = cipher.update(Date(), "utf8", "hex");
                  encrypted += cipher.final("hex");
                  numPack = parseInt(numPack) + parseInt(newArr[kk].TOTAL);
                  if (newArr[kk].SIZE == "C") {
                    size = "C";
                    weight = 40;
                  } else if (
                    newArr[kk].SIZE == "B1" ||
                    newArr[kk].SIZE == "B2"
                  ) {
                    size = "B";
                    weight = 30;
                  } else {
                    size = "A";
                    weight = 20;
                  }
                  box_details.push({
                    amount: newArr[kk].TOTAL,
                    express: express,
                    id: encrypted,
                    repack: repack,
                    repack_size: newArr[kk].SIZE,
                    repack_type: repack_type,
                    size: size,
                    type: 0,
                    volume: volume,
                    weight: weight
                  });
                }

                DestPName = await getDescriptionBlock.getDescription(
                  DEST_PROVINCE_CODE,
                  DEST_DISTRICT_CODE
                );
                // console.log(DestPName);
                // console.log(formPName);
                descLogisTxt = await descLogisBlock.getDescription(
                  formPName,
                  DestPName,
                  0,
                  0,
                  0
                );
                // console.log(descLogisTxt.RESULT);
                // console.log(box_details)
                // const algorithm = "aes-256-cbc";
                // const secretkey = "qazxswedcvfrtgb" + i + j + k;
                // const cipher = crypto.createCipher(algorithm, secretkey);
                // var encrypted = cipher.update(Date(), "utf8", "hex");
                // encrypted += cipher.final("hex");
                arr.push({
                  sender: DP_NAME_TH,
                  SM_CODE: SM_CODE,
                  destination_district_id: DEST_DISTRICT_CODE,
                  destination_postal_code: DEST_POSTCODE,
                  destination_province_id: DEST_PROVINCE_CODE,
                  from_location_district_id: VENDER_DISTRICT_CODE,
                  from_location_postal_code: VENDER_POSTCODE,
                  from_location_province_id: VENDER_PROVINCE_CODE,
                  service_location_id: locationId,
                  bill_type: IS_RECEIVE_FROM_HOME,
                  box_amount_total: numPack,
                  box_details: box_details
                });
                // console.log(arr)
              } else {
                //// owner pack
                repack = true;
                repack_size = "";
                type = 0;
                volume =
                  parseFloat(DIM_HEIGHT) *
                  parseFloat(DIM_LENGTH) *
                  parseFloat(DIM_WIDTH);
                weight = parseFloat(WEIGHT) * parseFloat(DEFAULT_VAL);
                // if (volume <= 50000 && weight <= 20) {
                //   size = "A";
                // } else if (volume <= 100000 && weight <= 30) {
                //   size = "B";
                // } else if (volume > 100000 || weight > 30) {
                //   size = "C";
                // }
                // const algorithm = "aes-256-cbc";
                // const secretkey = "qazxswedcvfrtgb" + i + j + k;
                // const cipher = crypto.createCipher(algorithm, secretkey);
                // var encrypted = cipher.update(Date(), "utf8", "hex");
                // encrypted += cipher.final("hex");
                let dimX = parseFloat(DIM_WIDTH);
                let dimY = parseFloat(DIM_LENGTH);
                let dimZ = parseFloat(DIM_HEIGHT);
                let amount = parseFloat(DEFAULT_VAL);
                let weightG = parseFloat(WEIGHT);
                var dBlock = await dimensionblock.chooseBox(
                  dimX,
                  dimY,
                  dimZ,
                  amount,
                  weightG,
                  repack_type
                );
                newArr = [];
                if (dBlock.DATA[0].SIZE != "-") {
                  let n = 0;
                  for (var m = 0; m < dBlock.DATA.length; m++) {
                    // console.log(dBlock.DATA[m]);
                    if (dBlock.DATA[m].SIZE == "C") {
                      newArr.pop();
                      n = n + dBlock.DATA[m].TOTAL;
                      newArr.push({ SIZE: "C", TOTAL: n });
                    } else {
                      newArr.push({
                        SIZE: dBlock.DATA[m].SIZE,
                        TOTAL: dBlock.DATA[m].TOTAL
                      });
                    }
                  }
                }
                let numPack = 0;
                let box_details = [];
                for (var kk = 0; kk < newArr.length; kk++) {
                  let algorithm = "aes-256-cbc";
                  let secretkey = "qazxswedcvfrtgb" + i + j + kk;
                  let cipher = crypto.createCipher(algorithm, secretkey);
                  var encrypted = cipher.update(Date(), "utf8", "hex");
                  encrypted += cipher.final("hex");
                  numPack = parseInt(numPack) + parseInt(newArr[kk].TOTAL);
                  if (newArr[kk].SIZE == "C") {
                    size = "C";
                    weight = 40;
                  } else if (
                    newArr[kk].SIZE == "B1" ||
                    newArr[kk].SIZE == "B2"
                  ) {
                    size = "B";
                    weight = 30;
                  } else {
                    size = "A";
                    weight = 20;
                  }
                  box_details.push({
                    amount: newArr[kk].TOTAL,
                    express: express,
                    id: encrypted,
                    repack: repack,
                    repack_size: newArr[kk].SIZE,
                    repack_type: repack_type,
                    size: size,
                    type: 0,
                    volume: volume,
                    weight: weight
                  });
                }
                // console.log(box_details);
                DestPName = await getDescriptionBlock.getDescription(
                  DEST_PROVINCE_CODE,
                  DEST_DISTRICT_CODE
                );
                // console.log(DestPName);
                // console.log(formPName);
                descLogisTxt = await descLogisBlock.getDescription(
                  formPName,
                  DestPName,
                  0,
                  0,
                  0
                );
                arr.push({
                  sender: DP_NAME_TH,
                  SM_CODE: SM_CODE,
                  destination_district_id: DEST_DISTRICT_CODE,
                  destination_postal_code: DEST_POSTCODE,
                  destination_province_id: DEST_PROVINCE_CODE,
                  from_location_district_id: VENDER_DISTRICT_CODE,
                  from_location_postal_code: VENDER_POSTCODE,
                  from_location_province_id: VENDER_PROVINCE_CODE,
                  service_location_id: locationId,
                  bill_type: IS_RECEIVE_FROM_HOME,
                  box_amount_total: numPack,
                  box_details: box_details
                });
              }
              // console.log(arr);
              var pData = arr[0];
              var ok = await axios
                .post(
                  "http://ebooking.iel.co.th/services/checkPrice.php",
                  pData
                )
                .then(function(response) {
                  // console.log(response.data.data.price_details);
                  let home_total = response.data.data.home_total;
                  let loopPU = response.data.data.price_details;
                  let sumPU = 0;
                  if (loopPU.length > 0) {
                    for (var cc = 0; cc < loopPU.length; cc++) {
                      sumPU =
                        parseFloat(sumPU) + parseFloat(loopPU[cc].home_price);
                    }
                  }
                  // console.log(sumPU)
                  return { TOTAL: home_total, PU: sumPU };
                })
                .catch(function(error) {
                  console.log(error);
                });
              var D_COST = parseFloat(ok.TOTAL) - parseFloat(ok.PU);
              var PU = ok.PU;
              // console.log(D_COST)
              // console.log(PU)
            }
          } else {
            var D_COST = 150 * parseFloat(DEFAULT_VAL);
          }
          // console.log(IS_RECEIVE_FROM_HOME)
          // console.log(D_COST)
          // console.log(PU)
          var SHIPTO_FNAME = F_NAME;
          var SHIPTO_LNAME = L_NAME;
          var SHIPTO_PHONE = PHONE;
          var SHIPTO_ADDRESS_NO = DEST_ADDRESS_NO;
          var SHIPTO_DISTRICT = DEST_DISTRICT_NAME_TH;
          var SHIPTO_PROVINCE = DEST_PROVINCE_NAME_TH;
          var SHIPTO_POSTCODE = DEST_POSTCODE;
          var DEVIVERY_PROVIDER = DP_NAME_TH;
          var DELIVERY_DESC = SM_CODE;
          var DELIVERY_TYPE = SEND_CODE;
          // var IS_RECEIVE_FROM_HOME_FLAG = IS_RECEIVE_FROM_HOME;
          var DELIVERY_COST = D_COST;
          var PU = PU;
          dataArr.push({
            SHOP_CODE: SHOP_CODE,
            GOODS_CODE: GOODS_CODE,
            DEFAULT_VAL: DEFAULT_VAL,
            PRICE: PRICE,
            SHIPTO_FNAME: SHIPTO_FNAME,
            SHIPTO_LNAME: SHIPTO_LNAME,
            SHIPTO_PHONE: SHIPTO_PHONE,
            SHIPTO_ADDRESS_NO: SHIPTO_ADDRESS_NO,
            SHIPTO_DISTRICT: SHIPTO_DISTRICT,
            SHIPTO_PROVINCE: SHIPTO_PROVINCE,
            SHIPTO_POSTCODE: SHIPTO_POSTCODE,
            DEVIVERY_PROVIDER: DEVIVERY_PROVIDER,
            DELIVERY_DESC: DELIVERY_DESC,
            DELIVERY_TYPE: DELIVERY_TYPE,
            DELIVERY_COST: DELIVERY_COST,
            IS_RECEIVE_FROM_HOME: IS_RECEIVE_FROM_HOME,
            PU: PU,
            DETAIL_BOX: arr[0].box_details
          });
        }
      }
    }
    // console.log(dataArr[0].DETAIL_BOX)
    qArr = [];
    pArr = [];
    q = `SELECT "SO_CODE" FROM "T_SALEORDER_HEADER" WHERE cast("SO_CREATE_AT" as date) = CAST(NOW() as date)
    and "MEM_CODE" =$1 order by "SO_CODE" desc limit 1`;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    if (rows.length == 0) {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      SO_CODE = "SO" + MEM_CODE + year + month + date + "01";
    } else {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      OLD_SO_CODE = rows[0].SO_CODE;
      lastIndex =
        parseInt(
          OLD_SO_CODE.substring(OLD_SO_CODE.length - 2, OLD_SO_CODE.length)
        ) + 1;
      if (lastIndex <= 9) {
        lastIndex = ("0" + lastIndex).slice(-2).toString();
      } else {
        lastIndex = lastIndex.toString();
      }
      SO_CODE = "SO" + MEM_CODE + year + month + date + lastIndex;
    }
    console.log(SO_CODE);

    q = `SELECT "BILL_ITEM_CODE" FROM "T_SALEORDER_BILLING_ITEM" WHERE cast("CREATE_AT" as date) = CAST(NOW() as date)
    and "MEM_CODE" =$1 order by "BILL_ITEM_CODE" desc limit 1`;

    var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
    if (rows.length == 0) {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      BILL_ITEM_CODE = "BI" + MEM_CODE + year + month + date + "01";
      BILL_SEND_CODE = "BS" + MEM_CODE + year + month + date + "01";
    } else {
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      OLD_BILL_ITEM_CODE = rows[0].BILL_ITEM_CODE;
      lastIndex =
        parseInt(
          OLD_BILL_ITEM_CODE.substring(
            OLD_BILL_ITEM_CODE.length - 2,
            OLD_BILL_ITEM_CODE.length
          )
        ) + 1;
      if (lastIndex <= 9) {
        lastIndex = ("0" + lastIndex).slice(-2).toString();
      } else {
        lastIndex = lastIndex.toString();
      }
      BILL_ITEM_CODE = "BI" + MEM_CODE + year + month + date + lastIndex;
      BILL_SEND_CODE = "BS" + MEM_CODE + year + month + date + lastIndex;
    }
    const billitem = [];
    const billsend = [];
    if (dataArr.length == 1) {
      billitem.push(BILL_ITEM_CODE);
      billsend.push(BILL_SEND_CODE);
    } else {
      billitem.push(BILL_ITEM_CODE);
      billsend.push(BILL_SEND_CODE);
      var d = new Date();
      var date = d.getDate();
      date = ("0" + date).slice(-2).toString();
      var month = d.getMonth() + 1;
      month = ("0" + month).slice(-2).toString();
      var str = d.getFullYear().toString();
      var year = str.substring(str.length - 2, str.length);
      lastIndex = parseInt(
        BILL_ITEM_CODE.substring(
          BILL_ITEM_CODE.length - 2,
          BILL_ITEM_CODE.length
        )
      );
      for (var i = 0; i < dataArr.length - 1; i++) {
        lastIndex = parseInt(lastIndex) + 1;
        if (lastIndex <= 9) {
          lastIndex = ("0" + lastIndex).slice(-2).toString();
        } else {
          lastIndex = lastIndex.toString();
        }
        BILL_ITEM_CODE = "BI" + MEM_CODE + year + month + date + lastIndex;
        BILL_SEND_CODE = "BS" + MEM_CODE + year + month + date + lastIndex;
        billitem.push(BILL_ITEM_CODE);
        billsend.push(BILL_SEND_CODE);
      }
    }
    console.log(billitem);
    console.log(billsend);
    /////////// insert bill all  ///////////////
    let SUM_PRICE = 0;
    for (var i = 0; i < dataArr.length; i++) {
      var SHOP_CODE = dataArr[i]["SHOP_CODE"];
      var GOODS_CODE = dataArr[i]["GOODS_CODE"];
      var DEFAULT_VAL = dataArr[i]["DEFAULT_VAL"];
      var PRICE = dataArr[i]["PRICE"];
      var SHIPTO_FNAME = dataArr[i]["SHIPTO_FNAME"];
      var SHIPTO_LNAME = dataArr[i]["SHIPTO_LNAME"];
      var SHIPTO_PHONE = dataArr[i]["SHIPTO_PHONE"];
      var SHIPTO_ADDRESS_NO = dataArr[i]["SHIPTO_ADDRESS_NO"];
      var SHIPTO_DISTRICT = dataArr[i]["SHIPTO_DISTRICT"];
      var SHIPTO_PROVINCE = dataArr[i]["SHIPTO_PROVINCE"];
      var SHIPTO_POSTCODE = dataArr[i]["SHIPTO_POSTCODE"];
      var DEVIVERY_PROVIDER = dataArr[i]["DEVIVERY_PROVIDER"];
      var DELIVERY_DESC = dataArr[i]["DELIVERY_DESC"];
      var DELIVERY_TYPE = dataArr[i]["DELIVERY_TYPE"];
      var DELIVERY_COST = dataArr[i]["DELIVERY_COST"];
      var PU = dataArr[i]["PU"];
      var IS_RECEIVE_FROM_HOME = dataArr[i]["IS_RECEIVE_FROM_HOME"];
      var BOX = dataArr[i]["DETAIL_BOX"];
      // console.log(BOX)
      for (var j = 0; j < BOX.length; j++) {
        // console.log(BOX[j])
        q = `INSERT INTO public."T_SALEORDER_BILLING_ITEM_BOX"(
          "SO_CODE", "BILL_ITEM_CODE", "SHOP_CODE", "GOODS_CODE", "REPACK",
           "REPACK_SIZE", "REPACK_TYPE", "TYPE_ITEM", "VOL_ITEM", "WEIGHT_ITEM",
            "AMOUNT_BOX","EXPRESS","SIZE")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13)`;
        qArr.push(q);
        let repack_flag =0
        if(BOX[j].repack==true){
          repack_flag = 1
        }else{
          repack_flag = 0
        }
        p = [
          SO_CODE,
          billitem[i],
          SHOP_CODE,
          GOODS_CODE,
          repack_flag,
          BOX[j].repack_size,
          BOX[j].repack_type,
          BOX[j].type,
          BOX[j].volume,
          BOX[j].weight,
          BOX[j].amount,
          BOX[j].express,
          BOX[j].size
        ];
        pArr.push(p);
      }
      SUM_PRICE = parseFloat(PRICE);
      q = `INSERT INTO public."T_SALEORDER_BILLING_ITEM"(
            "SO_CODE", "BILL_ITEM_CODE", "SHOP_CODE", "GOODS_CODE", "AMOUNT",
            "SUM_PRICE", "BILL_SEND_CODE", "BILL_STATUS", "MEM_CODE",
            "CREATE_AT", "CREATE_BY")
            VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, NOW(), $9);`;
      qArr.push(q);
      p = [
        SO_CODE,
        billitem[i],
        SHOP_CODE,
        GOODS_CODE,
        DEFAULT_VAL,
        SUM_PRICE,
        billsend[i],
        MEM_CODE,
        MEM_CODE
      ];
      pArr.push(p);

      q = `INSERT INTO public."T_SALEORDER_BILLING_SEND"(
            "SO_CODE", "BILL_SEND_CODE", "DELIVERY_HOST", "DELIVERY_COST", "MEM_CODE",
            "SHIPTO_ADDRESS_NO", "SHIPTO_DISTRICT", "SHIPTO_PROVINCE", "SHIPTO_POSTCODE", "DELIVERY_DESC",
            "DELIVERY_TYPE", "SHIPTO_FNAME", "SHIPTO_LNAME", "SHIPTO_PHONE", "CREATE_AT", "CREATE_BY","DELIVERY_STATUS",
            "DELIVERY_END_STATUS","DELIVERY_RECEIVE_FROM_HOME_COST","DELIVERY_RECEIVE_FROM_HOME_TYPE")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), $15,1,1,$16,$17);`;
      qArr.push(q);
      p = [
        SO_CODE,
        billsend[i],
        DEVIVERY_PROVIDER,
        DELIVERY_COST,
        MEM_CODE,
        SHIPTO_ADDRESS_NO,
        SHIPTO_DISTRICT,
        SHIPTO_PROVINCE,
        SHIPTO_POSTCODE,
        DELIVERY_DESC,
        DELIVERY_TYPE,
        SHIPTO_FNAME,
        SHIPTO_LNAME,
        SHIPTO_PHONE,
        MEM_CODE,
        PU,
        IS_RECEIVE_FROM_HOME
      ];
      pArr.push(p);

      q = `DELETE FROM public."T_CART_HISTORY"
        WHERE "MEM_CODE" = $1 and "GOODS_CODE" =$2 and "SHOP_CODE" = $3`;
      qArr.push(q);
      p = [MEM_CODE, GOODS_CODE, SHOP_CODE];
      pArr.push(p);
    }
    // console.log(qArr)
    // console.log(pArr)
    if (OPTION.length > 0) {
      for (var k = 0; k < OPTION.length; k++) {
        q = `INSERT INTO public."T_SALEORDER_PROMOTION"(
          "SO_CODE", "TYPE_PROMOTION", "PROMOTION_DESC", "SHOP_CODE", "DATA_VAL")
          VALUES ($1, $2, $3, $4, $5);`;
        qArr.push(q);
        p = [
          SO_CODE,
          OPTION[k].TYPE,
          OPTION[k].OPTION_DESC,
          OPTION[k].SHOP_CODE,
          OPTION[k].VALUE
        ];
        pArr.push(p);
      }
    }
    q = `INSERT INTO public."T_SALEORDER_HEADER"(
      "SO_CODE", "SO_CREATE_AT", "SO_CREATE_BY", "SO_STATUS", "MEM_CODE")
      VALUES ($1, NOW(), $2, 1, $3);`;
    qArr.push(q);
    p = [SO_CODE, MEM_CODE, MEM_CODE];
    pArr.push(p);
    let qArr1 = [];
    let pArr1 = [];
    if (Object.keys(QR).length > 0) {
      let headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "x-api-key": "skey_test_308ZCKfxf5O16fMmClAtI7wqXlRxfwCsuwM"
      };
      let body = JSON.stringify({
        amount: QR.amount,
        currency: QR.currency,
        source_type: QR.source_type,
        reference_order: SO_CODE
      });
      request.post(
        {
          url:
            "https://dev-kpaymentgateway-services.kasikornbank.com/qr/v2/order",
          headers: headers,
          body: body
        },
        async (err, res, body) => {
          var jsonData = JSON.parse(body);
          var REF_BANK = jsonData["id"];
          q = `INSERT INTO public."T_SALEORDER_PAYMENT"(
      "SO_CODE","PAYMENT_TYPE","PAYMENT_STATUS", "CREATE_AT", "LASTUPDATE_AT","PAYMENT_TEMP")
      VALUES ($1,$2, 1, NOW(), NOW(),$3);`;
          await qArr.push(q);
          p = [SO_CODE, PAYMENT_TYPE, REF_BANK];
          await pArr.push(p);
          await queryFunc.queryAction(qArr, pArr);
          resp.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
        }
      );
    } else {
      q = `INSERT INTO public."T_SALEORDER_PAYMENT"(
        "SO_CODE","PAYMENT_TYPE","PAYMENT_STATUS", "CREATE_AT", "LASTUPDATE_AT")
        VALUES ($1,$2, 1, NOW(), NOW());`;
      qArr.push(q);
      p = [SO_CODE, PAYMENT_TYPE];
      pArr.push(p);
      await queryFunc.queryAction(qArr, pArr);
      q = `SELECT COUNT(*) as TOTAL FROM "T_CART_HISTORY" WHERE "MEM_CODE" = $1`;
      var { rows } = await queryFunc.queryRow(q, [MEM_CODE]);
      var COUNT_CART = { COUNT_CART: rows[0]["total"] };
      resp.status(200).send({ STATUS: 1, RESULT: COUNT_CART });
    }
    // resp.status(200).send({ STATUS: 1, RESULT: 1 });
  } catch (err) {
    logger.error("Database:::::::" + err);
    resp.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function getCart(req, res, ip) {
  try {
    const arrResult = [];
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
        ,case when "M_SHOP"."DC_LOCATION_ID" IS NULL then '0'
 		else "M_SHOP"."DC_LOCATION_ID" end
        ,"G_DIMENSION"."DIM_NAME_TH"
		,case when "G_DIMENSION"."DIM_HEIGHT" IS NULL then '0'
 		else "G_DIMENSION"."DIM_HEIGHT" end
		,case when "G_DIMENSION"."DIM_LENGTH" IS NULL then '0'
 		else "G_DIMENSION"."DIM_LENGTH" end
		,case when "G_DIMENSION"."DIM_WIDTH" IS NULL then '0'
         else "G_DIMENSION"."DIM_WIDTH" end
         ,case when "M_GOODS"."GOODS_DIM_X" IS NULL then '0'
        else "M_GOODS"."GOODS_DIM_X" end
		,case when "M_GOODS"."GOODS_DIM_Y" IS NULL then '0'
        else "M_GOODS"."GOODS_DIM_Y" end
		,case when "M_GOODS"."GOODS_DIM_Z" IS NULL then '0'
        else "M_GOODS"."GOODS_DIM_Z" end
        ,case when "M_GOODS"."SUM_WEIGHT" IS NULL then '0'
        else "M_GOODS"."SUM_WEIGHT" end
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
        where "T_CART_HISTORY"."MEM_CODE" =$1 and "T_CART_HISTORY"."IS_ACTIVE" =2

        order by "M_GOODS"."SHOP_CODE" asc ,"M_GOODS"."SEND_CODE" asc,"M_GOODS"."GOODS_CODE" asc`;

    var { rows } = await queryFunc.queryRow(q, [req]);
    // console.log(rows)
    rows.map((data, index) => {
      img = ip + "/api/img/" + "uploads" + "/" + data["img_path"];
      distt = parseFloat(data["PRICE"]) * parseFloat(data["DEFAULT_VAL"]);
      if (data["DISCOUNT_TYPE"] == 1) {
        disct = "PERCENT";
        distl = data["DISCOUNT_VALUE"].toString() + " %";

        distv = distt - (distt * parseInt(data["DISCOUNT_VALUE"])) / 100;
      } else if (data["DISCOUNT_TYPE"] == 2) {
        disct = "BATH";
        distl = data["DISCOUNT_VALUE"].toString() + " บาท";
        distv = distt - parseFloat(data["DISCOUNT_VALUE"]);
      } else {
        disct = "0";
        distl = "0";
        distv = distt - parseFloat(data["DISCOUNT_VALUE"]);
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
        PRICE: distt,
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
        DIM_HEIGHT: data["GOODS_DIM_Z"],
        DIM_LENGTH: data["GOODS_DIM_Y"],
        DIM_WIDTH: data["GOODS_DIM_X"],
        IS_DEMAND: IS_DEMAND,
        WEIGHT: data["SUM_WEIGHT"],
        DC_LOCATION_ID: data["DC_LOCATION_ID"]
      });
    });
    // console.log(arrResult.length)
    let arrHead = [];
    let arrDetail = [];
    let garrAll = [];
    let itemArr = [];
    if (arrResult.length > 0) {
      //     if(arrResult.length==1){
      //         let i =0
      //         arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //         arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //         TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']});
      //         // garrAll.push({HEAD:arrHead,DETAIL:arrDetail})
      //         garrAll.push({DETAIL:arrDetail})
      //     }else{
      //         for(var i =0; i< arrResult.length;i++){
      //             if(i==0){
      //                 arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                 arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                 TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']});
      //             }else if(i==arrResult.length-1){
      //                 if(arrResult[i]['SHOP_CODE']==arrResult[i-1]['SHOP_CODE']){
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']});
      //                     // garrAll.push({HEAD:arrHead,DETAIL:arrDetail})
      //                     garrAll.push({DETAIL:arrDetail})
      //                 }else{
      //                     // garrAll.push({HEAD:arrHead,DETAIL:arrDetail})
      //                     garrAll.push({DETAIL:arrDetail})
      //                     arrHead=[]
      //                     arrDetail=[]
      //                     arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']});
      //                     // garrAll.push({HEAD:arrHead,DETAIL:arrDetail})
      //                     garrAll.push({DETAIL:arrDetail})
      //                 }
      //             }else{
      //                 if(arrResult[i]['SHOP_CODE']==arrResult[i-1]['SHOP_CODE']){
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']});
      //                 }else{
      //                     // garrAll.push({HEAD:arrHead,DETAIL:arrDetail})
      //                     garrAll.push({DETAIL:arrDetail})
      //                     arrHead=[]
      //                     arrDetail=[]
      //                     arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']});
      //                 }

      //             }
      //         }
      //     }

      // if(arrResult.length==1){
      //     let i =0
      //     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //     garrAll.push({DETAIL:itemArr})
      // }else{
      //     for(var i =0; i< arrResult.length;i++){
      //         if(i==0){
      //             arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //             TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //             ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //             ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //             ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //             ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //         }else if(i==arrResult.length-1){
      //             if(arrResult[i]['SHOP_CODE']==arrResult[i-1]['SHOP_CODE']){
      //                 if(arrResult[i]['SEND_CODE']==arrResult[i-1]['SEND_CODE']){
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //                     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 }else{
      //                     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                     arrDetail =[]
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //                     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 }
      //                 garrAll.push({DETAIL:itemArr})

      //             }else{
      //                 itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 garrAll.push({DETAIL:itemArr})
      //                 arrHead=[]
      //                 arrDetail=[]
      //                 itemArr=[]
      //                 arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                 arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                 TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                 ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                 ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                 ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                 ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //                 itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 garrAll.push({DETAIL:itemArr})
      //             }
      //         }else{
      //             if(arrResult[i]['SHOP_CODE']==arrResult[i-1]['SHOP_CODE']){
      //                 if(arrResult[i]['SEND_CODE']==arrResult[i-1]['SEND_CODE']){
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //                 }else{
      //                     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                     arrDetail =[]
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //                 }
      //             }else{
      //                 itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 garrAll.push({DETAIL:itemArr})
      //                 arrHead=[]
      //                 arrDetail=[]
      //                 itemArr=[]
      //                 arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                 arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                 TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                 ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                 ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                 ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                 ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //             }

      //         }
      //     }
      // }
      // if(arrResult.length==1){
      //     let i =0
      //     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i]['IS_DEMAND']
      //     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //     garrAll.push({DETAIL:itemArr})
      // }else{
      //     for(var i =0; i< arrResult.length;i++){
      //         if(i==0){
      //             arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //             TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //             ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //             ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //             ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //             ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //         }else if(i==arrResult.length-1){
      //             if(arrResult[i]['SHOP_CODE']==arrResult[i-1]['SHOP_CODE']){
      //                 if(arrResult[i]['SEND_CODE']==arrResult[i-1]['SEND_CODE']){
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //                     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //                     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //                     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i]['IS_DEMAND'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 }else{
      //                     itemArr.push({SHOP_CODE:arrResult[i-1]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i-1]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i-1]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i-1]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i-1]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i-1]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i-1]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i-1]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i-1]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i-1]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i-1]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i-1]['IS_DEMAND']
      //                     ,SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                     arrDetail =[]
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //                     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //                     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //                     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i]['IS_DEMAND'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 }
      //                 garrAll.push({DETAIL:itemArr})

      //             }else{
      //                 iitemArr.push({SHOP_CODE:arrResult[i-1]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i-1]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i-1]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i-1]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i-1]['DISTRICT_NAME_TH']
      //                 ,PROVINCE_CODE:arrResult[i-1]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i-1]['PROVINCE_NAME_TH']
      //                 ,POSTCODE:arrResult[i-1]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i-1]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i-1]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i-1]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i-1]['IS_DEMAND']
      //                 ,SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 garrAll.push({DETAIL:itemArr})
      //                 arrHead=[]
      //                 arrDetail=[]
      //                 itemArr=[]
      //                 arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                 arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                 TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                 ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                 ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
      //                 ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
      //                 ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME']});
      //                 itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],IS_DEMAND:arrResult[i]['IS_DEMAND'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 garrAll.push({DETAIL:itemArr})
      //             }
      //         }else{
      //             if(arrResult[i]['SHOP_CODE']==arrResult[i-1]['SHOP_CODE']){
      //                 if(arrResult[i]['SEND_CODE']==arrResult[i-1]['SEND_CODE']){
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //                     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //                     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //                 }else{
      //                     itemArr.push({SHOP_CODE:arrResult[i-1]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i-1]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i-1]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i-1]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i-1]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i-1]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i-1]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i-1]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i-1]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i-1]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i-1]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i-1]['IS_DEMAND']
      //                     ,SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                     arrDetail =[]
      //                     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //                     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //                     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //                 }
      //             }else{
      //                 itemArr.push({SHOP_CODE:arrResult[i-1]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i-1]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i-1]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i-1]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i-1]['DISTRICT_NAME_TH']
      //                     ,PROVINCE_CODE:arrResult[i-1]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i-1]['PROVINCE_NAME_TH']
      //                     ,POSTCODE:arrResult[i-1]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i-1]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i-1]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i-1]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i-1]['IS_DEMAND']
      //                     ,SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
      //                 garrAll.push({DETAIL:itemArr})
      //                 arrHead=[]
      //                 arrDetail=[]
      //                 itemArr=[]
      //                 arrHead.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH']})
      //                 arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
      //                 TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
      //                 ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
      //                 ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
      //                 ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
      //                 ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH']});
      //             }

      //         }
      //     }
      // }
      let sum_item = 0;
      // console.log(arrResult)
      if (arrResult.length == 1) {
        let i = 0;
        arrDetail.push({
          SHOP_CODE: arrResult[i]["SHOP_CODE"],
          SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
          GOODS_CODE: arrResult[i]["GOODS_CODE"],
          SHOP_CODE: arrResult[i]["SHOP_CODE"],
          CATE_CODE: arrResult[i]["CATE_CODE"],
          SUB_CATE_CODE: arrResult[i]["SUB_CATE_CODE"],
          GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
          TYPE_CATE_CODE: arrResult[i]["TYPE_CATE_CODE"],
          TYPE_CATE_NAME_TH: arrResult[i]["TYPE_CATE_NAME_TH"],
          DEFAULT_VAL: arrResult[i]["DEFAULT_VAL"],
          SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
          UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
          PRICE: arrResult[i]["PRICE"],
          IMG_PATH: arrResult[i]["IMG_PATH"],
          IS_ACTIVE: true,
          SEND_CODE: arrResult[i]["SEND_CODE"],
          SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
          DISCOUNT_LABEL: arrResult[i]["DISCOUNT_LABEL"],
          DISCOUNT_MODE: arrResult[i]["DISCOUNT_MODE"],
          DISCOUNT_VAL: arrResult[i]["DISCOUNT_VAL"],
          DIM_NAME_TH: arrResult[i]["DIM_NAME_TH"],
          DIM_HEIGHT: arrResult[i]["DIM_HEIGHT"],
          DIM_LENGTH: arrResult[i]["DIM_LENGTH"],
          DIM_WIDTH: arrResult[i]["DIM_WIDTH"],
          WEIGHT: arrResult[i]["WEIGHT"]
        });
        itemArr.push({
          SHOP_CODE: arrResult[i]["SHOP_CODE"],
          SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
          SHOP_ADDRESS_NO: arrResult[i]["SHOP_ADDRESS_NO"],
          DISTRICT_CODE: arrResult[i]["DISTRICT_CODE"],
          DISTRICT_NAME_TH: arrResult[i]["DISTRICT_NAME_TH"],
          PROVINCE_CODE: arrResult[i]["PROVINCE_CODE"],
          PROVINCE_NAME_TH: arrResult[i]["PROVINCE_NAME_TH"],
          POSTCODE: arrResult[i]["POSTCODE"],
          IS_ACTIVE_LALAMOVE: arrResult[i]["IS_ACTIVE_LALAMOVE"],
          IS_OWNER_PACKING: arrResult[i]["IS_OWNER_PACKING"],
          IS_RECEIVE_FROM_HOME: arrResult[i]["IS_RECEIVE_FROM_HOME"],
          IS_DEMAND: arrResult[i]["IS_DEMAND"],
          SEND_CODE: arrResult[i]["SEND_CODE"],
          SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
          DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
          ITEM: arrDetail
        });
        garrAll.push({ DETAIL: itemArr });
        sum_item = arrResult[i]["DISCOUNT_VAL"];
        // console.log(arrResult[i]["DISCOUNT_VAL"])
      } else {
        for (var i = 0; i < arrResult.length; i++) {
          // console.log(arrResult[i]["DEFAULT_VAL"])
          sum_item =
            parseFloat(sum_item) + parseFloat(arrResult[i]["DISCOUNT_VAL"]);
          if (i == 0) {
            arrDetail.push({
              SHOP_CODE: arrResult[i]["SHOP_CODE"],
              SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
              GOODS_CODE: arrResult[i]["GOODS_CODE"],
              SHOP_CODE: arrResult[i]["SHOP_CODE"],
              CATE_CODE: arrResult[i]["CATE_CODE"],
              SUB_CATE_CODE: arrResult[i]["SUB_CATE_CODE"],
              GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
              TYPE_CATE_CODE: arrResult[i]["TYPE_CATE_CODE"],
              TYPE_CATE_NAME_TH: arrResult[i]["TYPE_CATE_NAME_TH"],
              DEFAULT_VAL: arrResult[i]["DEFAULT_VAL"],
              SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
              UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
              PRICE: arrResult[i]["PRICE"],
              IMG_PATH: arrResult[i]["IMG_PATH"],
              IS_ACTIVE: true,
              SEND_CODE: arrResult[i]["SEND_CODE"],
              SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
              DISCOUNT_LABEL: arrResult[i]["DISCOUNT_LABEL"],
              DISCOUNT_MODE: arrResult[i]["DISCOUNT_MODE"],
              DISCOUNT_VAL: arrResult[i]["DISCOUNT_VAL"],
              DIM_NAME_TH: arrResult[i]["DIM_NAME_TH"],
              DIM_HEIGHT: arrResult[i]["DIM_HEIGHT"],
              DIM_LENGTH: arrResult[i]["DIM_LENGTH"],
              DIM_WIDTH: arrResult[i]["DIM_WIDTH"],
              WEIGHT: arrResult[i]["WEIGHT"]
            });
          } else if (i == arrResult.length - 1) {
            if (
              arrResult[i]["SHOP_CODE"] == arrResult[i - 1]["SHOP_CODE"] &&
              arrResult[i]["SEND_CODE"] == arrResult[i - 1]["SEND_CODE"]
            ) {
              // if(arrResult[i]['SEND_CODE']==arrResult[i-1]['SEND_CODE']){
              arrDetail.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                CATE_CODE: arrResult[i]["CATE_CODE"],
                SUB_CATE_CODE: arrResult[i]["SUB_CATE_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                TYPE_CATE_CODE: arrResult[i]["TYPE_CATE_CODE"],
                TYPE_CATE_NAME_TH: arrResult[i]["TYPE_CATE_NAME_TH"],
                DEFAULT_VAL: arrResult[i]["DEFAULT_VAL"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                PRICE: arrResult[i]["PRICE"],
                IMG_PATH: arrResult[i]["IMG_PATH"],
                IS_ACTIVE: true,
                SEND_CODE: arrResult[i]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
                DISCOUNT_LABEL: arrResult[i]["DISCOUNT_LABEL"],
                DISCOUNT_MODE: arrResult[i]["DISCOUNT_MODE"],
                DISCOUNT_VAL: arrResult[i]["DISCOUNT_VAL"],
                DIM_NAME_TH: arrResult[i]["DIM_NAME_TH"],
                DIM_HEIGHT: arrResult[i]["DIM_HEIGHT"],
                DIM_LENGTH: arrResult[i]["DIM_LENGTH"],
                DIM_WIDTH: arrResult[i]["DIM_WIDTH"],
                WEIGHT: arrResult[i]["WEIGHT"]
              });
              itemArr.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                SHOP_ADDRESS_NO: arrResult[i]["SHOP_ADDRESS_NO"],
                DISTRICT_CODE: arrResult[i]["DISTRICT_CODE"],
                DISTRICT_NAME_TH: arrResult[i]["DISTRICT_NAME_TH"],
                PROVINCE_CODE: arrResult[i]["PROVINCE_CODE"],
                PROVINCE_NAME_TH: arrResult[i]["PROVINCE_NAME_TH"],
                POSTCODE: arrResult[i]["POSTCODE"],
                IS_ACTIVE_LALAMOVE: arrResult[i]["IS_ACTIVE_LALAMOVE"],
                IS_OWNER_PACKING: arrResult[i]["IS_OWNER_PACKING"],
                IS_RECEIVE_FROM_HOME: arrResult[i]["IS_RECEIVE_FROM_HOME"],
                IS_DEMAND: arrResult[i]["IS_DEMAND"],
                SEND_CODE: arrResult[i]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
                DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
                ITEM: arrDetail
              });
              // }else{
              //     itemArr.push({SHOP_CODE:arrResult[i-1]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i-1]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i-1]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i-1]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i-1]['DISTRICT_NAME_TH']
              //     ,PROVINCE_CODE:arrResult[i-1]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i-1]['PROVINCE_NAME_TH']
              //     ,POSTCODE:arrResult[i-1]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i-1]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i-1]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i-1]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i-1]['IS_DEMAND']
              //     ,SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
              //     arrDetail =[]
              //     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
              //     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
              //     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
              //     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
              //     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
              //     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH'],WEIGHT:arrResult[i]['WEIGHT']});
              //     itemArr.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i]['DISTRICT_NAME_TH']
              //     ,PROVINCE_CODE:arrResult[i]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i]['PROVINCE_NAME_TH']
              //     ,POSTCODE:arrResult[i]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i]['IS_DEMAND'],SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH'],ITEM:arrDetail})
              // }
              garrAll.push({ DETAIL: itemArr });
            } else {
              itemArr.push({
                SHOP_CODE: arrResult[i - 1]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i - 1]["SHOP_NAME_TH"],
                SHOP_ADDRESS_NO: arrResult[i - 1]["SHOP_ADDRESS_NO"],
                DISTRICT_CODE: arrResult[i - 1]["DISTRICT_CODE"],
                DISTRICT_NAME_TH: arrResult[i - 1]["DISTRICT_NAME_TH"],
                PROVINCE_CODE: arrResult[i - 1]["PROVINCE_CODE"],
                PROVINCE_NAME_TH: arrResult[i - 1]["PROVINCE_NAME_TH"],
                POSTCODE: arrResult[i - 1]["POSTCODE"],
                IS_ACTIVE_LALAMOVE: arrResult[i - 1]["IS_ACTIVE_LALAMOVE"],
                IS_OWNER_PACKING: arrResult[i - 1]["IS_OWNER_PACKING"],
                IS_RECEIVE_FROM_HOME: arrResult[i - 1]["IS_RECEIVE_FROM_HOME"],
                IS_DEMAND: arrResult[i - 1]["IS_DEMAND"],
                SEND_CODE: arrResult[i - 1]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i - 1]["SEND_NAME_TH"],
                DC_LOCATION_ID: arrResult[i - 1]["DC_LOCATION_ID"],
                ITEM: arrDetail
              });
              garrAll.push({ DETAIL: itemArr });
              arrHead = [];
              arrDetail = [];
              itemArr = [];
              arrHead.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"]
              });
              arrDetail.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                CATE_CODE: arrResult[i]["CATE_CODE"],
                SUB_CATE_CODE: arrResult[i]["SUB_CATE_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                TYPE_CATE_CODE: arrResult[i]["TYPE_CATE_CODE"],
                TYPE_CATE_NAME_TH: arrResult[i]["TYPE_CATE_NAME_TH"],
                DEFAULT_VAL: arrResult[i]["DEFAULT_VAL"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                PRICE: arrResult[i]["PRICE"],
                IMG_PATH: arrResult[i]["IMG_PATH"],
                IS_ACTIVE: true,
                SEND_CODE: arrResult[i]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
                DISCOUNT_LABEL: arrResult[i]["DISCOUNT_LABEL"],
                DISCOUNT_MODE: arrResult[i]["DISCOUNT_MODE"],
                DISCOUNT_VAL: arrResult[i]["DISCOUNT_VAL"],
                DIM_NAME_TH: arrResult[i]["DIM_NAME_TH"],
                DIM_HEIGHT: arrResult[i]["DIM_HEIGHT"],
                DIM_LENGTH: arrResult[i]["DIM_LENGTH"],
                DIM_WIDTH: arrResult[i]["DIM_WIDTH"],
                WEIGHT: arrResult[i]["WEIGHT"]
              });
              itemArr.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                SHOP_ADDRESS_NO: arrResult[i]["SHOP_ADDRESS_NO"],
                DISTRICT_CODE: arrResult[i]["DISTRICT_CODE"],
                DISTRICT_NAME_TH: arrResult[i]["DISTRICT_NAME_TH"],
                PROVINCE_CODE: arrResult[i]["PROVINCE_CODE"],
                PROVINCE_NAME_TH: arrResult[i]["PROVINCE_NAME_TH"],
                POSTCODE: arrResult[i]["POSTCODE"],
                IS_ACTIVE_LALAMOVE: arrResult[i]["IS_ACTIVE_LALAMOVE"],
                IS_OWNER_PACKING: arrResult[i]["IS_OWNER_PACKING"],
                IS_RECEIVE_FROM_HOME: arrResult[i]["IS_RECEIVE_FROM_HOME"],
                IS_DEMAND: arrResult[i]["IS_DEMAND"],
                SEND_CODE: arrResult[i]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
                DC_LOCATION_ID: arrResult[i]["DC_LOCATION_ID"],
                ITEM: arrDetail
              });
              garrAll.push({ DETAIL: itemArr });
            }
          } else {
            if (
              arrResult[i]["SHOP_CODE"] == arrResult[i - 1]["SHOP_CODE"] &&
              arrResult[i]["SEND_CODE"] == arrResult[i - 1]["SEND_CODE"]
            ) {
              // if(arrResult[i]['SEND_CODE']==arrResult[i-1]['SEND_CODE']){
              arrDetail.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                CATE_CODE: arrResult[i]["CATE_CODE"],
                SUB_CATE_CODE: arrResult[i]["SUB_CATE_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                TYPE_CATE_CODE: arrResult[i]["TYPE_CATE_CODE"],
                TYPE_CATE_NAME_TH: arrResult[i]["TYPE_CATE_NAME_TH"],
                DEFAULT_VAL: arrResult[i]["DEFAULT_VAL"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                PRICE: arrResult[i]["PRICE"],
                IMG_PATH: arrResult[i]["IMG_PATH"],
                IS_ACTIVE: true,
                SEND_CODE: arrResult[i]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
                DISCOUNT_LABEL: arrResult[i]["DISCOUNT_LABEL"],
                DISCOUNT_MODE: arrResult[i]["DISCOUNT_MODE"],
                DISCOUNT_VAL: arrResult[i]["DISCOUNT_VAL"],
                DIM_NAME_TH: arrResult[i]["DIM_NAME_TH"],
                DIM_HEIGHT: arrResult[i]["DIM_HEIGHT"],
                DIM_LENGTH: arrResult[i]["DIM_LENGTH"],
                DIM_WIDTH: arrResult[i]["DIM_WIDTH"],
                WEIGHT: arrResult[i]["WEIGHT"]
              });
              // }else{
              //     itemArr.push({SHOP_CODE:arrResult[i-1]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i-1]['SHOP_NAME_TH'],SHOP_ADDRESS_NO:arrResult[i-1]['SHOP_ADDRESS_NO'],DISTRICT_CODE:arrResult[i-1]['DISTRICT_CODE'],DISTRICT_NAME_TH:arrResult[i-1]['DISTRICT_NAME_TH']
              //     ,PROVINCE_CODE:arrResult[i-1]['PROVINCE_CODE'],PROVINCE_NAME_TH:arrResult[i-1]['PROVINCE_NAME_TH']
              //     ,POSTCODE:arrResult[i-1]['POSTCODE'],IS_ACTIVE_LALAMOVE:arrResult[i-1]['IS_ACTIVE_LALAMOVE'],IS_OWNER_PACKING:arrResult[i-1]['IS_OWNER_PACKING'],IS_RECEIVE_FROM_HOME:arrResult[i-1]['IS_RECEIVE_FROM_HOME'],IS_DEMAND:arrResult[i-1]['IS_DEMAND']
              //     ,SEND_CODE:arrResult[i-1]['SEND_CODE'],SEND_NAME_TH:arrResult[i-1]['SEND_NAME_TH'],ITEM:arrDetail})
              //     arrDetail =[]
              //     arrDetail.push({SHOP_CODE:arrResult[i]['SHOP_CODE'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],GOODS_CODE:arrResult[i]['GOODS_CODE'],SHOP_CODE:arrResult[i]['SHOP_CODE'],CATE_CODE:arrResult[i]['CATE_CODE'],SUB_CATE_CODE:arrResult[i]['SUB_CATE_CODE'],GOODS_NAME_TH:arrResult[i]['GOODS_NAME_TH'],
              //     TYPE_CATE_CODE:arrResult[i]['TYPE_CATE_CODE'],TYPE_CATE_NAME_TH:arrResult[i]['TYPE_CATE_NAME_TH'],DEFAULT_VAL:arrResult[i]['DEFAULT_VAL'],SHOP_NAME_TH:arrResult[i]['SHOP_NAME_TH'],UNIT_NAME_TH:arrResult[i]['UNIT_NAME_TH'],PRICE:arrResult[i]['PRICE'],IMG_PATH:arrResult[i]['IMG_PATH'],IS_ACTIVE:true
              //     ,SEND_CODE:arrResult[i]['SEND_CODE'],SEND_NAME_TH:arrResult[i]['SEND_NAME_TH']
              //     ,DISCOUNT_LABEL:arrResult[i]['DISCOUNT_LABEL'],DISCOUNT_MODE:arrResult[i]['DISCOUNT_MODE'],DISCOUNT_VAL:arrResult[i]['DISCOUNT_VAL']
              //     ,DIM_NAME_TH:arrResult[i]['DIM_NAME_TH'],DIM_HEIGHT:arrResult[i]['DIM_HEIGHT']
              //     ,DIM_LENGTH:arrResult[i]['DIM_LENGTH'],DIM_WIDTH:arrResult[i]['DIM_WIDTH'],WEIGHT:arrResult[i]['WEIGHT']});
              // }
            } else {
              itemArr.push({
                SHOP_CODE: arrResult[i - 1]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i - 1]["SHOP_NAME_TH"],
                SHOP_ADDRESS_NO: arrResult[i - 1]["SHOP_ADDRESS_NO"],
                DISTRICT_CODE: arrResult[i - 1]["DISTRICT_CODE"],
                DISTRICT_NAME_TH: arrResult[i - 1]["DISTRICT_NAME_TH"],
                PROVINCE_CODE: arrResult[i - 1]["PROVINCE_CODE"],
                PROVINCE_NAME_TH: arrResult[i - 1]["PROVINCE_NAME_TH"],
                POSTCODE: arrResult[i - 1]["POSTCODE"],
                IS_ACTIVE_LALAMOVE: arrResult[i - 1]["IS_ACTIVE_LALAMOVE"],
                IS_OWNER_PACKING: arrResult[i - 1]["IS_OWNER_PACKING"],
                IS_RECEIVE_FROM_HOME: arrResult[i - 1]["IS_RECEIVE_FROM_HOME"],
                IS_DEMAND: arrResult[i - 1]["IS_DEMAND"],
                SEND_CODE: arrResult[i - 1]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i - 1]["SEND_NAME_TH"],
                DC_LOCATION_ID: arrResult[i - 1]["DC_LOCATION_ID"],
                ITEM: arrDetail
              });
              garrAll.push({ DETAIL: itemArr });
              arrHead = [];
              arrDetail = [];
              itemArr = [];
              arrHead.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"]
              });
              arrDetail.push({
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                GOODS_CODE: arrResult[i]["GOODS_CODE"],
                SHOP_CODE: arrResult[i]["SHOP_CODE"],
                CATE_CODE: arrResult[i]["CATE_CODE"],
                SUB_CATE_CODE: arrResult[i]["SUB_CATE_CODE"],
                GOODS_NAME_TH: arrResult[i]["GOODS_NAME_TH"],
                TYPE_CATE_CODE: arrResult[i]["TYPE_CATE_CODE"],
                TYPE_CATE_NAME_TH: arrResult[i]["TYPE_CATE_NAME_TH"],
                DEFAULT_VAL: arrResult[i]["DEFAULT_VAL"],
                SHOP_NAME_TH: arrResult[i]["SHOP_NAME_TH"],
                UNIT_NAME_TH: arrResult[i]["UNIT_NAME_TH"],
                PRICE: arrResult[i]["PRICE"],
                IMG_PATH: arrResult[i]["IMG_PATH"],
                IS_ACTIVE: true,
                SEND_CODE: arrResult[i]["SEND_CODE"],
                SEND_NAME_TH: arrResult[i]["SEND_NAME_TH"],
                DISCOUNT_LABEL: arrResult[i]["DISCOUNT_LABEL"],
                DISCOUNT_MODE: arrResult[i]["DISCOUNT_MODE"],
                DISCOUNT_VAL: arrResult[i]["DISCOUNT_VAL"],
                DIM_NAME_TH: arrResult[i]["DIM_NAME_TH"],
                DIM_HEIGHT: arrResult[i]["DIM_HEIGHT"],
                DIM_LENGTH: arrResult[i]["DIM_LENGTH"],
                DIM_WIDTH: arrResult[i]["DIM_WIDTH"],
                WEIGHT: arrResult[i]["WEIGHT"]
              });
            }
          }
        }
      }
      // console.log(garrAll[0].DETAIL)
      // console.log(sum_item)
      // //checkpromotion same vendor sumprice more 2000 dis 300
      let sumprice_option = 0;
      let option_desc = "";
      let option_arr = [];
      let sumAllOption = 0;
      if (arrResult.length == 1) {
        let i = 0;
        sumprice_option =
          parseFloat(sumprice_option) +
          parseFloat(arrResult[i]["DISCOUNT_VAL"]);
        if (sumprice_option >= 2000) {
          option_desc =
            "ได้รับส่วนลดจาก " + arrResult[i]["SHOP_NAME_TH"] + " 300 บาท";
          option_arr.push({
            OPTION_DESC: option_desc,
            SHOP_CODE: arrResult[i]["SHOP_CODE"],
            VALUE: 300,
            TYPE: 2
          });
          sumAllOption = parseFloat(sumAllOption) + 300;
        }
      } else {
        for (var i = 0; i < arrResult.length; i++) {
          // console.log(arrResult[i]["DEFAULT_VAL"])
          // sum_item =
          //   parseFloat(sum_item) + parseFloat(arrResult[i]["DISCOUNT_VAL"]);
          if (i == 0) {
            sumprice_option =
              parseFloat(sumprice_option) +
              parseFloat(arrResult[i]["DISCOUNT_VAL"]);
          } else if (i == arrResult.length - 1) {
            if (arrResult[i]["SHOP_CODE"] == arrResult[i - 1]["SHOP_CODE"]) {
              sumprice_option =
                parseFloat(sumprice_option) +
                parseFloat(arrResult[i]["DISCOUNT_VAL"]);
              if (sumprice_option >= 2000) {
                option_desc =
                  "ได้รับส่วนลดจาก " +
                  arrResult[i]["SHOP_NAME_TH"] +
                  " 300 บาท";
                option_arr.push({
                  OPTION_DESC: option_desc,
                  SHOP_CODE: arrResult[i]["SHOP_CODE"],
                  VALUE: 300,
                  TYPE: 2
                });
                sumAllOption = parseFloat(sumAllOption) + 300;
              }
              sumprice_option = 0;
            } else {
              if (sumprice_option >= 2000) {
                option_desc =
                  "ได้รับส่วนลดจาก " +
                  arrResult[i - 1]["SHOP_NAME_TH"] +
                  " 300 บาท";
                option_arr.push({
                  OPTION_DESC: option_desc,
                  SHOP_CODE: arrResult[i - 1]["SHOP_CODE"],
                  VALUE: 300,
                  TYPE: 2
                });
                sumAllOption = parseFloat(sumAllOption) + 300;
              }

              sumprice_option = 0;
              sumprice_option =
                parseFloat(sumprice_option) +
                parseFloat(arrResult[i]["DISCOUNT_VAL"]);
              if (sumprice_option >= 2000) {
                option_desc =
                  "ได้รับส่วนลดจาก " +
                  arrResult[i]["SHOP_NAME_TH"] +
                  " 300 บาท";
                option_arr.push({
                  OPTION_DESC: option_desc,
                  SHOP_CODE: arrResult[i]["SHOP_CODE"],
                  VALUE: 300,
                  TYPE: 2
                });
                sumAllOption = parseFloat(sumAllOption) + 300;
              }
            }
          } else {
            if (arrResult[i]["SHOP_CODE"] == arrResult[i - 1]["SHOP_CODE"]) {
              sumprice_option =
                parseFloat(sumprice_option) +
                parseFloat(arrResult[i]["DISCOUNT_VAL"]);
            } else {
              if (sumprice_option >= 2000) {
                option_desc =
                  "ได้รับส่วนลดจาก " +
                  arrResult[i - 1]["SHOP_NAME_TH"] +
                  " 300 บาท";
                option_arr.push({
                  OPTION_DESC: option_desc,
                  SHOP_CODE: arrResult[i - 1]["SHOP_CODE"],
                  VALUE: 300,
                  TYPE: 2
                });
                sumAllOption = parseFloat(sumAllOption) + 300;
              }
              sumprice_option = 0;
              sumprice_option =
                parseFloat(sumprice_option) +
                parseFloat(arrResult[i]["DISCOUNT_VAL"]);
            }
          }
          // console.log(option_arr)
          // console.log(sumAllOption)
        }
      }
      // console.log(option_arr);
      let sumprice_option_dis = 0;
      if (option_arr.length > 0) {
        sumprice_option_dis = parseFloat(sum_item) - sumAllOption;
        res.status(200).send({
          STATUS: 1,
          RESULT: garrAll,
          OPTION: option_arr,
          TOTAL_PRICE: sum_item,
          SUM_PRICE_OPTION: sumprice_option_dis
        });
      } else {
        optionData = [];
        res.status(200).send({
          STATUS: 1,
          RESULT: garrAll,
          OPTION: option_arr,
          TOTAL_PRICE: sum_item,
          SUM_PRICE_OPTION: sumprice_option_dis
        });
      }
      //   // console.log(sumAllOption)
      // res
      //   .status(200)
      //   .send({ STATUS: 1, RESULT: garrAll, TOTAL_PRICE: sum_item });
    } else {
      res.status(200).send({ STATUS: 3, RESULT: garrAll, TOTAL_PRICE: 0 });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
