const db = require("../database");

const getAllTweetsForUser = function (creator_id){
  return db
    .query(
      `
      SELECT * FROM tweets
      WHERE creator_id = $1
      ORDER BY created_at DESC
      ;`, [creator_id]
    )
    .then((res) => {
      if (res.rows) {
        //console.log("res.rows is, ", res.rows);
        return res.rows;
      } else {
        console.log("null returned");
        return null;
      }
    })
    .catch((err) => console.log(err));
};

module.exports = getAllTweetsForUser;

