var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server.js');

var db = require('../server/db/database');
var Data = require('../server/db/models').Data;
var User = require('../server/db/models').User;
var utils = require('../server/utils.js');

/////////////////////////////////////////////////////
// NOTE: these tests are designed for mongo.
//       remember to run mongod in terminal 
//       before running tests
/////////////////////////////////////////////////////

var testUser;

/* Authentication and Authorization */
describe('Priviledged Access:', function() {
  beforeEach(function(done) {
    request(app)
    .get('/logout')
    .end(function(err, res) {
      Data.remove({}).exec();
      User.remove({}).exec();
      console.log('[PRE] Remove all entries from test database.');
      done();
    });
  });

  describe('Routes for Unsigned Users', function() {

    it('Redirects to login page if a user tries to access the main page and is not signed in', function(done) {
      request(app)
      .get('/')
      .expect(302)
      .expect(function(res) {
        expect(res.headers.location).to.equal('/login');
      })
      .end(done);
    });

    it('Redirects to login page if a user tries to access an intermediary sign-up path and isnt signed in', function(done) {
      request(app)
        .get('/complete')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });

    it('Redirects to login page if a user tries to access an admin-only path', function(done) {
      request(app)
        .get('/api/users')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });

    it('Redirects to login page if a user tries to access any other path and isn\'t signed in', function(done) {
      request(app)
        .get('/aleftsharkkindofday')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });

  });

  // TODO: write tests
  describe('Routes for Signed-In Users', function() {

    xit('Routes to root page if an existing user signs in.', function(done) {

    });

    //Write more specs as necessary

  });

});

/* Handling Text Messages */
describe('Text Messages:', function() {

  describe('Parsing messages by type', function() {
    
    it('Logs a verbose error message if message is inappropriately formatted', function(done) {
      var notLongEnough = "5, true";
      var notAnInteger = "hi, true, test";
      var notABoolean = "5, hi, test";

      expect(typeof utils.parseMessage(notLongEnough)).to.equal("string");
      expect(typeof utils.parseMessage(notAnInteger)).to.equal("string");
      expect(typeof utils.parseMessage(notABoolean)).to.equal("string");
      done();
    });

    it('Parses message into an array of responses if message is properly formatted', function(done) {
      var validMessage = "5, no, test";
      var parsed = utils.parseMessage(validMessage);
      expect(typeof parsed).to.equal("object");
      done();
    });

    it('Returns true when message requests a "Remove", "Restart", or "Delete" action', function(done) {
      expect(utils.validAccountAction('remove')).to.equal(true);
      expect(utils.validAccountAction('restart')).to.equal(true);
      expect(utils.validAccountAction('delete')).to.equal(true);
      expect(utils.validAccountAction(' remove ')).to.equal(true);
      expect(utils.validAccountAction(' Delete ')).to.equal(true);
      done();
    });

    it('Returns false when message requests any other action', function(done) {
      expect(utils.validAccountAction('george of the jungle')).to.equal(false);
      done();
    });

  });

  // TODO: write tests
  describe('Database writing of new messages', function() {

    beforeEach(function(done) {
      var options = {
        googleid: 100371876025237260000,
        name: "Ammar Mian",
        phone_number: "+12404819157"
      };
      testUser = new User(options);

      testUser.save(function(err) {
        if (!err) {
          console.log('[PRE] Add test user to database.');
          done();
        }
      });
    });

    afterEach(function(done) {
      request(app)
      .get('/logout')
      .end(function(err, res) {
        Data.remove({}).exec();
        User.remove({}).exec();
        console.log('[POST] Remove all entries from test database.');
        done();
      });
    });

    it('Writes a properly formatted message to database', function(done) {
      var validMessage = "5, no, test";
      var parsed = utils.parseMessage(validMessage);
      utils.writeData(testUser, parsed);
      expect(testUser.children.length).to.equal(1);
      done();
    });

    it('Deletes a user if the message requests a "Delete" action', function(done) {
      utils.handleAccountAction("+12404819157", "delete", function(err, user) {
        User.find({}, function(err, docs) {
          expect(docs.length).to.equal(0);
          done();
        });
      });
    });

    it('Removes a user from textserve if the message requests a "Remove" action', function(done) {
      utils.handleAccountAction("+12404819157", "remove", function(err, user) {
        expect(user.daily_text).to.equal(false);
        done();
      });
    });

    it('Adds a user to textserve if the message requests a "Restart" action', function(done) {
      utils.handleAccountAction("+12404819157", "remove", function(err, user) {
        // this sets daily_text to FALSE
      });
      utils.handleAccountAction("+12404819157", "restart", function(err, user) {
        expect(user.daily_text).to.equal(true);
        done();
      })
    });

  });

});