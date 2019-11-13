const express = require("express");
const bodyParser = require("body-parser");
// const socketio = require("socket.io");
// const request = require("request");
// const axios = require("axios");
var router = express.Router();
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.route('/').post((req,res)=>{
    // // res.json({'Method': 'get','Path':'Category','Code': req.params.memid})
    const data = req.body
    // console.log(data)
    var obj =require('../../controller/payment/inquiry')
    obj.func_post(data,res)
    // // res.status(200).json(obj.func_get(req.params.cate))

})

module.exports = router;