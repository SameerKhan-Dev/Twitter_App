const express = require("express");
var router = express.Router();

const get_all_conversations_for_user = require('../database/databaseHelpers/getAllConversationsForUser');
const get_conversation = require('../database/databaseHelpers/getConversation');

// load .env data into process.env
require("dotenv").config();

const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");

const morgan = require("morgan");
const cookieSession = require("cookie-session");
const database = require("../database/database");
var path = require('path');
const bcrypt = require('bcryptjs');
const get_all_messages_for_conversation = require("../database/databaseHelpers/getAllMessagesForConversation");

// route handler to get list of conversations belonging to logged-in user
router.get('/conversations/user', (req, res) => {

  let user_id = req.session.user_id;

  if (user_id) {
    get_all_conversations_for_user(user_id)
      .then(response => {
        if (response) {
          return res.status(200).send(response);
        } else {
          return res.status(500).send("server error");
        }
      }).catch(err => {
        res.status(500).send("server error");
      })
  } else {
    res.status(403).send("access denied");
  }
});

// route handler to get list of messages belonging to a specific conversation
router.get('/conversation/messages/:id', (req, res) => {

  const user_id = req.session.user_id;
 
  if (user_id) {
    const conversation_id = req.params.id;
    get_conversation(conversation_id)
      .then(response => {
        // if conversation exists, and current logged in user owns it, then get all messages for that conversation
        if (response) {
          if (response.user_one_id === user_id || response.user_two_id === user_id) {
            get_all_messages_for_conversation(conversation_id)
              .then(response => {
                if (response) {
                  return res.status(200).send(response);
                } else {
                  return res.status(500).send("server error");
                }
              })
          } else {
            return res.status(403).send("access denied");
          }
        } else {
          return res.status(500).send("server error");
        }
      }).catch(err => {
        res.status(500).send("server error");
      })
  } else {
    res.status(403).send("access denied");
  }
});

module.exports = router;