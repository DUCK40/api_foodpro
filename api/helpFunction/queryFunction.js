const pg = require("pg");
const pool = new pg.Pool(globalConfig);
let queryFunc = function(){}

queryFunc.prototype.queryRow = async (q, p)=>{
  const client = await pool.connect();
  let res;
  try {
    // Begin Transaction
    await client.query("BEGIN");
    try {
      // Query String and Array of Param
      res = await client.query(q, p);
      // Commit Transaction
      await client.query("COMMIT");
    } catch (err) {
      // Error >> Rollback Transaction
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

queryFunc.prototype.queryAction = async (q, p)=>{
  const client = await pool.connect();
  let res;
  try {
    // Begin Transaction
    await client.query("BEGIN");
    try {
      // Query String and Array of Param
      for (var i = 0; i < q.length; i++) {
        res = await client.query(q[i], p[i]);
      }
      // Commit Transaction
      await client.query("COMMIT");
    } catch (err) {
      // Error >> Rollback Transaction
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

module.exports = new queryFunc();