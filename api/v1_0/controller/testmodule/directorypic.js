//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const path = require("path");
const fs = require("fs");

//Section CURD
exports.func_get = function(req, res) {
  const ip = globalIP;
  getDetail(req, res, ip);
};

//Section Method
function getDetail(req, res, ip) {
  try {
    // // Section Define Variable
    // const sendArr = [];

    // // Section Method of Function
    // q = `select "IMG_PATH" from "T_HOME_BANNER" where "IMG_STATUS" = 1 and cast( NOW() as date) < "EXP_DATE" ORDER BY random() limit 4`; // String query
    // var { rows } = await queryFunc.queryRow(q, []);
    // rows.map((data, index) => {
    //   shopImg = ip + "/api/img/BANNER_HOME/" + data["IMG_PATH"];
    //   sendArr.push({
    //     IMG_PATH: shopImg
    //   });
    // });
    const directoryPathOld = "./api/img/banner";
    const directoryPathNew = "./api/img/BANNER_FOODSTORY";
    let filename2 = [];
    fs.readdir(directoryPathOld, function(err, files) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      //listing all files using forEach
      let filename = [];
      files.forEach(async function(file) {
        // Do whatever you want to do with the file
        // console.log(file);
        // filename2.push(file);
        q = `SELECT count(*) as TOTAL
        FROM public."M_FOODSTORY"
	      WHERE "FS_IMG_BANNER" like $1;`; // String query
        var { rows } = await queryFunc.queryRow(q, ["%" + file + "%"]);
        // console.log(rows)
        if (rows[0]["total"] > 0) {
          // await filename.push(file);
          // await copy(rows[0]['SUB_CATE_IMG_BANNER'])
          // console.log(rows[0]['total'])
          // console.log(file)
          await copy(file);
        }
      });
      // console.log(filename);
      //   console.log(filename2);
    });
    async function copy(fileNamePath) {
      var readStream = fs.createReadStream(
        directoryPathOld + "/" + fileNamePath
      );
      var writeStream = fs.createWriteStream(
        directoryPathNew + "/" + fileNamePath
      );

      readStream.on("error", callback);
      writeStream.on("error", callback);

      readStream.on("close", function() {
        // fs.unlink(oldPath, callback);
      });

      readStream.pipe(writeStream);
    }
    // Section Response Normal Data
    res.status(200).json({ STATUS: 1, RESULT: "SUCCESS" });
  } catch (err) {
    // Section Response Exception Data
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
