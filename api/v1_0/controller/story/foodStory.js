//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(memcode, res) {
  const ip = globalIP;
  getDetail(memcode, res, ip);
};

//Section Method
async function getDetail(memcode, res, ip) {
  try {
    // const arrPrice =[]
    const storyArr = [];
    // const groupArr=[];
    q = `SELECT "FS_CODE"
        ,"FS_TITLE_TH"
        ,"FS_SUB_TITLE_TH"
        ,"FS_IMG"
        ,(SELECT COUNT(*) AS TOTAL FROM "T_FOODSTORY_FOV" WHERE "T_FOODSTORY_FOV"."FS_CODE"  = "M_FOODSTORY"."FS_CODE" 
                                and "T_FOODSTORY_FOV"."MEM_CODE" = $1)
        FROM "M_FOODSTORY"
        order by "CREATE_AT" DESC`;
    var { rows } = await queryFunc.queryRow(q, [memcode]);
    rows.map((data, index) => {
      devImg = ip + "/api/img/FOODSTORY/" + data["FS_IMG"];
      if (data["total"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }
      storyArr.push({
        FS_CODE: data["FS_CODE"],
        FS_TITLE: data["FS_TITLE_TH"],
        FS_SUB_TITLE: data["FS_SUB_TITLE_TH"],
        FS_IMG: devImg,
        FAVORITE: me_fov
      });
    });

    if (storyArr.length > 0) {
      res.status(200).json({ STATUS: 1, RESULT: storyArr });
    } else {
      res.status(200).json({ STATUS: 3, RESULT: storyArr });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
