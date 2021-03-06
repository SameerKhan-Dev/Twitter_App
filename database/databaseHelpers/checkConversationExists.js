const db = require("../database");

const checkConversationBetweenUsers = function (sender_id, receiver_id) {
  return db
    .query(
      `
      SELECT * FROM conversations
      WHERE sender_id = $1 AND receiver_id = $2
      OR sender_id = $2 AND receiver_id = $1`,
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

module.exports = checkConversationExists;
