var express = require('express');
var router = express.Router();
const add_new_user = require('./database/databaseHelpers/addNewUser');
const check_unique_userName = require('./database/databaseHelpers/checkUniqueUserName');
const get_user_by_email = require ('./database/databaseHelpers/getUserByEmail');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
