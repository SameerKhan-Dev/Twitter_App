const db = require("../database");

const createNewConversation = function (sender_id, receiver_id) {
  let user_one_id, user_two_id;

  if (sender_id < receiver_id) {
      user_one_id = sender_id;
      user_two_id = receiver_id;
  }  
  else {
      user_one_id = receiver_id;
      user_two_id = receiver_id;
  }

  return db
    .query(
      `
      INSERT INTO conversations (user_one_id, user_two_id)
      VALUES ($1, $2)
      RETURNING *;`, [user_one_id, user_two_id]
    )
    .then((res) => {
      if (res.rows) {
        //console.log("res.rows is, ", res.rows);
        return res.rows[0];
      } else {
        console.log("null returned");
        return null;
      }
    })
    .catch((err) => console.log(err));
};

module.exports = createNewConversation;

