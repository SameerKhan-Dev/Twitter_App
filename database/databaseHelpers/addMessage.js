const db = require("../database");

const addMessage = function (conversation_id, sender_id, receiver_id, description) {
  return db
    .query(
      `
      INSERT INTO messages (conversation_id, sender_id, receiver_id, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`, [conversation_id, sender_id, receiver_id, description]
    )
    .then((res) => {
      if (res.rows) {
        return res.rows;
      } else {
        console.log("null returned");
        return null;
      }
    })
};

module.exports = addMessage;
