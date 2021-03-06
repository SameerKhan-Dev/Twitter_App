const db = require("../database");

const getUserById = function (id) {
  return db
    .query(
      `
      SELECT id, username FROM users
      WHERE users.id = $1;`,
      [id]
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

module.exports = getUserById;