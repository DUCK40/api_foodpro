var moment = require("moment");
let desclogisblockbydatetime = function() {};

desclogisblockbydatetime.prototype.getDescription = async (
  from,
  to,
  fromdate,
  fromtime
) => {
    let gDate = fromdate+' '+fromtime
    // console.log(from)
    // console.log(to)
    // console.log(fromdate)
//     console.log(fromtime)
  var formatTime = "HH:mm:ss";
  var dayName = "dddd";
  var mydate = moment(gDate).toDate();
// var mydate = moment(fromdate).toDate();
  var weekDayName = moment(mydate).format(dayName);
//   console.log(weekDayName)
  var thisTime = moment(mydate, formatTime);
//   console.log(thisTime)
// //   let test = moment(Date.now()).subtract({hours:10});
// //   let test = moment(Date.now()).subtract({hours:4});
// //   let test = moment(Date.now()).subtract({hours:0});
// //   console.log(test);
  var getSol;
// //   from = "เชียงใหม่";
// //   to = "ยะลา";
// //   thisTime = test;
// //   weekDayName = "Thursday";
  if(getGeo(from)==1){
      if(getGeo(to) == 1 || getGeo(to) == 2 || getGeo(to) == 3 || getGeo(to) == 4|| getGeo(to) == 5){
        getSol = sol1(weekDayName, thisTime,fromdate);
      }
  }else if(getGeo(from) == 2 || getGeo(from) == 3 || getGeo(from) == 4|| getGeo(from) == 5){
      if(getGeo(to) == 1){
        getSol = sol1(weekDayName, thisTime,fromdate);
      }else{
        getSol = sol2(weekDayName, thisTime,fromdate);
      }
  }
// //   if (getGeo(from) == getGeo(to)) {
// //     //ในภาค
// //     getSol = sol1(weekDayName, thisTime);
// //   } else {
// //     //ข้ามภาค
// //     getSol = sol2(weekDayName, thisTime);
// //   }
// console.log(getSol)
  return { STATUS: 1, RESULT: getSol };
    // return 1
};


function getSolTime(thisTime,fromdate) {
//   console.log(thisTime);
//   console.log("fromdate: ",fromdate);
  var formatTime = "HH:mm:ss";
  let txt1Start = new Date(fromdate+" 00:00:00");
  let txt1End = new Date(fromdate+" 10:59:59");
  let txt2Start = new Date(fromdate+" 11:00:00");
  let txt2End = new Date(fromdate+" 14:59:59");
  let txt3Start = new Date(fromdate+" 15:00:00");
  let txt3End = new Date(fromdate+" 23:59:59");
//   console.log("txt1Start ",txt1Start)
//   console.log("txt1End ",txt1End)
//   console.log("txt2Start ",txt2Start)
//   console.log("txt2End ",txt2End)
//   console.log("txt3Start ",txt3Start)
//   console.log("txt3End ",txt3End)
  let timeL1Start = moment(txt1Start).format("YYYY-MM-DD HH:mm:ss");
  let timeL1End = moment(txt1End).format("YYYY-MM-DD HH:mm:ss");
  let timeL2Start = moment(txt2Start).format("YYYY-MM-DD HH:mm:ss");
  let timeL2End = moment(txt2End).format("YYYY-MM-DD HH:mm:ss");
  let timeL3Start = moment(txt3Start).format("YYYY-MM-DD HH:mm:ss");
  let timeL3End = moment(txt3End).format("YYYY-MM-DD HH:mm:ss");
//   console.log("timeL1Start ",timeL1Start)
//   console.log("timeL1End ",timeL1End)
//   console.log("timeL2Start ",timeL2Start)
//   console.log("timeL2End ",timeL2End)
//   console.log("timeL3Start ",timeL3Start)
//   console.log("timeL3End ",timeL3End)


  if (thisTime.isBetween(timeL1Start, timeL1End)) {
    // console.log("is between:Loop1:" + moment(thisTime).format(formatTime));
    return 1;
  } else if (thisTime.isBetween(timeL2Start, timeL2End)) {
    // console.log("is between:Loop2:" + moment(thisTime).format(formatTime));
    return 2;
  } else if (thisTime.isBetween(timeL3Start, timeL3End)) {
    // console.log("is between:Loop3:" + moment(thisTime).format(formatTime));
    return 3;
  } else {
    // console.log("is not between");
    return 0;
  }
}

