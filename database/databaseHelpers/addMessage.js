const db = require("../database");

const addMessage = function (conversation_id, sender_id, receiver_id, description){
  return db
    .query(
      `
      INSERT INTO messages (conversation_id, sender_id, receiver_id, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`, [conversation_id, sender_id, receiver_id, description]
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
};

module.exports = addMessage;

/* messages Table 
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
*/
