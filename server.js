// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const database = require("./database/database");
var path = require('path');
const bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const add_new_user = require('./database/databaseHelpers/addNewUser');
const check_unique_userName = require('./database/databaseHelpers/checkUniqueUserName');
const get_user_by_email = require ('.database/databaseHelpers/getUserByEmail');

/*
    * Have correct formatting

* Have resilient error handling

* Exceptions should appropriate handling

* Architecture should be scalable, easy to maintain

* Tricky parts of the code should have proper documentation

** Database queries should be efficient



Section 1



* User registration using unique username and a password

* User login (Including session maintenance using any means you're comfortable with)

* Unit tests for these basic methods



These two APIs must be perfect. DO NOT move on to the remainder of the assignment until these are completed. If either of these APIs are missing or incomplete, the remainder of the assignment WILL NOT be scored at all.



Section 2



Start *only* once the Basic Functionality is complete. Complete these *in the order specified*



* Chat with other users

* Create, read, update, delete tweet (Twitter doesn't support update, can you?)

* Unit/Integration tests for *all* endpoints you've built so far (Basic & Extended Functionality)
REGISTRATION:

Create new user
POST  /users/new

Login
POST /login

Logout
POST /logout

TWEETS:
Create Tweet:
POST /tweets

Update Tweets:
PUT /tweets/:id

Delete tweet:
DELETE /tweets/:id

GET A SPECFIC TWEET:
GET /tweets/:id

GET All tweets for a User:
GET /users/:id/tweets

GET ALL liked tweets for a user:
GET /users/:id/likedTweets

MESSAGES:
GET All conversations for a user
/users/:id/conversations

GET All messages for a specific conversation
/conversations/:id/messages

*/

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(
    cookieSession({
      name: "session",
      keys: [
        "b6d0e7eb-8c4b-4ae4-8460-fd3a08733dcb",
        "1fb2d767-ffbf-41a6-98dd-86ac2da9392e",
      ],
    })
  );

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

app.post("/api/login", (req, res) => {
  res.send("welcome to the login post route");

}); 

app.post("/users/new", async (req,res) => {
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
/*
Create new user
POST  /users/new
*/
module.exports = app;
