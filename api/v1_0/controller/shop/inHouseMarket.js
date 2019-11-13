var express = require('express');
// const {Pool,Client} = require('pg')
// const connectionString = 'postgressql://ielt@localhost:5432/foodprodb'

// const client = new Client({
//     connectionString:connectionString
// })

// client.connect()

exports.func_get = function(market_code,mem_code,res){
    // client.query('select * from "g_category" WHERE cate_code = $1',[req],(err,result)=>{
    //     if (err) {
    //         // throw err
    //         console.log(err);
    //         res.status(400).send(err);
    //     }
    //     res.status(200).json(result.rows)
    //     // console.log(result.rows)
    //     // return result
    // })
    arrPro = []
    const ip = globalIP
    if(mem_code == 0){
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH001','SHOP_NAME':'เจ๊เล้ง','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test2.jpg','LINK':'https://www.google.com/','ME_FOV':false});
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH004','SHOP_NAME':'เจ๊โบว์','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test4.jpg','LINK':'https://www.google.com/','ME_FOV':false});
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH002','SHOP_NAME':'เจ๊บ้ง','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test3.jpg','LINK':'https://www.google.com/','ME_FOV':false});
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH003','SHOP_NAME':'เจ๊เกียว','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test1.jpg','LINK':'https://www.google.com/','ME_FOV':false});
    }else{
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH001','SHOP_NAME':'เจ๊เล้ง','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test2.jpg','LINK':'https://www.google.com/','ME_FOV':true});
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH004','SHOP_NAME':'เจ๊โบว์','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test4.jpg','LINK':'https://www.google.com/','ME_FOV':true});
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH002','SHOP_NAME':'เจ๊บ้ง','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test3.jpg','LINK':'https://www.google.com/','ME_FOV':false});
        arrPro.push({'MARKET_CODE':market_code,'SHOP_CODE':'SH003','SHOP_NAME':'เจ๊เกียว','MARKET_NAME':'ตลาดไท','SHOP_IMG':ip+'/api/img/shop/test1.jpg','LINK':'https://www.google.com/','ME_FOV':false});
    }
    

    res.status(200).json(arrPro)

}