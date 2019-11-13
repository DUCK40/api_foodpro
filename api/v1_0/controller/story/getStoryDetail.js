//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(mem_code, fs_code, res) {
  const ip = globalIP;
  getDetail(mem_code, fs_code, res, ip);
};

//Section Method
async function getDetail(mem_code, fs_code, res, ip) {
  try {
    const storyArr = [];
    q = `SELECT "FS_CODE"
        ,"FS_CONTENT_HEADER_TH"
        ,"FS_CONTENT_TH"
        ,"FS_IMG_BANNER"
        ,(SELECT COUNT(*) AS TOTAL FROM "T_FOODSTORY_FOV" WHERE "T_FOODSTORY_FOV"."FS_CODE"  = "M_FOODSTORY"."FS_CODE"
                                and "T_FOODSTORY_FOV"."MEM_CODE" = $1)
        FROM "M_FOODSTORY"
        WHERE "FS_CODE" = $2`;
    var { rows } = await queryFunc.queryRow(q, [mem_code, fs_code]);
    rows.map((data, index) => {
      devImg = ip + "/api/img/banner/" + data["FS_IMG_BANNER"];
      if (data["total"] == 1) {
        me_fov = true;
      } else {
        me_fov = false;
      }
      storyArr.push({
        FS_CODE: data["FS_CODE"],
        FS_CONTENT_HEADER: data["FS_CONTENT_HEADER_TH"],
        FS_CONTENT: data["FS_CONTENT_TH"],
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
