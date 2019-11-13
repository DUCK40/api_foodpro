//Section Include
var logger = require("../../../../logger/logger");
// var queryFunc = require("../../../helpFunction/queryFunction");
var dimensionblock = require("../../../helpFunction/dimensionblock")

//Section CURD
exports.func_get = function(dimX,dimY,dimZ,amount,weight,sendMethod, res) {
  const ip = globalIP;
  getDetail(dimX,dimY,dimZ,amount,weight,sendMethod, res, ip);
};

//Section Method
async function getDetail(dimX,dimY,dimZ,amount,weight,sendMethod, res, ip) {
  try {
    let newArr = []
    var rows = await dimensionblock.chooseBox(dimX,dimY,dimZ,amount,weight,sendMethod);
    console.log("ddddd"+rows.DATA[0].SIZE);
    
    if(rows.DATA[0].SIZE != "-"){
      let y = 0
      for(var i =0 ; i<rows.DATA.length;i++){
        if(rows.DATA[i].SIZE == "C"){
          newArr.pop()
          y=y+rows.DATA[i].TOTAL
          newArr.push({ SIZE: "C", TOTAL: y});
        }else{
          newArr.push({ SIZE: rows.DATA[i].SIZE, TOTAL: rows.DATA[i].TOTAL});
        }
      }
      res.status(200).json({ STATUS: 1, RESULT: newArr });
    }else{
      newArr.push({ SIZE: rows.DATA[0].SIZE, TOTAL: rows.DATA[0].TOTAL});
      res.status(200).json({ STATUS: 1, RESULT: newArr });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR", });
  }
}
