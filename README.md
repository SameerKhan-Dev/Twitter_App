# Twitter App
This app allows users to share messages to the public and enables chatting between users of the app. This is a simplified clone of twitter. Currently, only the backend is implemented. The following functionality is supported through APIs & Socket communication:
  1. New user registration
  2. User login & logout
    - user information is store in a SQL database 
  3. Authenticated user can share a tweet that will be visible to the public
  4. Authenticated user can edit and delete a tweet that they updated in the future
  5. All users (authenticated & unauthenticated) can view tweets from any user
  6. Users can start a chat session with another user
     - messages can be received by an online user in realtime without having to refresh the page

## Tech Stack
  1. Node JS
  2. Express
  3. Postgres SQL as database
  4. Socket.io to enable chatting in real time
  5. bcrypt to store encrypted user password
  6. sessions are used to maintain login state
  
## Setup
  1. Install Node (this repo was tested on v10.20.1)
  2. Setup Postgres SQL DB on localhost
      1. Create DB with name `twitter_app_db`
  3. Update `.env` file with the correct credentials
  3. Run `npm install`to install node dependencies
  4. To reset the DB with seeded data run `npm run db:reset`
  5. Run `npm run start` to run server
  6. Run `npm run test` to run unit tests

## Security Consideration
There are a few critical security features that were implemented in our server:
  1. Session Authentication
    - All Post & Put APIs are protected via session authentication
    - Get APIs for chat are protected via session authentication 
  2. Bcrypt is used to encrypt user passwords before storing them in the SQL database
  3. Input from request that is used to query SQL database is escaped to avoid SQL injection

## Number of tests
I wrote unit tests for all the APIs. Due to shortage time I wasn't able to implement extensive integration tests that exercise flows across multiple APIs
  
## Future Improvements
This section higlights areas where I would like to improve the app in the future.
  1. Implement ability to retweet, like tweets and ability to comment on a tweet
  2. Improve testing coverage and implement integration tests using JEST?
  3. Authenticate the user for Socket communication (currently, we don't validate the identity of the sender)
  4. Implement pagination of messages for chat endpoint `/api/chat/conversations/messages` (currently we return all messages that belong to the conversation)
  5. Implement chatting between more than 2 users in a conversation
  6. Scrub and validate user input for API
     - although I escape input from API when querying SQL database, currently I haven't paid enough attention to validating against user input when receiving the request in my route handlers
  7. Implement a front-end that users my back-end to enable tweeting and chatting

  
