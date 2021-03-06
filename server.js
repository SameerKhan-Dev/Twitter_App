// load .env data into process.env
require("dotenv").config();


// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const SESSION_KEY_PRIMARY = process.env.SESSION_KEY_PRIMARY;
const SESSION_KEY_SECONDARY = process.env.SESSION_KEY_SECONDARY;

const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const database = require("./database/database");
var path = require('path');
const bcrypt = require('bcryptjs');
const addMessage = require ('./database/databaseHelpers/addMessage');

var tweetsRouter = require('./routes/api-tweets.js');
var apiRouter = require('./routes/api.js');
const getAllConversationsForUser = require("./database/databaseHelpers/getAllConversationsForUser");
const getConversationBetweenUsers = require("./database/databaseHelpers/getConversationBetweenUsers");
const createNewConversation = require("./database/databaseHelpers/createNewConversation");

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
        SESSION_KEY_PRIMARY,
        SESSION_KEY_SECONDARY,
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
  // data schema
  // { 
  //   conversation_id: 'conversation_id    
  //   dstUser: 'receiving user id',
  //   srcUser: 'sending user id',
  //   msg: 'msg being sent'
  // }
  //
  socket.on('message', data => {
    console.log('msg received:', data);
    console.log('socket.rooms1: ', socket.rooms);
    
    let conversation;
    // go add message to the database.
    getConversationBetweenUsers(data.srcUser, data.dstUser)
      .then(resConversation => {
         conversation = resConversation;
         if (!resConversation) {
           conversation = createNewConversation(data.srcUser, data.dstUser)
         }
         return conversation;
      })
      .then(conversation => addMessage(conversation.id, data.srcUser, data.dstUser, data.msg))
      .then(response => 
        socket.to(`${data.dstUser}`).emit('message', {srcUser: data.srcUser, msg: data.msg, cId: conversation.id, mId: response.id})
      ).catch(err => 
        console.log('failed to send messsage to user with err:', err)
    );
  })

  socket.on('event', data => { 
    console.log('msg received:', data);
    socket.emit('response', 'hello there!')
  });

  socket.on('register_client', userId => {
    console.log('revieved register_client event')
    socket.join(`${userId}`);
    socket.emit('registered');
  });
  console.log('socket.rooms: ', socket.rooms);
  socket.emit('connected');

  console.log("Socket received conection!");
});

module.exports = app;