function sol1(weekDayName, thisTime,fromdate) {
  //ในภาค
  //   console.log(weekDayName);
  let txtData = "";
  let new_date;
  let new_date2;
//   console.log(weekDayName,thisTime,fromdate)
  if (
    weekDayName == "Monday" ||
    weekDayName == "Tuesday" ||
    weekDayName == "Wednesday" ||
    weekDayName == "Thursday"
  ) {
    // //   return getSolTime(thisTime,fromdate)
    // console.log("getSolTime: "+getSolTime(thisTime,fromdate));
    if (getSolTime(thisTime,fromdate) == 1) {
      new_date = moment(fromdate)
        .add(1, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
        // console.log("new_date:",new_date)
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else if (getSolTime(thisTime,fromdate) == 2) {
      new_date = moment(fromdate)
        .add(1, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      new_date2 = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData =
        "คุณจะได้รับสินค้า ในวันที่ " +
        new_date +
        " ในกรณีที่ติดต่อผู้ขายไม่ได้ภายใน 15:00 คุณจะได้รับสินค้าในวันที่ " +
        new_date2;
    } else if (getSolTime(thisTime,fromdate) == 3) {
      new_date = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else {
      txtData = "";
    }
    return txtData;
  } else if (weekDayName == "Friday") {
    if (getSolTime(thisTime,fromdate) == 1) {
      new_date = moment(fromdate)
        .add(1, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else if (getSolTime(thisTime,fromdate) == 2) {
      new_date = moment(fromdate)
        .add(1, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      new_date2 = moment(fromdate)
        .add(4, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData =
        "คุณจะได้รับสินค้า ในวันที่ " +
        new_date +
        " ในกรณีที่ติดต่อผู้ขายไม่ได้ภายใน 15:00 คุณจะได้รับสินค้าในวันที่ " +
        new_date2;
    } else if (getSolTime(thisTime,fromdate) == 3) {
      new_date = moment(fromdate)
        .add(4, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else {
      txtData = "";
    }
    return txtData;
  } else {
    // console.log(weekDayName);
    if (weekDayName == "Saturday") {
      new_date = moment(fromdate)
        .add(3, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else {
      new_date = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    }
    return txtData;
  }
}

function sol2(weekDayName, thisTime,fromdate) {
  //ข้ามภาค
  //   console.log(weekDayName);
  let txtData = "";
  let new_date;
  let new_date2;
  if (
    weekDayName == "Monday" ||
    weekDayName == "Tuesday" ||
    weekDayName == "Wednesday"
  ) {
    // console.log("getSolTime: "+getSolTime(thisTime));
    if (getSolTime(thisTime,fromdate) == 1) {
      new_date = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else if (getSolTime(thisTime,fromdate) == 2) {
      new_date = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      new_date2 = moment(fromdate)
        .add(3, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData =
        "คุณจะได้รับสินค้า ในวันที่ " +
        new_date +
        " ในกรณีที่ติดต่อผู้ขายไม่ได้ภายใน 15:00 คุณจะได้รับสินค้าในวันที่ " +
        new_date2;
    } else if (getSolTime(thisTime,fromdate) == 3) {
      new_date = moment(fromdate)
        .add(3, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else {
      txtData = "";
    }
    return txtData;
  } else if (weekDayName == "Thursday") {
    if (getSolTime(thisTime,fromdate) == 1) {
      new_date = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else if (getSolTime(thisTime,fromdate) == 2) {
      new_date = moment(fromdate)
        .add(2, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      new_date2 = moment(fromdate)
        .add(6, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData =
        "คุณจะได้รับสินค้า ในวันที่ " +
        new_date +
        " ในกรณีที่ติดต่อผู้ขายไม่ได้ภายใน 15:00 คุณจะได้รับสินค้าในวันที่ " +
        new_date2;
    } else if (getSolTime(thisTime,fromdate) == 3) {
      new_date = moment(fromdate)
        .add(6, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else {
      txtData = "";
    }
    return txtData;
  } else {
    if (weekDayName == "Friday") {
      new_date = moment(fromdate)
        .add(5, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else if (weekDayName == "Saturday") {
      new_date = moment(fromdate)
        .add(4, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    } else {
      new_date = moment(fromdate)
        .add(3, "days")
        .add(543, "years")
        .format("DD/MM/YYYY");
      txtData = "คุณจะได้รับสินค้า ในวันที่ " + new_date;
    }
    return txtData;
  }
}

function getGeo(provinceName) {
  let pCentral = [
    "กรุงเทพมหานคร",
    "สมุทรปราการ",
    "นนทบุรี",
    "ปทุมธานี",
    "พระนครศรีอยุธยา",
    "อ่างทอง",
    "สิงห์บุรี",
    "ลพบุรี",
    "สระบุรี",
    "นครนายก",
    "ฉะเชิงเทรา",
    "ชลบุรี",
    "ระยอง",
    "สมุทรสงคราม",
    "สมุทรสาคร",
    "เพชรบุรี",
    "นครปฐม",
    "ราชบุรี",
    "กาญจนบุรี",
    "สุพรรณบุรี",
    "ปราจีนบุรี",
    "สระแก้ว",
    "จันทบุรี",
    "ตราด",
    "ประจวบคีรีขันธ์","H2", "0001", "0003", "H1", "NP", "RY", "0002"
  ];

  let pNorth = [
    "ชัยนาท",
    "อุทัยธานี",
    "นครสวรรค์",
    "พิษณุโลก",
    "แพร่",
    "ลำปาง",
    "เชียงใหม่",
    "ลำพูน",
    "กำแพงเพชร",
    "ตาก",
    "สุโขทัย",
    "อุตรดิตถ์",
    "พิจิตร",
    "เพชรบูรณ์",
    "น่าน",
    "พะเยา",
    "เชียงราย","N3", "N0", "N1", "N2"
  ];

  let pNE = [
    "นครราชสีมา",
    "ขอนแก่น",
    "อุดรธานี",
    "อุบลราชธานี",
    "ชัยภูมิ",
    "บุรีรัมย์",
    "สุรินทร์",
    "ศรีสะเกษ",
    "ยโสธร",
    "ร้อยเอ็ด",
    "มหาสารคาม",
    "กาฬสินธุ์",
    "สกลนคร",
    "นครพนม",
    "หนองคาย",
    "หนองบัวลำภู",
    "มุกดาหาร",
    "อำนาจเจริญ",
    "เลย",
    "บึงกาฬ","E2", "E1", "E3"
  ];

  let pS = [
    "สุราษฎร์ธานี",
    "ชุมพร",
    "ระนอง",
    "นครศรธรรมราช",
    "พังงา",
    "กระบี่",
    "ภูเก็ต",
    "ตรัง",
    "พัทลุง",
    "สตูล",
    "สงขลา",
    "ยะลา",
    "ปัตตานี",
    "นราธิวาส",
    "บางสะพาน","S1", "S4", "S2", "S3"
  ];

  let pOther = ["แม่ฮ่องสอน"];

  if (pCentral.indexOf(provinceName) != -1) {
    return 1;
  } else if (pNorth.indexOf(provinceName) != -1) {
    return 2;
  } else if (pNE.indexOf(provinceName) != -1) {
    return 3;
  } else if (pS.indexOf(provinceName) != -1) {
    return 4;
  } else if (pOther.indexOf(provinceName) != -1) {
    return 5;
  }
}

module.exports = new desclogisblockbydatetime();
