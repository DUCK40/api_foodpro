//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
var descLogisBlock = require("../../../helpFunction/desclogisblock");
var getDescriptionBlock = require("../../../helpFunction/getDestination");
var dimensionblock = require("../../../helpFunction/dimensionblock");
const crypto = require("crypto");
const axios = require("axios");

//Section CURD
exports.func_get = function(send_code, res) {
  const ip = globalIP;
  getDetail(send_code, res, ip);
};
exports.func_post = function(req, res) {
  const ip = globalIP;
  getDetailPost(req, res, ip);
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
async function getDetailPost(req, res, ip) {
  try {
    // console.log(req);
    const DATA = req.DATA;
    const SEND_CODE = req.SEND_CODE;
    var arrG = [];
    var arrL = [];
    var arrL2 = [];
    var locationId;
    var formPName;
    var IS_RECEIVE_FROM_HOME;
    // console.log(
    //   DATA[0]["IS_RECEIVE_FROM_HOME"],
    //   DATA[0]["VENDOR_IS_DISTRICT_CODE"],
    //   DATA[0]["VENDOR_IS_PROVINCE_CODE"]
    // );
    if (DATA[0]["IS_RECEIVE_FROM_HOME"] == 1) {
      IS_RECEIVE_FROM_HOME = "PU";
      arrL.push({
        from_location_district_id: DATA[0]["VENDOR_IS_DISTRICT_CODE"],
        from_location_postal_code: DATA[0]["VENDOR_IS_POSTCODE"],
        from_location_province_id: DATA[0]["VENDOR_IS_PROVINCE_CODE"]
      });

      formPName = await getDescriptionBlock.getDescription(
        DATA[0]["VENDOR_IS_PROVINCE_CODE"],
        DATA[0]["VENDOR_IS_DISTRICT_CODE"]
      );
      // console.log(formPName);

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
            ok[a]["province_code"] == arrL[b]["from_location_province_id"] &&
            ok[a]["district_code"] == arrL[b]["from_location_district_id"] &&
            ok[a]["postal_code"] == arrL[b]["from_location_postal_code"]
          ) {
            locationId = ok[a]["service_location_id"];
          }
        }
      }
    } else {
      console.log("done 1");
      console.log(DATA[0]["DC_LOCATION_ID"], DATA[0]["DC_LOCATION_ID"]);
      IS_RECEIVE_FROM_HOME = "DO";
      if (DATA[0]["DC_LOCATION_ID"] == "0") {
        console.log("done 1.1");
        IS_RECEIVE_FROM_HOME = "PU";
        arrL.push({
          from_location_district_id: DATA[0]["VENDOR_IS_DISTRICT_CODE"],
          from_location_postal_code: DATA[0]["VENDOR_IS_POSTCODE"],
          from_location_province_id: DATA[0]["VENDOR_IS_PROVINCE_CODE"]
        });

        formPName = await getDescriptionBlock.getDescription(
          DATA[0]["VENDOR_IS_PROVINCE_CODE"],
          DATA[0]["VENDOR_IS_DISTRICT_CODE"]
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
              ok[a]["province_code"] == arrL[b]["from_location_province_id"] &&
              ok[a]["district_code"] == arrL[b]["from_location_district_id"] &&
              ok[a]["postal_code"] == arrL[b]["from_location_postal_code"]
            ) {
              locationId = ok[a]["service_location_id"];
            }
          }
        }
      } else {
        console.log("done 1.2");
        console.log(DATA[0]["DC_LOCATION_ID"], DATA[0]["DC_LOCATION_ID"]);
        formPName = DATA[0]["DC_LOCATION_ID"];
        locationId = DATA[0]["DC_LOCATION_ID"];
      }
    }

    // console.log(formPName, locationId);
    const sendArr = [];
    q = `SELECT 
        distinct
                "SM_CODE"
                ,"SM_NAME_TH"
                ,"DP_NAME_TH"
                ,"SM_DESC_TH"
                ,"IS_DEMAND"
                ,"D_IMG_PATH"
                ,"G_SEND"."SEND_CODE"
                ,"IS_EXPRESS"
                FROM "G_SEND"
                inner join "M_DELIVERY_CHOICE" on "G_SEND"."SEND_CODE" = "M_DELIVERY_CHOICE"."SEND_CODE" and "SM_STATUS"=1
                inner join "M_DELIVERY_PROVIDER" on "M_DELIVERY_CHOICE"."DP_CODE" = "M_DELIVERY_PROVIDER"."DP_CODE" 
                inner join "T_DELIVERY_IMG" on "T_DELIVERY_IMG"."D_IMG_CODE" = "M_DELIVERY_CHOICE"."D_IMG_CODE"
                WHERE "G_SEND"."SEND_CODE" = $1
                order by "SM_CODE"`;
    var { rows } = await queryFunc.queryRow(q, [SEND_CODE]);
    rows.map((data, index) => {
      devImg = ip + "/api/img/BOX/" + data["D_IMG_PATH"];
      let price = 0;
      sendArr.push({
        SM_CODE: data["SM_CODE"],
        SM_NAME_TH: data["SM_NAME_TH"],
        DP_NAME_TH: data["DP_NAME_TH"],
        SM_DESC_TH: data["SM_DESC_TH"],
        IS_DEMAND: data["IS_DEMAND"],
        IS_EXPRESS: data["IS_EXPRESS"],
        IMG_PATH: devImg,
        PRICE: price,
        IS_ACTIVE: false
      });
    });

    var express;
    var repack;
    var repack_size;
    var repack_type;
    var size;
    var type = 0;
    var volume;
    var weight;
    var arr = [];
    var arrX = [];
    var DestPName;
    var descLogisTxt;
    var newArr = [];
    for (var i = 0; i < sendArr.length; i++) {
      for (var j = 0; j < DATA.length; j++) {
        // console.log(sendArr[i]);
        // console.log(DATA[j]);
        if (sendArr[i]["DP_NAME_TH"] == "IEL") {
          if (SEND_CODE == "S01") {
            if (DATA[j]["IS_OWNER_PACKING"] == 0) {
            } else {
              // console.log(DATA[j])
              if (sendArr[i]["IS_EXPRESS"] == 1) {
                express = "Y";
              } else {
                express = "N";
              }
              repack_type = "NO";
              repack = false;
              repack_size = "";
              type = 0;
              volume =
                parseFloat(DATA[j]["DIM_HEIGHT"]) *
                parseFloat(DATA[j]["DIM_LENGTH"]) *
                parseFloat(DATA[j]["DIM_WIDTH"]) *
                parseFloat(DATA[j]["DEFAULT_VAL"]);
              // console.log("volume:" + volume);
              weight =
                parseFloat(DATA[j]["WEIGHT"]) *
                parseFloat(DATA[j]["DEFAULT_VAL"]);
              // console.log(getNormalSize(volume, weight))
              let getSize = getNormalSize(volume, weight);
              let box_details = [];
              let numPack = 0;
              for (var k = 0; k < getSize.length; k++) {
                let algorithm = "aes-256-cbc";
                let secretkey = "qazxswedcvfrtgb" + i + j + k;
                let cipher = crypto.createCipher(algorithm, secretkey);
                var encrypted = cipher.update(Date(), "utf8", "hex");
                encrypted += cipher.final("hex");
                numPack = parseInt(numPack) + parseInt(getSize[k].TOTAL);
                if (getSize[k].SIZE == "C") {
                  size = "C";
                  weightG = 40;
                } else if (
                  getSize[k].SIZE == "B1" ||
                  getSize[k].SIZE == "B2" ||
                  getSize[k].SIZE == "B"
                ) {
                  size = "B";
                  weightG = 30;
                } else {
                  size = "A";
                  weightG = 20;
                }
                box_details.push({
                  amount: getSize[k].TOTAL,
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
              // if (volume <= 50000 && weight <= 20) {
              //   size = "A";
              // } else if (volume <= 100000 && weight <= 30) {
              //   size = "B";
              // } else if (volume > 100000 || weight > 30) {
              //   size = "C";
              // }

              DestPName = await getDescriptionBlock.getDescription(
                DATA[j]["DEST_IS_PROVINCE_CODE"],
                DATA[j]["DEST_IS_DISTRICT_CODE"]
              );
              // console.log(DestPName)
              descLogisTxt = await descLogisBlock.getDescription(
                formPName,
                DestPName,
                0,
                0,
                0
              );
              // console.log(descLogisTxt.RESULT);
              arr.push({
                sender: sendArr[i]["DP_NAME_TH"],
                SM_CODE: sendArr[i]["SM_CODE"],
                destination_district_id: DATA[j]["DEST_IS_DISTRICT_CODE"],
                destination_postal_code: DATA[j]["DEST_IS_POSTCODE"],
                destination_province_id: DATA[j]["DEST_IS_PROVINCE_CODE"],
                from_location_district_id: DATA[j]["VENDOR_IS_DISTRICT_CODE"],
                from_location_postal_code: DATA[j]["VENDOR_IS_POSTCODE"],
                from_location_province_id: DATA[j]["VENDOR_IS_PROVINCE_CODE"],
                service_location_id: locationId,
                bill_type: "DU",
                box_amount_total: DATA[j]["DEFAULT_VAL"],
                SENDTEXT: descLogisTxt.RESULT,
                box_details: box_details
              });
              // console.log(arr);
            }
          } else if (SEND_CODE == "S02") {
            express = "Y";
            repack_type = "CH";
            if (DATA[j]["IS_OWNER_PACKING"] == 0) {
              //// ielpack
              repack = true;
              repack_size = DATA[j]["DIM_NAME_TH"];
              size = DATA[j]["DIM_NAME_TH"];
              type = 0;
              volume = 0;
              let dimX = parseFloat(DATA[j]["DIM_WIDTH"]);
              let dimY = parseFloat(DATA[j]["DIM_LENGTH"]);
              let dimZ = parseFloat(DATA[j]["DIM_HEIGHT"]);
              let amount = parseFloat(DATA[j]["DEFAULT_VAL"]);
              let weightG = parseFloat(DATA[j]["WEIGHT"]);
              var dBlock = await dimensionblock.chooseBox(
                dimX,
                dimY,
                dimZ,
                amount,
                weightG,
                repack_type
              );
              // console.log(dimX,dimY,dimZ,amount,weightG)
              // console.log(dBlock);
              // console.log(dBlock.DATA[0]);
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
              // console.log(newArr);
              let numPack = 0;
              let box_details = [];
              for (k = 0; k < newArr.length; k++) {
                let algorithm = "aes-256-cbc";
                let secretkey = "qazxswedcvfrtgb" + i + j + k;
                let cipher = crypto.createCipher(algorithm, secretkey);
                var encrypted = cipher.update(Date(), "utf8", "hex");
                encrypted += cipher.final("hex");
                numPack = parseInt(numPack) + parseInt(newArr[k].TOTAL);
                if (newArr[k].SIZE == "C") {
                  size = "C";
                  weight = 40;
                } else if (newArr[k].SIZE == "B1" || newArr[k].SIZE == "B2") {
                  size = "B";
                  weight = 30;
                } else {
                  size = "A";
                  weight = 20;
                }
                box_details.push({
                  amount: newArr[k].TOTAL,
                  express: express,
                  id: encrypted,
                  repack: repack,
                  repack_size: newArr[k].SIZE,
                  repack_type: repack_type,
                  size: size,
                  type: 0,
                  volume: 0,
                  weight: 0
                });
              }
              // console.log(box_details)
              DestPName = await getDescriptionBlock.getDescription(
                DATA[j]["DEST_IS_PROVINCE_CODE"],
                DATA[j]["DEST_IS_DISTRICT_CODE"]
              );
              // console.log(DestPName);
              descLogisTxt = await descLogisBlock.getDescription(
                formPName,
                DestPName,
                0,
                0,
                0
              );
              // console.log(descLogisTxt.RESULT);
              arr.push({
                sender: sendArr[i]["DP_NAME_TH"],
                SM_CODE: sendArr[i]["SM_CODE"],
                destination_district_id: DATA[j]["DEST_IS_DISTRICT_CODE"],
                destination_postal_code: DATA[j]["DEST_IS_POSTCODE"],
                destination_province_id: DATA[j]["DEST_IS_PROVINCE_CODE"],
                from_location_district_id: DATA[j]["VENDOR_IS_DISTRICT_CODE"],
                from_location_postal_code: DATA[j]["VENDOR_IS_POSTCODE"],
                from_location_province_id: DATA[j]["VENDOR_IS_PROVINCE_CODE"],
                service_location_id: locationId,
                bill_type: IS_RECEIVE_FROM_HOME,
                box_amount_total: numPack,
                SENDTEXT: descLogisTxt.RESULT,
                box_details: box_details
              });
              // console.log(arr[0].box_details)
            } else {
              //// owner pack
              repack = false;
              repack_size = "";
              type = 0;
              volume =
                parseFloat(DATA[j]["DIM_HEIGHT"]) *
                parseFloat(DATA[j]["DIM_LENGTH"]) *
                parseFloat(DATA[j]["DIM_WIDTH"]);
              weight =
                parseFloat(DATA[j]["WEIGHT"]) *
                parseFloat(DATA[j]["DEFAULT_VAL"]);
              // if (volume <= 50000 && weight <= 20) {
              //   size = "A";
              // } else if (volume <= 100000 && weight <= 30) {
              //   size = "B";
              // } else if (volume > 100000 || weight > 30) {
              //   size = "C";
              // }
              let dimX = parseFloat(DATA[j]["DIM_WIDTH"]);
              let dimY = parseFloat(DATA[j]["DIM_LENGTH"]);
              let dimZ = parseFloat(DATA[j]["DIM_HEIGHT"]);
              let amount = parseFloat(DATA[j]["DEFAULT_VAL"]);
              let weightG = parseFloat(DATA[j]["WEIGHT"]);
              var dBlock = await dimensionblock.chooseBox(
                dimX,
                dimY,
                dimZ,
                amount,
                weightG,
                repack_type
              );
              // console.log(dimX,dimY,dimZ,amount,weightG)
              // console.log(dBlock);
              // console.log(dBlock.DATA[0]);
              // newArr = [];
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
              // console.log(newArr);
              let numPack = 0;
              let box_details = [];
              for (k = 0; k < newArr.length; k++) {
                let algorithm = "aes-256-cbc";
                let secretkey = "qazxswedcvfrtgb" + i + j + k;
                let cipher = crypto.createCipher(algorithm, secretkey);
                var encrypted = cipher.update(Date(), "utf8", "hex");
                encrypted += cipher.final("hex");
                numPack = parseInt(numPack) + parseInt(newArr[k].TOTAL);
                if (newArr[k].SIZE == "C") {
                  size = "C";
                  weight = 40;
                } else if (newArr[k].SIZE == "B1" || newArr[k].SIZE == "B2") {
                  size = "B";
                  weight = 30;
                } else {
                  size = "A";
                  weight = 20;
                }
                box_details.push({
                  amount: newArr[k].TOTAL,
                  express: express,
                  id: encrypted,
                  repack: repack,
                  repack_size: newArr[k].SIZE,
                  repack_type: repack_type,
                  size: size,
                  type: 0,
                  volume: 0,
                  weight: 0
                });
              }
              // console.log(box_details)
              DestPName = await getDescriptionBlock.getDescription(
                DATA[j]["DEST_IS_PROVINCE_CODE"],
                DATA[j]["DEST_IS_DISTRICT_CODE"]
              );
              // console.log(DestPName)
              descLogisTxt = await descLogisBlock.getDescription(
                formPName,
                DestPName,
                0,
                0,
                0
              );
              // console.log(descLogisTxt.RESULT);
              arr.push({
                sender: sendArr[i]["DP_NAME_TH"],
                SM_CODE: sendArr[i]["SM_CODE"],
                destination_district_id: DATA[j]["DEST_IS_DISTRICT_CODE"],
                destination_postal_code: DATA[j]["DEST_IS_POSTCODE"],
                destination_province_id: DATA[j]["DEST_IS_PROVINCE_CODE"],
                from_location_district_id: DATA[j]["VENDOR_IS_DISTRICT_CODE"],
                from_location_postal_code: DATA[j]["VENDOR_IS_POSTCODE"],
                from_location_province_id: DATA[j]["VENDOR_IS_PROVINCE_CODE"],
                service_location_id: locationId,
                bill_type: IS_RECEIVE_FROM_HOME,
                box_amount_total: numPack,
                SENDTEXT: descLogisTxt.RESULT,
                box_details: box_details
              });
            }
          } else if (SEND_CODE == "S03") {
            express = "Y";
            repack_type = "FR";
            if (DATA[j]["IS_OWNER_PACKING"] == 0) {
              //// ielpack
              repack = true;
              repack_size = DATA[j]["DIM_NAME_TH"];
              size = DATA[j]["DIM_NAME_TH"];
              type = 0;
              volume = 0;
              volume =
                parseFloat(DATA[j]["DIM_HEIGHT"]) *
                parseFloat(DATA[j]["DIM_LENGTH"]) *
                parseFloat(DATA[j]["DIM_WIDTH"]);
              weight =
                parseFloat(DATA[j]["WEIGHT"]) *
                parseFloat(DATA[j]["DEFAULT_VAL"]);
              let dimX = parseFloat(DATA[j]["DIM_WIDTH"]);
              let dimY = parseFloat(DATA[j]["DIM_LENGTH"]);
              let dimZ = parseFloat(DATA[j]["DIM_HEIGHT"]);
              let amount = parseFloat(DATA[j]["DEFAULT_VAL"]);
              let weightG = parseFloat(DATA[j]["WEIGHT"]);
              var dBlock = await dimensionblock.chooseBox(
                dimX,
                dimY,
                dimZ,
                amount,
                weightG,
                repack_type
              );
              // console.log(dimX,dimY,dimZ,amount,weightG)
              // console.log(dBlock);
              // console.log(dBlock.DATA[0]);
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
              // console.log(newArr);
              let numPack = 0;
              let box_details = [];
              for (k = 0; k < newArr.length; k++) {
                let algorithm = "aes-256-cbc";
                let secretkey = "qazxswedcvfrtgb" + i + j + k;
                let cipher = crypto.createCipher(algorithm, secretkey);
                var encrypted = cipher.update(Date(), "utf8", "hex");
                encrypted += cipher.final("hex");
                numPack = parseInt(numPack) + parseInt(newArr[k].TOTAL);
                if (newArr[k].SIZE == "C") {
                  size = "C";
                  weight = 40;
                } else if (newArr[k].SIZE == "B1" || newArr[k].SIZE == "B2") {
                  size = "B";
                  weight = 30;
                } else {
                  size = "A";
                  weight = 20;
                }
                box_details.push({
                  amount: newArr[k].TOTAL,
                  express: express,
                  id: encrypted,
                  repack: repack,
                  repack_size: newArr[k].SIZE,
                  repack_type: repack_type,
                  size: size,
                  type: 0,
                  volume: 0,
                  weight: 0
                });
              }
              // console.log(box_details)
              DestPName = await getDescriptionBlock.getDescription(
                DATA[j]["DEST_IS_PROVINCE_CODE"],
                DATA[j]["DEST_IS_DISTRICT_CODE"]
              );
              // console.log(DestPName);
              descLogisTxt = await descLogisBlock.getDescription(
                formPName,
                DestPName,
                0,
                0,
                0
              );
              // console.log(descLogisTxt.RESULT);
              arr.push({
                sender: sendArr[i]["DP_NAME_TH"],
                SM_CODE: sendArr[i]["SM_CODE"],
                destination_district_id: DATA[j]["DEST_IS_DISTRICT_CODE"],
                destination_postal_code: DATA[j]["DEST_IS_POSTCODE"],
                destination_province_id: DATA[j]["DEST_IS_PROVINCE_CODE"],
                from_location_district_id: DATA[j]["VENDOR_IS_DISTRICT_CODE"],
                from_location_postal_code: DATA[j]["VENDOR_IS_POSTCODE"],
                from_location_province_id: DATA[j]["VENDOR_IS_PROVINCE_CODE"],
                service_location_id: locationId,
                bill_type: IS_RECEIVE_FROM_HOME,
                box_amount_total: numPack,
                SENDTEXT: descLogisTxt.RESULT,
                box_details: box_details
              });
              // console.log(arr[0].box_details)
            } else {
              //// owner pack
              repack = true;
              repack_size = "";
              type = 0;
              volume =
                parseFloat(DATA[j]["DIM_HEIGHT"]) *
                parseFloat(DATA[j]["DIM_LENGTH"]) *
                parseFloat(DATA[j]["DIM_WIDTH"]);
              weight =
                parseFloat(DATA[j]["WEIGHT"]) *
                parseFloat(DATA[j]["DEFAULT_VAL"]);
              // if (volume <= 50000 && weight <= 20) {
              //   size = "A";
              // } else if (volume <= 100000 && weight <= 30) {
              //   size = "B";
              // } else if (volume > 100000 || weight > 30) {
              //   size = "C";
              // }
              let dimX = parseFloat(DATA[j]["DIM_WIDTH"]);
              let dimY = parseFloat(DATA[j]["DIM_LENGTH"]);
              let dimZ = parseFloat(DATA[j]["DIM_HEIGHT"]);
              let amount = parseFloat(DATA[j]["DEFAULT_VAL"]);
              let weightG = parseFloat(DATA[j]["WEIGHT"]);
              var dBlock = await dimensionblock.chooseBox(
                dimX,
                dimY,
                dimZ,
                amount,
                weightG,
                repack_type
              );
              // console.log(dimX,dimY,dimZ,amount,weightG)
              // console.log(dBlock);
              // console.log(dBlock.DATA[0]);
              // newArr = [];
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
              // console.log(newArr);
              let numPack = 0;
              let box_details = [];
              for (k = 0; k < newArr.length; k++) {
                let algorithm = "aes-256-cbc";
                let secretkey = "qazxswedcvfrtgb" + i + j + k;
                let cipher = crypto.createCipher(algorithm, secretkey);
                var encrypted = cipher.update(Date(), "utf8", "hex");
                encrypted += cipher.final("hex");
                numPack = parseInt(numPack) + parseInt(newArr[k].TOTAL);
                if (newArr[k].SIZE == "C") {
                  size = "C";
                  weight = 40;
                } else if (newArr[k].SIZE == "B1" || newArr[k].SIZE == "B2") {
                  size = "B";
                  weight = 30;
                } else {
                  size = "A";
                  weight = 20;
                }
                box_details.push({
                  amount: newArr[k].TOTAL,
                  express: express,
                  id: encrypted,
                  repack: repack,
                  repack_size: newArr[k].SIZE,
                  repack_type: repack_type,
                  size: size,
                  type: 0,
                  volume: 0,
                  weight: 0
                });
              }
              // console.log(box_details)
              DestPName = await getDescriptionBlock.getDescription(
                DATA[j]["DEST_IS_PROVINCE_CODE"],
                DATA[j]["DEST_IS_DISTRICT_CODE"]
              );
              // console.log(DestPName)
              descLogisTxt = await descLogisBlock.getDescription(
                formPName,
                DestPName,
                0,
                0,
                0
              );
              // console.log(descLogisTxt.RESULT);
              arr.push({
                sender: sendArr[i]["DP_NAME_TH"],
                SM_CODE: sendArr[i]["SM_CODE"],
                destination_district_id: DATA[j]["DEST_IS_DISTRICT_CODE"],
                destination_postal_code: DATA[j]["DEST_IS_POSTCODE"],
                destination_province_id: DATA[j]["DEST_IS_PROVINCE_CODE"],
                from_location_district_id: DATA[j]["VENDOR_IS_DISTRICT_CODE"],
                from_location_postal_code: DATA[j]["VENDOR_IS_POSTCODE"],
                from_location_province_id: DATA[j]["VENDOR_IS_PROVINCE_CODE"],
                service_location_id: locationId,
                bill_type: IS_RECEIVE_FROM_HOME,
                box_amount_total: numPack,
                SENDTEXT: descLogisTxt.RESULT,
                box_details: box_details
              });
            }
          }
        } else if (sendArr[i]["DP_NAME_TH"] == "LALAMOVE") {
          if (DATA[j]["IS_ACTIVE_LALAMOVE"] == 1) {
            repack = false;
            repack_size = "";
            type = 0;
            volume =
              parseFloat(DATA[j]["DIM_HEIGHT"]) *
              parseFloat(DATA[j]["DIM_LENGTH"]) *
              parseFloat(DATA[j]["DIM_WIDTH"]);
            weight =
              parseFloat(DATA[j]["WEIGHT"]) *
              parseFloat(DATA[j]["DEFAULT_VAL"]);
            if (volume <= 50000 && weight <= 20) {
              size = "A";
            } else if (volume <= 100000 && weight <= 30) {
              size = "B";
            } else if (volume > 100000 || weight > 30) {
              size = "C";
            }
            const algorithm = "aes-256-cbc";
            const secretkey = "qazxswedcvfrtgb" + i + j;
            const cipher = crypto.createCipher(algorithm, secretkey);
            var encrypted = cipher.update(Date(), "utf8", "hex");
            encrypted += cipher.final("hex");
            DestPName = await getDescriptionBlock.getDescription(
              DATA[j]["DEST_IS_PROVINCE_CODE"],
              DATA[j]["DEST_IS_DISTRICT_CODE"]
            );
            // console.log(DestPName);
            descLogisTxt = await descLogisBlock.getDescription(
              formPName,
              DestPName,
              0,
              0,
              0
            );
            // console.log(descLogisTxt.RESULT);
            arr.push({
              sender: sendArr[i]["DP_NAME_TH"],
              SM_CODE: sendArr[i]["SM_CODE"],
              destination_district_id: DATA[j]["DEST_IS_DISTRICT_CODE"],
              destination_postal_code: DATA[j]["DEST_IS_POSTCODE"],
              destination_province_id: DATA[j]["DEST_IS_PROVINCE_CODE"],
              from_location_district_id: DATA[j]["VENDOR_IS_DISTRICT_CODE"],
              from_location_postal_code: DATA[j]["VENDOR_IS_POSTCODE"],
              from_location_province_id: DATA[j]["VENDOR_IS_PROVINCE_CODE"],
              service_location_id: locationId,
              bill_type: IS_RECEIVE_FROM_HOME,
              box_amount_total: DATA[j]["DEFAULT_VAL"],
              SENDTEXT: descLogisTxt.RESULT,
              box_details: [
                {
                  amount: DATA[j]["DEFAULT_VAL"],
                  express: express,
                  id: encrypted,
                  repack: repack,
                  repack_size: repack_size,
                  repack_type: repack_type,
                  size: size,
                  type: 0,
                  volume: 0,
                  weight: 0
                }
              ]
            });
          }
        }
        newArr = [];
      }
      if (arr.length > 0) {
        arrX.push(arr);
      }

      arr = [];
    }
    // console.log("formPName: "+formPName)
    // console.log("DestPName: "+DestPName)
    // var descLogisTxt = await descLogisBlock.getDescription(
    //   formPName,
    //   DestPName,
    //   0,
    //   0,
    //   0
    // );
    // console.log("descLogisTxt:":descLogisTxt)
    // console.log(arrX);
    let loopout;
    let loopin;
    let arrV = [];
    var i = 0;
    var ok;
    let SENDTEXT;
    if (arrX.length > 0) {
      for (var k = 0; k < arrX.length; k++) {
        loopout = arrX[k];
        // console.log(loopout)
        for (var l = 0; l < loopout.length; l++) {
          loopin = loopout[l];
          console.log(loopin);
          let box_amount_total = loopin.box_amount_total;
          let bill_type = loopin.bill_type;
          // console.log(box_amount_total)
          if (loopin["sender"] == "IEL") {
            ok = await axios
              .post("http://ebooking.iel.co.th/services/checkPrice.php", loopin)
              .then(function(response) {
                // console.log(response.data.data);
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
                logger.error("Database:::::::" + error);
              });
            console.log(ok)
            let totalPrice = parseFloat(ok.TOTAL) - parseFloat(ok.PU);
            // if (bill_type == "PU") {
            //   totalPrice = parseFloat(ok) - parseFloat(box_amount_total) * 50;
            // } else {
            //   totalPrice = parseFloat(ok);
            // }
            arrG.push({
              sender: loopin["sender"],
              SM_CODE: loopin["SM_CODE"],
              SENDTEXT: loopin["SENDTEXT"],
              PRICE: totalPrice
            });
          } else {
            i = 110 * 1.5 * loopin["box_amount_total"];
            arrG.push({
              sender: loopin["sender"],
              SM_CODE: loopin["SM_CODE"],
              SENDTEXT: "",
              PRICE: i
            });
          }
        }
        arrV.push(arrG);
        arrG = [];
      }
      // console.log(arrV);
      var mm = [];
      for (var m = 0; m < arrV.length; m++) {
        var objA = arrV[m];
        var i = 0;
        var sender;
        var SM_CODE;
        let SENDTEXT;
        for (var n = 0; n < objA.length; n++) {
          i = i + objA[n]["PRICE"];
          sender = objA[n]["sender"];
          SM_CODE = objA[n]["SM_CODE"];
          SENDTEXT = objA[n]["SENDTEXT"];
        }
        mm.push({
          sender: sender,
          SM_CODE: SM_CODE,
          SENDTEXT: SENDTEXT,
          PRICE: i
        });
      }
      // console.log(mm)
      var dataRes = [];
      for (var n = 0; n < sendArr.length; n++) {
        for (var o = 0; o < mm.length; o++) {
          if (sendArr[n]["SM_CODE"] == mm[o]["SM_CODE"]) {
            dataRes.push({
              SM_CODE: sendArr[n]["SM_CODE"],
              SM_NAME_TH: sendArr[n]["SM_NAME_TH"],
              DP_NAME_TH: sendArr[n]["DP_NAME_TH"],
              // SM_DESC_TH: sendArr[n]["SM_DESC_TH"],
              IS_DEMAND: sendArr[n]["IS_DEMAND"],
              IS_EXPRESS: sendArr[n]["IS_EXPRESS"],
              IMG_PATH: sendArr[n]["IMG_PATH"],
              PRICE: mm[o]["PRICE"],
              IS_ACTIVE: sendArr[n]["IS_ACTIVE"],
              SENDTEXT: mm[o]["SENDTEXT"]
            });
          }
        }
      }
      console.log(dataRes)
      res.status(200).json({ STATUS: 1, RESULT: dataRes });
    } else {
      res.status(200).json({ STATUS: 3, RESULT: arrX });
    }
    // res.status(200).json({ STATUS: 1, RESULT: arrX });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}

async function getDetail(send_code, res, ip) {
  try {
    const sendArr = [];
    q = `SELECT
        distinct
                "SM_CODE"
                ,"SM_NAME_TH"
                ,"DP_NAME_TH"
                ,"SM_DESC_TH"
                ,"IS_DEMAND"
                ,"D_IMG_PATH"
                ,"G_SEND"."SEND_CODE"
                ,"IS_EXPRESS"
                FROM "G_SEND"
                inner join "M_DELIVERY_CHOICE" on "G_SEND"."SEND_CODE" = "M_DELIVERY_CHOICE"."SEND_CODE" and "SM_STATUS"=1
                inner join "M_DELIVERY_PROVIDER" on "M_DELIVERY_CHOICE"."DP_CODE" = "M_DELIVERY_PROVIDER"."DP_CODE" 
                inner join "T_DELIVERY_IMG" on "T_DELIVERY_IMG"."D_IMG_CODE" = "M_DELIVERY_CHOICE"."D_IMG_CODE"
                WHERE "G_SEND"."SEND_CODE" = $1
                order by "SM_CODE"`;
    var { rows } = await queryFunc.queryRow(q, [send_code]);
    // console.log(JSON.stringify(rows))
    rows.map((data, index) => {
      devImg = ip + "/api/img/BOX/" + data["D_IMG_PATH"];
      if (data["IS_EXPRESS"] == 1) {
        if (data["IS_DEMAND"] == 1) {
          // $price = 120;
          if (data["SEND_CODE"] == "S02") {
            $price = 180;
          } else if (data["SEND_CODE"] == "S03") {
            $price = 240;
          } else {
            $price = 120;
          }
        } else {
          if (data["SEND_CODE"] == "S02") {
            $price = 80;
          } else if (data["SEND_CODE"] == "S03") {
            $price = 100;
          } else {
            $price = 60;
          }
        }
      } else {
        $price = 30;
      }
      sendArr.push({
        SM_CODE: data["SM_CODE"],
        SM_NAME_TH: data["SM_NAME_TH"],
        DP_NAME_TH: data["DP_NAME_TH"],
        SM_DESC_TH: data["SM_DESC_TH"],
        IS_DEMAND: data["IS_DEMAND"],
        IMG_PATH: devImg,
        PRICE: $price,
        IS_ACTIVE: false
      });
    });

    res.status(200).json({ STATUS: 1, RESULT: sendArr });
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
