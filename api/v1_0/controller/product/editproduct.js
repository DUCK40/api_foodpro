//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_put = function(req, res) {
  const ip = globalIP;
  updateData(req, res, ip);
};

//Section Method
async function updateData(req, res, ip) {
  try {
    // console.log(req)

    const SHOP_CODE = req.SHOP_CODE;
    const GOODS_CODE = req.GOODS_CODE;
    const GOODS_NAME_TH = req.GOODS_NAME_TH;
    const CATE_CODE = req.CATE_CODE;
    const SUB_CATE_CODE = req.SUB_CATE_CODE;
    const TYPE_CATE_CODE = req.TYPE_CATE_CODE;
    const PRICE = req.PRICE;
    const UNIT_CODE = req.UNIT_CODE;
    const SEND_CODE = req.SEND_CODE;
    const SUM_WEIGHT = req.SUM_WEIGHT;
    const IS_STOCK = req.IS_STOCK;



   

    let qArr = [];
    let pArr = [];
    q = `UPDATE public."M_GOODS"
    SET "GOODS_NAME_TH"=$3, "CATE_CODE"=$4, "SUB_CATE_CODE"=$5, "TYPE_CATE_CODE"=$6, "PRICE"=$7,  "UNIT_CODE"=$8,  "SEND_CODE"=$9, "SUM_WEIGHT"=$10, "IS_STOCK"=$11
    where "SHOP_CODE"=$1 and "GOODS_CODE" = $2`;
    qArr.push(q);
    p = [SHOP_CODE,GOODS_CODE,GOODS_NAME_TH,CATE_CODE,SUB_CATE_CODE,TYPE_CATE_CODE,PRICE,UNIT_CODE,SEND_CODE,SUM_WEIGHT,IS_STOCK];
    pArr.push(p);
    await queryFunc.queryAction(qArr, pArr);
    res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });

  } catch (err) {
    console.log("Database " + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
