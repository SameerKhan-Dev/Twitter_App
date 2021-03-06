const express = require("express");
var router = express.Router();
const add_new_user = require('../database/databaseHelpers/addNewUser');
const check_unique_userName = require('../database/databaseHelpers/checkUniqueUserName');
const get_user_by_email = require ('../database/databaseHelpers/getUserByEmail');
const add_message = require ('../database/databaseHelpers/addMessage');
const create_new_conversation = require ('../database/databaseHelpers/createNewConversation');
const get_all_conversations_for_user = require ('../database/databaseHelpers/getAllConversationsForUser');
const get_all_messages_for_conversation = require ('../database/databaseHelpers/getAllMessagesForConversation');
const get_all_messages_of_user = require ('../database/databaseHelpers/getAllMessagesOfUser');
const get_conversation_between_users = require ('../database/databaseHelpers/getConversationBetweenUsers');

// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";


const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");

const morgan = require("morgan");
const cookieSession = require("cookie-session");
const database = require("../database/database");
var path = require('path');
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/login", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  // add if email is empty what to do.
  get_user_by_email(email)
    .then(async (response) => {
        if(response.length > 0){
          // user exists in datbase
          console.log("here");
          console.log("RESPONSE IS: ", response);
       
          //console.log(passwordMatch is:)
          let passwordMatch = await bcrypt.compare(password, response[0].password);
            console.log("here2");
            console.log("passwordMatch is:", passwordMatch);

            if(passwordMatch) {
              console.log("here3");
              req.session["user_id"] = response[0].id;
              res.status(200).send("login successful");
            } else {
              console.log("here4");
              res.status(400).send("incorrect password");
            }
        } 
        else {
          // user-email does not exist in database
          console.log("here6");
          res.status(400).send("invalid email - email is not registered");
        }
    }).catch ((err) => { res.status(500).send("server error")});
  }); 

  router.post("/logout", (req, res) => {
    // clear the cookies when logged out
    req.session = null;
    /*
    new Promise ((resolve, reject) => {

      req.session.destroy((err) => {
        if(err) reject(err)

        res.clearCookie("user_id");

        resolve();
      });

    })
    */
    res.clearCookie("user_id");
    res.send("logout successful");
  });


router.post("/users/new", async (req,res) => {
  try {
    const userName = req.body.userName;
    const email = req.body.email;
    if(req.body.password !== null && userName !== null && email !== null){
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // check if userName is unique
      check_unique_userName(userName)
        .then((response) => {
          console.log("RESPONSE FROM check_unique_userName is: ", response);
          // means unique userName
          if(response.length > 0){
            res.status(400).send("invalid registration - username already exists");
          
          } else {
            add_new_user(userName, email, hashedPassword)
              .then((response) => {
                if(response){
                  req.session.user_id = response[0].id;
                  res.status(200).send("registration successful");
                }
              })
              .catch((err) => {
                res.status(500).send("server error");
              })
          }
        }).catch (err => {
          res.status(500).send("server error");
        })
    } else {
      res.status(400).send("incomplete - user registration form - you must specify userName, email and password to register");
    }
    
  } 
  catch (error) {
    res.status(500).send();
  }  
});

module.exports = router;
