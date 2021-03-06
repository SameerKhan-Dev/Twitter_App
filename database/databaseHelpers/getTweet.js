const db = require("../database");

const getTweet = function (tweet_id) {
  return db
    .query(
      `
      SELECT * FROM tweets
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
    });
};

module.exports = getTweet;

