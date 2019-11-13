//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_post = function(req,res){
    const ip = globalIP
    insertNewShop(req,res,ip);
}
exports.func_get = function(memid,mode,res){
        const ip = globalIP
        getDetail(memid,mode,res,ip);
}

//Section Method
async function insertNewShop (req, res,ip) {
	try {
        const MEM_CODE              = req.MEM_CODE
        const SHOP_NAME_TH          = req.SHOP_NAME_TH
        const ADDRESS_NO            = req.ADDRESS_NO
        const DISTRICT_CODE         = req.DISTRICT_CODE
        const PROVINCE_CODE         = req.PROVINCE_CODE
        const SHARE_LINK            = req.SHARE_LINK
        const MARKET_CODE           = req.MARKET_CODE
        const SHOP_BD_CODE_REF           = req.SHOP_BD_CODE_REF
        const SHOP_EMAIL           = req.SHOP_EMAIL
        const SHOP_PHONE           = req.SHOP_PHONE

        qArr =[]
        pArr =[]
        q='SELECT  "SHOP_CODE"  FROM "M_SHOP" WHERE cast("SHOP_CREATE_AT" as date) = CAST(NOW() as date) order by "M_SHOP"."SHOP_CODE" DESC limit 1'
        var { rows } = await queryFunc.queryRow(q, []);
        if(rows.length==0){
            var d = new Date();
            var date = d.getDate()
            date = ("0" + date).slice(-2).toString();
            var month = d.getMonth() + 1
            month = ("0" + month).slice(-2).toString();
            var str = d.getFullYear().toString();
            var year = str.substring(str.length - 2, str.length);
            SHOP_CODE = 'V'+ year + month +  date  + '001';
        }else{
            var d = new Date();
            var date = d.getDate()
            date = ("0" + date).slice(-2).toString();
            var month = d.getMonth() + 1
            month = ("0" + month).slice(-2).toString();
            var str = d.getFullYear().toString();
            var year = str.substring(str.length - 2, str.length);
            OLD_SHOP_CODE = rows[0].SHOP_CODE
            lastIndex = parseInt(OLD_SHOP_CODE.substring(OLD_SHOP_CODE.length - 3, OLD_SHOP_CODE.length))+1;
            if(lastIndex <=9){
                lastIndex = ("00" + lastIndex).slice(-3).toString();
            }else if(lastIndex>=10 && lastIndex <=99){
                lastIndex = ("0" + lastIndex).slice(-3).toString();
            }else {
                lastIndex = lastIndex.toString();
            }
            SHOP_CODE = 'V'+ year + month +  date  + lastIndex;
        }

        q=`INSERT INTO public."M_SHOP"(
            "SHOP_CODE", "SHOP_NAME_TH", "SHOP_CREATE_AT", "SHOP_CREATE_BY", "SHOP_STATUS", 
            "SHOP_ADDRESS_NO", "DISTRICT_CODE", "PROVINCE_CODE", "MARKET_CODE", "IS_PROMOTE",
             "SHARE_LINK","SHOP_BD_CODE_REF","SHOP_EMAIL","SHOP_PHONE")
            VALUES ($1, $2,  NOW(),$3, 2,  $4, $5, $6, $7,  0, $8, $9, $10, $11);`
        qArr.push(q)
        p= [SHOP_CODE,SHOP_NAME_TH,MEM_CODE,ADDRESS_NO,DISTRICT_CODE,PROVINCE_CODE,MARKET_CODE,SHARE_LINK,SHOP_BD_CODE_REF,SHOP_EMAIL,SHOP_PHONE]
        pArr.push(p)
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({STATUS:1,RESULT:"SUCCESS"})
	} catch (err) {
		logger.error("Database:::::::" + err);
        res.status(200).send({STATUS:0,RESULT: "DATABASE ERROR"})
	}
}

async function getDetail(memid,mode,res,ip) {

    try {
        const shopArr=[];
        q=`SELECT "SHOP_CODE"
        ,"SHOP_NAME_TH"
        ,MS."MARKET_CODE"
        ,"MARKET_NAME_TH"
        ,"SHOP_IMG_PATH_PROFILE"
		,GD."DISTRICT_NAME_TH"
        ,GP."PROVINCE_NAME_TH"
        ,GD."POSTCODE"
        ,"SHARE_LINK"
        ,(SELECT COUNT(*) AS TOTAL FROM "T_SHOP_FOV" WHERE "T_SHOP_FOV"."SHOP_CODE"  = MS."SHOP_CODE" 
                        and "T_SHOP_FOV"."MEM_CODE" = $1)
        FROM "M_SHOP" as MS
        INNER JOIN "G_MARKET" as GM on MS."MARKET_CODE" = GM."MARKET_CODE"
		INNER JOIN "G_DISTRICT" as GD on GD."DISTRICT_CODE" = MS."DISTRICT_CODE" and GD."PROVINCE_CODE" = MS."PROVINCE_CODE"
        INNER JOIN "G_PROVINCE" as GP on  GP."PROVINCE_CODE" = MS."PROVINCE_CODE"
        where MS."SHOP_STATUS" =2
        ORDER BY "SHOP_CREATE_AT" desc `

        if(mode == 1){
            q = q + ` limit 4`
        }
        var { rows } = await queryFunc.queryRow(q, [memid]);
        rows.map((data,index) =>{
            shopImg = ip + '/api/img/shop/'+data['SHOP_IMG_PATH_PROFILE']
            if(data['total']==1){
                me_fov = true
            }else{
                me_fov = false
            }

            shopArr.push({'MARKET_CODE':data['MARKET_CODE'],'SHOP_CODE':data['SHOP_CODE'],'SHOP_NAME':data['SHOP_NAME_TH'],
            'MARKET_NAME':data['MARKET_NAME_TH'],'DISTRICT_NAME_TH':data['DISTRICT_NAME_TH'],'PROVINCE_NAME_TH':data['PROVINCE_NAME_TH'],'POSTCODE':data['POSTCODE'],'SHOP_IMG':shopImg,'LINK':data['SHARE_LINK'],'ME_FOV':me_fov});
        })

        if(shopArr.length>0){
            res.status(200).json({STATUS:1,RESULT: shopArr});
          }else{
            res.status(200).json({STATUS:3,RESULT: shopArr});
          }
	} catch (err) {
		logger.error("Database:::::::" + err);
        res.status(200).send({STATUS:0,RESULT: "DATABASE ERROR"})
	}

}