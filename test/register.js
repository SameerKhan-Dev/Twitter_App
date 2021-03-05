const chai = require("chai");
const server = require("../server.js");
const chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Registration Tests', () => {

    /**
     * 
     * Test the POST ROUTE
     */
    describe("POST /users/new", () =>{
        const userOne = {
            userName: "mike",
            email: "mike@email.com",
            password: null
        }

        it("It should return error if userName is missing when registering", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.body.should.have.status(401);
                    assert.strictEqual(response.body, "Invalid registration - missing userName.");
            });
        })

        it("It should return error if userName is not unique", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.body.should.have.status(401);
                    assert.strictEqual(response.body, "Invalid registration - missing userName.");
            });
        })

        it("It should return error if email is missing when registering", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.body.should.have.status(401);
                    assert.strictEqual(response.body, "Invalid registration - missing email.");
            });
        })

        it("It should return error if password is missing when registering", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.body.should.have.status(401);
                    assert.strictEqual(response.body, "Invalid registration - missing password");
            });
        })

        it("It should return success message when successfully registered", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.body.should.have.status(200);
                    assert.strictEqual(response.body, "successful registration");
            });
        })
        
        it("It should verify if cookie is present in response header", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.body.should.have.status(500);
                    expect(response).to.have.cookie('user_id');
            });
        })

    })
})