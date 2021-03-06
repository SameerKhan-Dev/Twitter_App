const chai = require("chai");
const server = require("../server.js");
const chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
// Assertion Style
chai.should();
chai.use(chaiHttp);
const resetdb = require('../bin/resetdb.js');

resetdb();

describe('Login Tests', () => {

  describe("POST /api/login", () => {

    const userOne = {
      email: "bell_rogers@email.com",
      password: "helloWorld"
    }
    it("It should return error if user email does not exist in database, i.e no user registered with the email", (done) => {
      chai.request(server)
        .post("/api/login")
        .send(userOne)
        .end((err, response) => {
          assert.strictEqual(response.text, "invalid email - email is not registered");
          done();
        });
    })

    const userTwo = {
      email: "jake.Wunsch@yahoo.com",
      password: "hellohello" // actual password is : "password".
    }

    it("It should return error if incorrect password entered for inputted email", (done) => {

      chai.request(server)
        .post("/api/login")
        .send(userTwo)
        .end((err, response) => {
          assert.strictEqual(response.text, "incorrect password");
          done();
        });
    })

    const userThree = {
      email: "Anna_padberg@email.com",
      password: "password"
    }

    it("It should return successful login message when user credentials are correct", (done) => {
      chai.request(server)
        .post("/api/login")
        .send(userThree)
        .end((err, response) => {
          response.should.have.status(200);
          assert.strictEqual(response.text, "login successful");
          done();
        });
    })

    const userFour = {
      email: "Anna_padberg@email.com",
      password: "password"
    }

    it("It verifies that a session-cookie in header is set when user logins in sucessfully", (done) => {
      chai.request(server)
        .post("/api/login")
        .send(userFour)
        .end((err, response) => {
          response.should.have.status(200);
          let cookiesSession = response.header['set-cookie'];
          assert.strictEqual(cookiesSession.length > 0, true);
          done();
        });
    })
  })
})

