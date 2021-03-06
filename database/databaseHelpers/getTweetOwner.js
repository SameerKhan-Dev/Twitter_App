const db = require("../database");

const getTweetOwner = function (tweet_id) {
  return db
    .query(
      `
      SELECT creator_id FROM tweets
      WHERE id = $1;`,
      [tweet_id]
    )
    .then((res) => {
      if (res.rows) {
        //console.log("res.rows is, ", res.rows);
        return res.rows[0];
      } else {
        console.log("null returned");
        return null;
      }
    })
    .catch((err) => console.log(err));
};

module.exports = getTweetOwner;