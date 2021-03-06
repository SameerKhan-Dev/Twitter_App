// load .env data into process.env
require("dotenv").config();
const express = require("express");
var router = express.Router();
const get_user_by_email = require ('../database/databaseHelpers/getUserByEmail');
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const database = require("../database/database");
var path = require('path');
const bcrypt = require('bcryptjs');

// route handler for logging in - /api/login
router.post("/login", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;

  // validate user email and then password for successful login
  get_user_by_email(email)
    .then(async (response) => {

        if(response.length > 0){
          let passwordMatch = await bcrypt.compare(password, response[0].password);
          
            if(passwordMatch) {
              req.session["user_id"] = response[0].id;
              res.status(200).send("login successful");
            } else {
              res.status(400).send("incorrect password");
            }
        } 
        else {
          res.status(400).send("invalid email - email is not registered");
        }
    }).catch ((err) => { 
      res.status(500).send("server error")});
  }); 

// route handler for logging out - /api/logout
router.post("/logout", (req, res) => {
  // clear the cookies when logged out
  req.session = null;

  res.send("logout successful");
});

module.exports = router;
