# Twitter App
This app allows users to share messages to the public and enables chatting between users of the app. This is a simplified clone of twitter. Currently, only the backend is implemented. The following functionality is supported through APIs & Socket communication:
  1. New user registration
  2. User login & logout
    - user information is store in a SQL database 
  3. Authenticated user can share a tweet that will be visible to the public
  4. Authenticated user can edit and delete a tweet that they posted in the past
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
  1. Install Node (this repo was tested on v12.14.1, recommended to use this node version when running to ensure full compatibility)
  2. Setup Postgres SQL DB on localhost
      2.1 Create DB with name `twitter_app`
  3. Create `.env` file with the correct credentials: Copy and paste the below lines into your env file and fill out the DB_USER, DB_PASS with your correct local credentials. Other credentials (DB_HOST, DB_NAME, SESSION_KEYS, DB_PORT) should be left as-is.
  
  // Copy-paste below lines into a new .env file in your project folder and save: 
 
       DB_HOST = localhost
       DB_USER = /*Your local user name, who owns the db/has access to db */
       DB_PASS = /*Your user password for access to db*/
       DB_NAME = twitter_app
       DB_PORT = 5432
       SESSION_KEY_PRIMARY = b6d0e7eb-8c4b-4ae4-8460-fd3a08733dcb
       SESSION_KEY_SECONDARY = 1fb2d767-ffbf-41a6-98dd-86ac2da9392e
  
Note: The session keys (SESSION_KEY_PRIMARY , SESSION_KEY_SECONDARY) would not be accessible publically in a real production project, instead these keys would be shared privately with authorized developers working on the project.
  
  5. Run `npm install`to install node dependencies
  6. To setup the PostgreSQL DB with Tables and seeded data run `npm run db:reset`
  7. Run `npm run start` to run server
  8. Run `npm run test` to run unit tests

## HTTP API Endpoints
  1. `/api`
     1. POST `/api/login`: allow user to loging using the credentials  
     1. POST `/api/logout`: allow user to logout after they are logged in
  1. `/api/users`
     1. GET `/api/users/:id`: get information about the user such as username (this API is public)
     2. POST `/api/users/new`: register a new user (this API is ;public)
  2. `/api/tweets`
     1. GET `/api/tweets/:id`: get a tweet for any user (this API is public - all tweets are viewable by the public)
     2. POST `/api/tweets`: create a new tweet for the authenticated user 
     3. PUT `/api/tweets/:id`: update a tweet that the authenticated user posted in the past
     4. DELETE `/api/tweets/:id`: delete a tweet that the authenticated user posted in the past
     5. GET `/api/tweets/user_tweets/:id`: get all tweets tweeted by user id sorted by date desc (this API is public - allows for anyone to view all the tweets for a speicific user)
  3. `/api/chats`
     1. GET `/api/chats/conversations/user`: get lists of all conversations belonging to the authenticated user (this is only the conversations and not the message in the conversations)
     2. GET `/api/chats/user/conversation/messages/:id`: get all of the message for a specific conversation for the authenticated user sorted by date desc

## Socket events
1. Events handled and received by server (emitted by client)
   1. `register_client`: emitted by client to register the autenticated user into their own `room` (https://socket.io/docs/v3/rooms/)
   2. `message`: sent by the client to the server whenever the a user sends a message for a conversation
      1. data sent in this message from client includes srcUser, dstUser & msg
      2. server take this message and adds the message to the message table and forwards it to the receiving user by emitting to their `room`
2. Events handled and received by client (emitted by server)
   1. `connected`: emitted by the server to let client know that server is ready to receive messages
   2. `registered`: emitted by the server to let the client know that server has registered the client to receive messages sent to the authenticated users
   3. `message`: emitted by the server to forward a message to a the receiving user once the message has been added to the message table.

## SQL Query Performance
Most of the queries in my database are simple queries on the primary key of the table. There were some places that didn't query using the primary key. In those situations I learned about indices to enable faster queries but due to the time constraints I wasn't able to implement it.

## Security Consideration
There are a few critical security features that were implemented in the app:
  1. Session Authentication
    - All Post & Put APIs are protected via session authentication
    - Get APIs for chat are protected via session authentication 
  2. Bcrypt is used to encrypt user passwords before storing them in the SQL database
  3. Input from request that is used to query SQL database is escaped to avoid SQL injection

## Number of tests
I wrote 22 unit tests in total for all the APIs. Due to shortage time I wasn't able to implement extensive integration tests that exercise flows across multiple APIs with the focus on testing each API endpoint.

## Challenges
There were a few challenges that I came across while working on this project. Details are below:
1. Socket communication
   - I spent alot of time debugging my socket code since the communication pattern is not one that I used in the past (I have used HTTP request in the past). One thing that helped me with this was the dummy html page that I created that allowed me to quickly iterate and test my implementation as I made changes. That page essentially has two Socket.io clients that pose as two different users that send messages back and forth repeatedly. This really helped me make significant progress.
2. Mocking session and user login
   - I hadn't done this in the past. The concept of mocking the session information to make to mock the user authentication took a bit of time to understand as I had to read through several documentations and tutorials to understand this
  
## Future Improvements
This section higlights areas where I would like to improve the app in the future.
  1. Implement ability to retweet, like tweets and ability to comment on a tweet
  2. Improve testing coverage and implement integration tests.
  3. Authenticate the user for Socket communication (currently, identity of the sender is not validated)
  4. Implement pagination of messages for chat endpoint `/api/chat/conversations/messages` (currently we return all messages that belong to the conversation)
  5. Implement chatting between more than 2 users in a conversation
  6. Escape and validate user input for API
     - although I escape input from API when querying SQL database, currently I haven't paid enough attention to validating against user input when receiving the request in my route handlers
  7. Implement a front-end that users my back-end to enable tweeting and chatting

  
