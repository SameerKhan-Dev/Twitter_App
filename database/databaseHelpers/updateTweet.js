const db = require("../database");

const updateTweet = function (description, tweet_id) {
  return db
    .query(
      `
      UPDATE tweets 
      SET description = $1
      WHERE id = $2
      RETURNING *;`, [description, tweet_id]
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

module.exports = updateTweet;
