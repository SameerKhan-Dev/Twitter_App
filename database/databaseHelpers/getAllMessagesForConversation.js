const db = require("../database");

const getAllMessagesForConversation = function (conversation_id){
  return db
    .query(
      `
      SELECT id, sender_id, receiver_id, created_at FROM messages
      WHERE conversation_id = $1
      ORDER BY id DESC
      ;`, [conversation_id]
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

module.exports = getAllMessagesForConversation;