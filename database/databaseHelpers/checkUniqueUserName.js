const db = require("../database");

const checkUniqueUserName = function (userName) {
  return db
    .query(
      `
      SELECT * FROM users
      WHERE users.userName = $1;`,
      [userName]
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

module.exports = checkUniqueUserName;
