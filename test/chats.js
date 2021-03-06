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

describe('Chats Endpoints Tests', () => {

    /**
     * 
     * Test the POST ROUTE
     */
    describe("GET /api/chats/conversations/user", () =>{

        it("It should return error status 403 - access denied when accessing by unauthenticated user", (done) => {
            
            chai.request(server)
                .get("/api/chats/conversations/user")
                .send()
                .end((err, response) => {
                    response.should.have.status(403);
                done();
                });
        })

        it("It should return success Status 200 when accessing private conversations by authenticated owner", (done) => {
            let cookie = mockSession('session', SESSION_KEY_PRIMARY, {"user_id":1});

            chai.request(server)
                .get("/api/chats/conversations/user")
                .set('cookie', [cookie])
                .send()
                .end((err, response) => {
                    response.should.have.status(200);                    
                done();
                });
        })
    })
})
