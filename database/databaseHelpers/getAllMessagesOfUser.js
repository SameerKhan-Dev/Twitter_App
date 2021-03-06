const db = require("../database");

const getAllMessagesOfUser = function (user_id){
  return db
    .query(
      `
      SELECT * FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
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

module.exports = getAllMessagesOfUser;
