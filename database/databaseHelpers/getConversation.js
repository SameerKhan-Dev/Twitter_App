const db = require("../database");

const getConversation = function (conversation_id) {
  return db
    .query(
      `
      SELECT * FROM conversations
      WHERE id = $1;`,
      [conversation_id]
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

module.exports = getConversation;

