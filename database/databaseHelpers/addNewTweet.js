const db = require("../database");

const addNewTweet = function (creator_id, description) {
  return db
    .query(
      `
      INSERT INTO tweets (creator_id, description)
      VALUES ($1, $2)
      RETURNING *;`, [creator_id, description]
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

module.exports = addNewTweet;

