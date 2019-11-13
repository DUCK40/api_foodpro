//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");

//Section CURD
exports.func_get = function(memid, res) {
  const ip = globalIP;
  getStoryFov(memid, res, ip);
};
exports.func_post = function(req, res) {
  const ip = globalIP;
  insertStoryFov(req, res, ip);
};

//Section Method
async function getStoryFov(memcode, res, ip) {
  try {
    const storyArr = [];
    q = `SELECT "M_FOODSTORY" ."FS_CODE"
            ,"FS_TITLE_TH"
            ,"FS_SUB_TITLE_TH"
            ,"FS_IMG"
            FROM "M_FOODSTORY"
            INNER JOIN "T_FOODSTORY_FOV" on "T_FOODSTORY_FOV"."FS_CODE"  = "M_FOODSTORY"."FS_CODE"  and "T_FOODSTORY_FOV"."MEM_CODE" = $1
            order by "CREATE_AT" DESC`;
    var { rows } = await queryFunc.queryRow(q, [mem_code]);
    rows.map((data, index) => {
      devImg = ip + "/api/img/FOODSTORY/" + data["FS_IMG"];
      me_fov = true;
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

async function insertStoryFov(req, res, ip) {
  try {
    qArr = [];
    pArr = [];
    const MEM_CODE = req.MEM_CODE;
    const FS_CODE = req.FS_CODE;

    q = `SELECT count(*) as TOTAL FROM "T_FOODSTORY_FOV"
        WHERE "T_FOODSTORY_FOV"."MEM_CODE" = $1
        and "T_FOODSTORY_FOV"."FS_CODE" = $2 `;
    var { rows } = await queryFunc.queryRow(q, [MEM_CODE, FS_CODE]);
    if (rows[0]["total"] == 0) {
      try {
        q = `INSERT INTO public."T_FOODSTORY_FOV"(
                    "MEM_CODE", "FS_CODE","FOV_AT")
                    VALUES ($1, $2,NOW());`;
        qArr.push(q);
        p = [MEM_CODE, FS_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    } else {
      try {
        q = `DELETE FROM "T_FOODSTORY_FOV" WHERE "T_FOODSTORY_FOV"."MEM_CODE" = $1
                and "T_FOODSTORY_FOV"."FS_CODE" = $2  ;`;
        qArr.push(q);
        p = [MEM_CODE, FS_CODE];
        pArr.push(p);
        await queryFunc.queryAction(qArr, pArr);
        res.status(200).send({ STATUS: 1, RESULT: "SUCCESS" });
      } catch (err) {
        logger.error("Database:::::::" + err);
        res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
      }
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).send({ STATUS: 0, RESULT: "DATABASE ERROR" });
  }
}
