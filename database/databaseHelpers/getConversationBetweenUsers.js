const db = require("../database");

const getConversationBetweenUsers = function (sender_id, receiver_id) {
  return db
    .query(
      `
      SELECT * FROM conversations
      WHERE (user_one_id = $1 AND user_two_id = $2)
      OR (user_one_id = $2 AND user_two_id = $1)`,
      [sender_id, receiver_id]
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

module.exports = getConversationBetweenUsers;

