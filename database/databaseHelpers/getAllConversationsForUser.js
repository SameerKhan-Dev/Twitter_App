const db = require("../database");

const getAllConversationsForUser = function (user_id){
  return db
    .query(
      `
      SELECT id, created_at, user_one_id, user_two_id FROM conversations
      WHERE user_one_id = $1 OR user_two_id = $1
      ORDER BY created_at DESC
      ;`, [user_id]
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

module.exports = getAllConversationsForUser;