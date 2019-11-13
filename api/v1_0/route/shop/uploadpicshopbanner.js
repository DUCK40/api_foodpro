var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const multer = require('multer')
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'./api/img/banner')
    },
    filename : (req,file,cb)=>{
        // console.log(file)
      var filetype;
      if(file.mimetype =='image/png') {
        filetype ='.png';
      } else if(file.mimetype =='image/jpeg'){
        filetype ='.jpg';
      }
      cb(null,file.fieldname+'-'+Date.now()+filetype);
    }
})
const upload = multer({
    storage:storage
})

router.route('/').post(upload.single('IMG'),(req,res)=>{
    // console.log(req.file.filename)
    // console.log(req.body.MEM_CODE)
    // res.send(req.body)
    // console.log(req.bodycl)
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    // const data = req.body
    var obj =require('../../controller/shop/uploadpicshopbanner')
    obj.func_post(req.file.filename,req.body.SHOP_CODE,req.body.ADMIN_NAME,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;