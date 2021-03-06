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

const tweetsRouter = require('./routes/api-tweets.js');
const apiRouter = require('./routes/api.js');
const usersRouter = require('./routes/users.js');
const chatsRouter = require('./routes/chats.js');

const getAllConversationsForUser = require("./database/databaseHelpers/getAllConversationsForUser");
const getConversationBetweenUsers = require("./database/databaseHelpers/getConversationBetweenUsers");
const createNewConversation = require("./database/databaseHelpers/createNewConversation");

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
app.use('/api/users', usersRouter);
app.use('/api/chats', chatsRouter);

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

let server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

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

  // receive message from a client, store it in message table and send message to the receiving user
  socket.on('message', data => {  
    let conversation;
    // go add message to the database.
    getConversationBetweenUsers(data.srcUser, data.dstUser)
      .then(resConversation => {
         conversation = resConversation;
         // create a conversation if it doesn't already exist
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

  // add the client to the user's room
  socket.on('register_client', userId => {
    socket.join(`${userId}`);
    socket.emit('registered');
  });

  // let client know that server has received connection
  socket.emit('connected');

});

module.exports = app;
