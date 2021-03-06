const express = require("express");
var router = express.Router();
const add_new_user = require('../database/databaseHelpers/addNewUser');
const check_unique_userName = require('../database/databaseHelpers/checkUniqueUserName');
const get_user_by_email = require ('../database/databaseHelpers/getUserByEmail');
const get_user_by_id = require ('../database/databaseHelpers/getUserById');
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

// get list of conversations belonging to logged-in user
router.get('/conversations/user', (req, res) => {

    //let user_id = req.session.user_id;
    let user_id = 1;
    
    if(user_id){
        get_all_conversations_for_user(user_id)
            .then(response => {
                if(response){
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

module.exports = router;
