//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
const crypto = require('crypto');

//Section CURD
exports.func_post = function(req,res){
    const ip = globalIP
    insertNewShop(req,res,ip);
}

//Section Method
async function insertNewShop (req, res,ip) {
	try {
        const SHOP_NAME_TH          = req.SHOP_NAME_TH
        const ADDRESS_NO            = req.ADDRESS_NO
        const DISTRICT_CODE         = req.DISTRICT_CODE
        const PROVINCE_CODE         = req.PROVINCE_CODE
        const SHARE_LINK            = req.SHARE_LINK
        const MARKET_CODE           = req.MARKET_CODE
        const SHOP_BD_CODE_REF      = req.SHOP_BD_CODE_REF
        const UID                   = req.UID
        const SHOP_EMAIL            = req.SHOP_EMAIL
        const SHOP_PHONE            = req.SHOP_PHONE
        const F_NAME                = req.F_NAME
        const L_NAME                = req.L_NAME
        const PASSWORD              = req.PASSWORD
        const IS_ACTIVE_LALAMOVE    = req.IS_ACTIVE_LALAMOVE
        const IS_OWNER_PACKING      = req.IS_OWNER_PACKING
        const IS_RECEIVE_FROM_HOME  = req.IS_RECEIVE_FROM_HOME
        const DC_NAME               = req.DC_NAME
        const DC_LOCATION_ID        = req.DC_LOCATION_ID
        const ADMIN_NAME            = req.ADMIN_NAME

        qArr =[]
        pArr =[]
        const IS_ACTIVE = 1
        q='SELECT "MEM_CODE" FROM "T_MEMBER_LOGIN" WHERE cast("CREATE_AT" as date) = CAST(NOW() as date) order by "MEM_CODE" desc limit 1'
        var { rows } = await queryFunc.queryRow(q, []);
        if(rows.length==0){
            var d = new Date();
            var date = d.getDate()
            date = ("0" + date).slice(-2).toString();
            var month = d.getMonth() + 1
            month = ("0" + month).slice(-2).toString();
            var str = d.getFullYear().toString();
            var year = str.substring(str.length - 2, str.length);
            MEM_CODE = 'U'+ year + month +  date  + '0001';
        }else{
            var d = new Date();
            var date = d.getDate()
            date = ("0" + date).slice(-2).toString();
            var month = d.getMonth() + 1
            month = ("0" + month).slice(-2).toString();
            var str = d.getFullYear().toString();
            var year = str.substring(str.length - 2, str.length);
            OLD_MEM_CODE = rows[0].MEM_CODE
            lastIndex = parseInt(OLD_MEM_CODE.substring(OLD_MEM_CODE.length - 4, OLD_MEM_CODE.length))+1;
            if(lastIndex <=9){
                lastIndex = ("000" + lastIndex).slice(-4).toString();
            }else if(lastIndex>=10 && lastIndex <=99){
                lastIndex = ("00" + lastIndex).slice(-4).toString();
            }else if(lastIndex>=100 && lastIndex <=999){
                lastIndex = ("0" + lastIndex).slice(-4).toString();
            }else{
                lastIndex = lastIndex.toString();
            }
            MEM_CODE = 'U'+ year + month +  date  + lastIndex;
        }
        const algorithm = 'aes-256-cbc';
        const secretkey = 'qazxswedcvfrtgb';
        const cipher = crypto.createCipher(algorithm, secretkey);
        var encrypted = cipher.update(PASSWORD, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        q=`INSERT INTO "M_MEMBER"(
            "MEM_CODE", "MEM_FNAME_TH", "MEM_LNAME_TH", "MEM_CREATE_AT", "IS_SHOP_OWNER")
            VALUES ($1, $2, $3,NOW(), $4);`
        qArr.push(q)
        p= [MEM_CODE,F_NAME,L_NAME,2]
        pArr.push(p)

        q=`INSERT INTO "T_MEMBER_LOGIN"(
            "MEM_CODE", "MEM_USERNAME", "MEM_PASSWORD", "MEM_LOGIN_TYPE", "CREATE_AT")
            VALUES ($1, $2, $3, $4, NOW());`
        qArr.push(q)
        p= [MEM_CODE,SHOP_EMAIL,encrypted,1]
        pArr.push(p)
        await queryFunc.queryAction(qArr, pArr);


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
            var hour =d.getHours()
            hour = ("0" + hour).slice(-2).toString();
            // res.send(date)
            SHOP_CODE = 'V'+ year + month +  date  + '001';
        }else{
            var d = new Date();
            var date = d.getDate()
            date = ("0" + date).slice(-2).toString();
            var month = d.getMonth() + 1
            month = ("0" + month).slice(-2).toString();
            var str = d.getFullYear().toString();
            var year = str.substring(str.length - 2, str.length);
            var hour =d.getHours()
            hour = ("0" + hour).slice(-2).toString();
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
             "SHARE_LINK","SHOP_BD_CODE_REF","SHOP_EMAIL","SHOP_PHONE","SHOP_UID","IS_ACTIVE_LALAMOVE",
             "IS_OWNER_PACKING","IS_RECEIVE_FROM_HOME","DC_NAME","DC_LOCATION_ID")
            VALUES ($1, $2,  NOW(),$3, 2,  $4, $5, $6, $7,  0, $8, $9, $10, $11,$12,$13,$14,$15,$16,$17);`
        qArr.push(q)
        p= [SHOP_CODE,SHOP_NAME_TH,MEM_CODE,ADDRESS_NO,DISTRICT_CODE,PROVINCE_CODE,MARKET_CODE,SHARE_LINK,SHOP_BD_CODE_REF,SHOP_EMAIL,SHOP_PHONE,UID,IS_ACTIVE_LALAMOVE,IS_OWNER_PACKING,IS_RECEIVE_FROM_HOME,DC_NAME,DC_LOCATION_ID]
        pArr.push(p)

        var ACTION_DESC = "INSERT NEW SHOP"
        q=`INSERT INTO public."T_LOG_ADMIN_ACTIVITY"(
             "ACTION_AT", "ACTION_BY", "REF_KEY_1", "REF_KEY_2","ACTION_DESC")
            VALUES (NOW(), $1, $2, $3, $4);`
        qArr.push(q)
        p= [ADMIN_NAME,SHOP_CODE,MEM_CODE,ACTION_DESC]
        pArr.push(p)

        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({STATUS:1,RESULT:"SUCCESS"})
	} catch (err) {
		logger.error("Database:::::::" + err);
        res.status(200).send({STATUS:0,RESULT: "DATABASE ERROR"})
	}
}
