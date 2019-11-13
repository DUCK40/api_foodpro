var queryFunc = require("../helpFunction/queryFunction");
let getDescriptionBlock = function() {};

getDescriptionBlock.prototype.getDescription = async (
  pCode,
  dCode
) => {
    let pName = await queryDest(pCode,dCode)
    // console.log(pName)
    return pName;
}
async function queryDest(pCode,dCode){
    try {
        q = `select distinct "G_PROVINCE"."PROVINCE_NAME_TH","G_DISTRICT"."DISTRICT_NAME_TH"
        from "G_PROVINCE"
        inner join "G_DISTRICT" on "G_DISTRICT"."PROVINCE_CODE" = "G_PROVINCE"."PROVINCE_CODE" 
        WHERE "G_PROVINCE"."PROVINCE_CODE" = $1 and "G_DISTRICT"."DISTRICT_CODE" = $2 limit 1`;
        var { rows } = await queryFunc.queryRow(q, [pCode,dCode]);
        let pName
        if(rows[0].PROVINCE_NAME_TH =='ประจวบคีรีขันธ์'){
            if(rows[0].DISTRICT_NAME_TH =='บางสะพาน'){
                pName = 'บางสะพาน'
            }else{
                pName = rows[0].PROVINCE_NAME_TH
            }
        }else{
            pName = rows[0].PROVINCE_NAME_TH
        }
       return pName
      } catch (err) {
        return err
      }
}

module.exports = new getDescriptionBlock();