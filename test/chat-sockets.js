const chai = require("chai");
const server = require("../server.js");
const { assert, expect } = require("chai");

var io = require('socket.io-client');

var app = require('../server.js');
const getAllMessagesForConversation = require("../database/databaseHelpers/getAllMessagesForConversation.js");
const resetdb = require("../bin/resetdb.js");

var socketUrl = 'http://localhost:8080';

var options = {
  transports: ['websocket'],
  'force new connection': true
}


describe('Socket Tests For Chat', () => {
  beforeEach(() => resetdb());

  it("Send a message to chat vi socket", done => {
    let client1, client2;

    // Set up client1 connection
    client1 = io.connect(socketUrl, options)

    // Validate the message that client1 receives from client2
    client1.on('message', data => {
      expect(data.srcUser).to.equal(2);
      expect(data.msg).to.equal('test message');
      client1.disconnect();
      client2.disconnect();
      done();
    });

    client1.on('connected', () => {
      // Register the client to user 1's room once server has established connection
      client1.emit('register_client', 1)
    });


    client1.on('registered', () => {
      
      // Set up client2 connections
      client2 = io.connect(socketUrl, options);

      client2.on('connected', () => {
        // Register the client to the user 2's room once server has established connection
        client2.emit('register_client', 2)
      });

      client2.on('registered', () => {
        // send message to be received by user 1
        client2.emit('message', {
          srcUser: 2,
          dstUser: 1,
          msg: 'test message',
        });
      });
    });
  });

  it("Send a messages in chat", done => {
    let client1, client2;
    let client1ReceivedMsg, client2ReceivedMsg;

    // Set up client1 connection
    client1 = io.connect(socketUrl, options)

    client1.on('message', data => {
      client1ReceivedMsg = data;
      client1.emit('message', {
        srcUser: 1,
        dstUser: 2,
        msg: 'test message 2',
      })
    });

    client1.on('connected', () => {
      client1.emit('register_client', 1)
    });

    client1.on('registered', () => {
      // Set up client2 connections
      client2 = io.connect(socketUrl, options);

      client2.on('message', data => {
        client2ReceivedMsg = data;

        expect(client1ReceivedMsg.srcUser).to.equal(2);
        expect(client1ReceivedMsg.msg).to.equal('test message 1');

        expect(client2ReceivedMsg.srcUser).to.equal(1);
        expect(client2ReceivedMsg.msg).to.equal('test message 2');

        getAllMessagesForConversation(client1ReceivedMsg.cId)
          .then(msgs => {
            expect(msgs.find(e => (e.srcUser === 1 && e.dstUser == 2 && msg === 'test message 3'))).not.equal(null);
            expect(msgs.find(e => (e.srcUser === 2 && e.dstUser == 1 && msg === 'test message 1'))).not.equal(null);
            client1.disconnect();
            client2.disconnect();
            done();
          })
          .catch(err => done(err))
      });

      client2.on('connected', () => {
        client2.emit('register_client', 2)
      });

      client2.on('registered', () => {
        client2.emit('message', {
          srcUser: 2,
          dstUser: 1,
          msg: 'test message 1',
        })
      })
    })
  })
})