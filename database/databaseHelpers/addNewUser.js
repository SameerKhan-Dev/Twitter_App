const db = require("../database");

const addNewUser = function (userName, email, password) {
  return db
    .query(
      `
      INSERT INTO users (userName, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`, [userName, email, password]
    )
    .then((res) => {
      if (res.rows) {
        console.log("res.rows is, ", res.rows);
        return res.rows;
      } else {
        console.log("null returned");
        return null;
      }
    })
    .catch((err) => console.log(err));
};

module.exports = addNewUser;