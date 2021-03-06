const express = require("express");
var router = express.Router();
const add_new_user = require('../database/databaseHelpers/addNewUser');
const check_unique_userName = require('../database/databaseHelpers/checkUniqueUserName');
const get_user_by_email = require('../database/databaseHelpers/getUserByEmail');
const add_message = require('../database/databaseHelpers/addMessage');
const get_conversation_between_users = require('../database/databaseHelpers/getConversationBetweenUsers');
const create_new_conversation = require('../database/databaseHelpers/createNewConversation');
const get_all_conversations_for_user = require('../database/databaseHelpers/getAllConversationsForUser');
const get_all_messages_for_conversation = require('../database/databaseHelpers/getAllMessagesForConversation');
const get_all_messages_of_user = require('../database/databaseHelpers/getAllMessagesOfUser');
const add_new_tweet = require('../database/databaseHelpers/addNewTweet');
const get_tweet_owner = require('../database/databaseHelpers/getTweetOwner');
const update_tweet = require('../database/databaseHelpers/updateTweet');
const delete_tweet = require('../database/databaseHelpers/deleteTweet');
const get_tweet = require('../database/databaseHelpers/getTweet');
const get_all_tweets_for_user = require('../database/databaseHelpers/getAllTweetsForUser');
const getUserById = require("../database/databaseHelpers/getUserById");


// route handler for posting a tweet to /api/tweets
router.post("/", (req, res) => {

  const user_id = req.session.user_id;
  // validate cookie present in request (i.e authenticated user)
  if (user_id) {
    const description = req.body.description;
    if (description === null) {
      res.status(400).send("error description can not be empty");
    } else {

      //push tweet into database
      add_new_tweet(user_id, description)
        .then(response => {
          if (response) {
            return res.status(200).send("tweet posted successfully");
          } else {
            return res.status(500).send("server error");
          }
        }).catch(err => {
          res.status(500).send("failed server error");
        })
    }

  } else {
    res.status(403).send("error - unauthorized access");
  }
});

// route handler for updating a tweet to /api/tweets/:id
router.put("/:id", (req, res) => {

  const user_id = req.session.user_id;

  // validate cookie present in request (i.e authenticated user) before proceeding
  if (user_id) {
    const tweet_id = req.params.id;
    const description = req.body.description;

    get_tweet_owner(tweet_id)
      .then(response => {

        if (response) {
          // validate current logged in user is the owner of tweet to proceed with updating tweet
          if (user_id === response.creator_id) {
            return update_tweet(description, tweet_id)
              .then(response => {
                if (response) {
                  return res.status(200).send("tweet successfully updated");
                } else {
                  return res.status(500).send("server error");
                }
              })
          } else {
            return res.status(403).send("denied access to update tweet, because you are not owner of tweet");
          }
        } else {
          return res.status(400).send("bad request, tweet does not exist");
        }
      }).catch(err => {
        return res.status(500).send("server error");
      })
  } else {
    return res.status(403).send("error - unauthorized access");
  }
});


// validate cookie present in request (i.e authenticated user)
router.delete("/:id", (req, res) => {

  const user_id = req.session.user_id;
  if (user_id) {
    const tweet_id = req.params.id;
    const description = req.body.description;

    get_tweet_owner(tweet_id)
      .then(response => {

        if (response) {
          // validate current logged in user is the owner of tweet to allow deleting tweet
          if (user_id === response.creator_id) {
            return delete_tweet(tweet_id)
              .then(response => {
                if (response) {
                  return res.status(200).send("tweet successfully deleted");
                } else {
                  return res.status(500).send("server error");
                }
              })
          } else {
            return res.status(403).send("denied access to delete tweet, because you are not owner of tweet");
          }
        } else {
          return res.status(400).send("bad request, tweet does not exist");
        }
      }).catch(err => {
        console.log('err:', err)
        return res.status(500).send("server error");
      })
  } else {
    return res.status(403).send("error - unauthorized access");
  }
});


// each tweet is a public accessible data, no authentication required to read/view.
router.get('/:id', (req, res) => {

  let tweet_id = req.params.id;

  get_tweet(tweet_id)
    .then(response => {
      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(400).send("bad request. tweet does not exist");
      }
    })
    .catch(err => {
      res.status(500).send("server error");
    })
});

/*
GET All tweets for a User:
*/
// user tweets are public
router.get('/user_tweets/:id', (req, res) => {
  let creator_id = req.params.id;

  get_all_tweets_for_user(creator_id)
    .then(response => {
      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(400).send("bad request. user not found.");
      }
    })
    .catch(err => {
      res.status(500).send("server error");
    })
});


module.exports = router;
