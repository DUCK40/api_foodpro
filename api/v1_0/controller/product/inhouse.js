// const {Pool,Client} = require('pg')
// const connectionString = 'postgressql://ielt@localhost:5432/foodprodb'

// const client = new Client({
//     connectionString:connectionString
// })

// client.connect()

exports.func_get = function(req,req1,res){
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
    if(req1 == 0){
        arrPro.push({'SHOP_CODE':'SH001','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'มะเขือเทศเกรดA','GOODS_NAME_EN':'Tomato Grade A','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'03','SUB_CATE_NAME':'มะเขือเทศ','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Tomato.jpg','PRICE':240,'LINK':'https://www.google.com/','ME_FOV':false,'ME':null});
        arrPro.push({'SHOP_CODE':'SH001','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'ฟักทองเกรดA','GOODS_NAME_EN':'Pumkin Grade A','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'01','SUB_CATE_NAME':'ฟักทอง','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Pumpkin.jpg','PRICE':120,'LINK':'https://www.google.com/','ME_FOV':false,'ME':null});
        arrPro.push({'SHOP_CODE':'SH002','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'ถั่วลันเตา','GOODS_NAME_EN':'Peas','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'07','SUB_CATE_NAME':'ถั่ว','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Pea.jpg','PRICE':99,'LINK':'https://www.google.com/','ME_FOV':false,'ME':null});
        arrPro.push({'SHoP_CODE':'SH003','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'แครอทหวาน','GOODS_NAME_EN':'Sweet Carrot','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'04','SUB_CATE_NAME':'แครอท','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Carrot.jpg','PRICE':40,'LINK':'https://www.google.com/','ME_FOV':false,'ME':null});
    }else{
        arrPro.push({'SHOP_CODE':'SH001','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'มะเขือเทศเกรดA','GOODS_NAME_EN':'Tomato Grade A','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'03','SUB_CATE_NAME':'มะเขือเทศ','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Tomato.jpg','PRICE':240,'LINK':'https://www.google.com/','ME_FOV':true,'ME':req});
        arrPro.push({'SHOP_CODE':'SH001','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'ฟักทองเกรดA','GOODS_NAME_EN':'Pumkin Grade A','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'01','SUB_CATE_NAME':'ฟักทอง','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Pumpkin.jpg','PRICE':120,'LINK':'https://www.google.com/','ME_FOV':true,'ME':req});
        arrPro.push({'SHOP_CODE':'SH002','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'ถั่วลันเตา','GOODS_NAME_EN':'Peas','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'07','SUB_CATE_NAME':'ถั่ว','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Pea.jpg','PRICE':99,'LINK':'https://www.google.com/','ME_FOV':false,'ME':req});
        arrPro.push({'SHoP_CODE':'SH003','SHOP_NAME':'เจ๊เล้ง','GOODS_NAME_TH':'แครอทหวาน','GOODS_NAME_EN':'Sweet Carrot','CATE_CODE':'C190601','CATE_NAME':'ผัก','SUB_CATE_CODE':'04','SUB_CATE_NAME':'แครอท','GOODS_IMG':ip+'/api/img/'+'C190601'+'/Carrot.jpg','PRICE':40,'LINK':'https://www.google.com/','ME_FOV':false,'ME':req});
    }
    

    res.status(200).json(arrPro)

}