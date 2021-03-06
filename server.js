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
const bcrypt = require('bcryptjs');

var tweetsRouter = require('./routes/api-tweets');
var apiRouter = require('./routes/api');
const add_new_user = require('./database/databaseHelpers/addNewUser');
const check_unique_userName = require('./database/databaseHelpers/checkUniqueUserName');
const get_user_by_email = require ('./database/databaseHelpers/getUserByEmail');


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

GET A SPECIFIC TWEET:
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

app.use('/api/tweets', tweetsRouter);
app.use('/api', apiRouter);

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

app.post("/api/login", (req, res) => {
  
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

  app.post("/api/logout", (req, res) => {
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

let server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

console.log('server:'. server);
const io = require('socket.io')(server, {
    cors: {
      origin: false
    }
});

io.on('connection', socket => {

  // need a function that will check who is the client, who does socket belong to

  //


  // dat schema
  // {
  //   dstUser: 'receiving user id',
  //   srcUser: 'sending user id',
  //   msg: 'msg being sent'
  // }
  //

  socket.on('message', data => {
    console.log('msg received with dstUser:', data.dstUser);
    console.log('socket.rooms1: ', socket.rooms);
    ///socket.emit('message', {damn: 'son'})
    
    socket.to(data.dstUser).emit('message', {srcUser: data.srcUser,  msg: 'echo:' + data.msg ? data.msg : ''});
    //socket.to('1').emit('message', {damn1: 'son'})
  })

  socket.on('event', data => { 
    console.log('msg received:', data);
    socket.emit('response', 'hello there!')
  });

  socket.on('register_client', userId => {
    console.log('revieved register_client event')
    socket.join(userId);
    socket.emit('registered');
    //socket.emit('registered')
  });
  console.log('socket.rooms: ', socket.rooms);
  socket.emit('connected');

  console.log("Socket recevied conection!");
});










/*
Create new user
POST  /users/new
*/
module.exports = app;
