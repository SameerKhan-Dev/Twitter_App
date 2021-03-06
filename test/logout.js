const chai = require("chai");
const server = require("../server.js");
const chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
// Assertion Style
chai.should();
chai.use(chaiHttp);
const resetdb = require('../bin/resetdb.js');

resetdb();

describe('Logout Tests', () => {

    /**INSERT INTO "users" (userName, email, password)
VALUES    
  ('Jake10','jake.Wunsch@yahoo.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),  
  ('Anna12','Anna_padberg@email.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
  ('Kuvalis','Kuvalis@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.')

     * 
     * Test the POST ROUTE
     */
    describe("POST /api/logout", () =>{
        let cookieSession = [];
        const userOne = {
            email: "Anna_padberg@email.com",
            password: "password"
        }
        xit("It verifies that a session-cookie is cleared from response when a user logs out", (done) => {
            chai.request(server)
                .post("/api/login")
                .send(userOne)
                .end((err, response) => {
                    response.should.have.status(200);
                    //console.log("response.header is: ", response.header);
                    cookieSession = response.header['set-cookie'];
                    assert.strictEqual(cookieSession.length > 0, true);

                    chai.request(server)
                    .post("/api/logout")
                    .send()
                    .end((err, response) => {
                        //response.should.have.status(200);
                        //console.log("response.header is: ", response.header);
                        cookieSession = response.header['set-cookie'];
                        assert.strictEqual(cookieSession, undefined);
                        done();
                    });
                });
        })
    })
})
