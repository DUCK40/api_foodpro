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
        // console.log(req.params.id)
        let cate = req.params.id;
        // console.log(cate)
        cb(null,'./api/img/'+cate)
        // cb(null,'./api/img/uploads')
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

router.route('/:id').post(upload.single('IMG'),(req,res)=>{
  // router.route('/').post((req,res)=>{
    // console.log(req)
    // console.log(req.file.filename)
    // console.log(req.body.MEM_CODE)
    // res.send(req.body)
    // console.log(req.body)
    // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    // const data = req.body
    var obj =require('../../controller/master/updatepicprofilesubcate')
    obj.func_post(req.file.filename,req.body.CATE_CODE,req.body.SUB_CATE_CODE,res)
    // res.status(200).json(obj.func_get(req.params.cate))
})

module.exports = router;