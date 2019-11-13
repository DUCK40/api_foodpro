var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var router = express.Router();
router.use(bodyParser.json({ limit: "50mb" })); // to support JSON-encoded bodies
router.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

router.route("/").post((req, res) => {
  let base64Image = req.body.DATA;
  if (req.body.TYPE == "image/png") {
    filetype = ".png";
  } else if (req.body.TYPE == "image/jpeg") {
    filetype = ".jpg";
  }
  let path = "./api/img/user/";
  let filename = "IMG" + "-" + Date.now() + filetype;
  fs.writeFile(path + filename, base64Image, "base64", function(err) {
    // console.log("File created");
    // var obj =require('../../controller/master/updatepicbannersubcate')
    // obj.func_post(req.file.filename,req.body.CATE_CODE,req.body.SUB_CATE_CODE,res)
  });
  // console.log(req.file.filename)
  // console.log(req.body.MEM_CODE)
  // res.send(req.body)
  // console.log(req.body)
  // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
  // const data = req.body
  // var obj =require('../../controller/master/updatepicbannersubcate')
  // obj.func_post(req.file.filename,req.body.CATE_CODE,req.body.SUB_CATE_CODE,res)
  // res.status(200).json(obj.func_get(req.params.cate))
});

module.exports = router;
