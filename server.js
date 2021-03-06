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

var tweetsRouter = require('./routes/api-tweets.js');
var apiRouter = require('./routes/api.js');


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

  // need a function to get all conversations belonging to a user
  // need a function to get all messages belonging to a user
  // need a function to get all messages belonging to a conversation
  // need a function to add message 
  // need a function to check if a conversation between 2 users already exists
  // need a function to add a new conversation if it doesnt exist. 


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
