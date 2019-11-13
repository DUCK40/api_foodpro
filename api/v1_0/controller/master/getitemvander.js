//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
// exports.func_get = function(req, res) {
// const ip = globalIP;
// getDetail(req, res, ip);
// };

exports.func_get = function(
shop_code,
goods_code,

res
) {
const ip = globalIP;
getDetail(shop_code, goods_code, res, ip);
};

//Section Method
async function getDetail(shop_code,goods_code, res, ip) {
var shop_code =shop_code
var goods_code=goods_code

try {

const sendArr = [];
q = `SELECT *
FROM public."M_GOODS"
where "SHOP_CODE" =$1 and "GOODS_CODE" =$2 `;
var { rows } = await queryFunc.queryRow(q, [
shop_code,
goods_code
]);
rows.map((data, index) => {

sendArr.push({
GOODS_CODE: data["GOODS_CODE"],
CATE_CODE: data["CATE_CODE"],
SUB_CATE_CODE: data["SUB_CATE_CODE"], 
UNIT_CODE: data["UNIT_CODE"], 
SEND_CODE: data["SEND_CODE"], 
GOODS_NAME_TH: data["GOODS_NAME_TH"], 
GOODS_NAME_EN: data["GOODS_NAME_EN"], 
DIM_CODE: data["DIM_CODE"], 
PRICE: data["PRICE"], 
SHOP_CODE: data["SHOP_CODE"], 
GOODS_SKU: data["GOODS_SKU"], 
IS_PROMOTE: data["IS_PROMOTE"], 
IS_STOCK: data["IS_STOCK"], 
SHARE_LINK: data["SHARE_LINK"], 
LASTUPDATE_AT: data["LASTUPDATE_AT"], 
LASTUPDATE_BY: data["LASTUPDATE_BY"], 
CREATE_AT: data["CREATE_AT"], 
CREATE_BY: data["CREATE_BY"], 
TYPE_CATE_CODE: data["TYPE_CATE_CODE"], 
SUM_WEIGHT: data["SUM_WEIGHT"], 
GOODS_MARGIN_COST: data["GOODS_MARGIN_COST"], 
GOODS_DIM_X: data["GOODS_DIM_X"], 
GOODS_DIM_Y: data["GOODS_DIM_Y"], 
GOODS_DIM_Z: data["GOODS_DIM_Z"]


// PROVINCE_NAME_TH: data["PROVINCE_NAME_TH"],
// SHOP_EMAIL: data["SHOP_EMAIL"],
// SHOP_PHONE: data["SHOP_PHONE"],

// SHOP_STATUS: data["SHOP_STATUS"],
// ITEM: data["total"],
// B_CODE: data["BANK_CODE"]
});
});

res.status(200).json({ STATUS: 1, RESULT: sendArr });
} catch (err) {
logger.error("Database:::::::" + err);
res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
}
}