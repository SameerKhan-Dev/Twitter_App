const db = require("../database");

const deleteTweet = function (tweet_id) {
  return db
    .query(
      `
      DELETE FROM tweets 
      WHERE id = $1
      ;`, [tweet_id]
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

module.exports = deleteTweet;

