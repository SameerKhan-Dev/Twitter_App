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
            userName: null,
            email: "mike@email.com",
            password: "helloWorld"
        }
        xit("It should return error if userName is missing when registering", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userOne)
                .end((err, response) => {
                    response.should.have.status(400);
                    console.log("RESPONSE IS: ", response);
                    assert.strictEqual(response.text, "incomplete - user registration form - you must specify userName, email and password to register");
                done();
                });
        })

        const userTwo = {
            userName: "Jake10",
            email: "jakethree@email.com",
            password: "helloWorld"
        }

        it("It should return error if userName is not unique", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userTwo)
                .end((err, response) => {
                    //response.should.have.status(400);
                    assert.strictEqual(response.text, "invalid registration - username already exists");
                done();
                });
        })

        const userThree = {
            userName: "mike10",
            email: null,
            password: "helloWorld"
        }

        xit("It should return error if email is missing when registering", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userThree)
                .end((err, response) => {
                    response.should.have.status(400);
                    assert.strictEqual(response.text, "incomplete - user registration form - you must specify userName, email and password to register");
                    done();
                });
        })

        const userFour = {
            userName: "mike10",
            email: "mike@email.com",
            password: null
        }

        xit("It should return error if password is missing when registering", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userFour)
                .end((err, response) => {
                    response.should.have.status(400);
                    assert.strictEqual(response.text, "incomplete - user registration form - you must specify userName, email and password to register");
                    done();
                });
        })

        const userFive = {
            userName: "mikemike101",
            email: "mike@email.com",
            password: "helloWorld"
        }

       xit("It should return success message when successfully registered", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userFive)
                .end((err, response) => {
                    response.should.have.status(200);
                    assert.strictEqual(response.text, "successful registration");
                    done();
                });
        })
        const userSix = {
            userName: "jack101",
            email: "jack@email.com",
            password: "helloWorld2"
        }
        xit("It should verify if cookie is present in response header", (done) => {
            chai.request(server)
                .post("/users/new")
                .send(userSix)
                .end((err, response) => {
                    response.should.have.status(500);
                    //expect(response).to.have.cookie('user_id');
                    done();
                });
        })
    })
})