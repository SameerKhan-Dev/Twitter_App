const chai = require("chai");
const server = require("../server.js");
const chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
// Assertion Style
chai.should();
chai.use(chaiHttp);
const resetdb = require('../bin/resetdb.js');
const mockSession = require('mock-session');
require("dotenv").config();

const SESSION_KEY_PRIMARY = process.env.SESSION_KEY_PRIMARY;
const SESSION_KEY_SECONDARY = process.env.SESSION_KEY_SECONDARY;

resetdb();

describe('Tweets Endpoints Tests', () => {

    /**
     * 
     * Test the POST ROUTE
     */
    describe("POST /api/tweets", () =>{

        const tweet1 = {
            description : "Snowstorm bad weather today."
        }
        it("It should return error access denied (WHEN POSTING TWEET) if user is not logged in / authenticated", (done) => {
            chai.request(server)
                .post("/api/tweets")
                .send(tweet1)
                .end((err, response) => {
                    response.should.have.status(403);
                done();
                });
        })

        it("It should return success 200 Status when tweet is submitted successfully by a valid logged in user", (done) => {
            let cookie = mockSession('session', SESSION_KEY_PRIMARY, {"user_id":1});

            chai.request(server)
                .post("/api/tweets")
                .set('cookie', [cookie])
                .send(tweet1)
                .end((err, response) => {
                    response.should.have.status(200);                    
                done();
                });
        })
    })
    

   describe("PUT /api/tweets/:id", () =>{

       const updatedTweet = {
           description : "Snowstorm bad weather today."
       }
       
       it("It should return error access denied (WHEN UPDATING TWEET) if user is not logged in / authenticated", (done) => {
           chai.request(server)
               .put("/api/tweets/1")
               .send(updatedTweet)
               .end((err, response) => {
                   response.should.have.status(403);
               done();
               });
       })

       it("It should return success 200 Status when tweet is Updated successfully by a valid logged in user", (done) => {
           let cookie = mockSession('session', SESSION_KEY_PRIMARY, {"user_id":1});

           chai.request(server)
               .put("/api/tweets/1")
               .set('cookie', [cookie])
               .send(updatedTweet)
               .end((err, response) => {
                   response.should.have.status(200);                    
               done();
               });
       })
   })

   describe("DELETE /api/tweets/:id", () => {
            
        it("It should return error access denied (WHEN DELETING TWEET) if user is not logged in / authenticated", (done) => {
            chai.request(server)
                .delete("/api/tweets/1")
                .send()
                .end((err, response) => {
                    response.should.have.status(403);
                done();
                });
        })

        it("It should return success 200 Status when tweet is Deleted successfully by a valid logged in user", (done) => {
            let cookie = mockSession('session', SESSION_KEY_PRIMARY, {"user_id":1});

            chai.request(server)
                .delete("/api/tweets/1")
                .set('cookie', [cookie])
                .send()
                .end((err, response) => {
                    response.should.have.status(200);                    
                done();
                });
        })

    })

   describe("GET /api/tweets/:id", () => {
            
    it("It should return success 200 Status when reading tweet with a specific tweet_id", (done) => {

        chai.request(server)
            .get("/api/tweets/2")
            .send()
            .end((err, response) => {
                response.should.have.status(200);                    
            done();
            });
    })

    it("It should return error 400 Status when reading a tweet that doesnt exist", (done) => {

        chai.request(server)
            .get("/api/tweets/200")
            .send()
            .end((err, response) => {
                response.should.have.status(400);                    
            done();
            });
    })

   })

   describe("GET /api/tweets/user_tweets/:id", () => {
            
    it("It should return success 200 Status when getting all tweets for a valid user", (done) => {

        chai.request(server)
            .get("/api/tweets/user_tweets/1")
            .send()
            .end((err, response) => {
                response.should.have.status(200);                    
            done();
            });
    })

   })

})


// each tweet is a public accessible data, no authentication required to read/view.
