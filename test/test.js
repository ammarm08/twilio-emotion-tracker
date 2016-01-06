var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server.js');

var db = require('../server/db/database');
var Data = require('../server/db/models').Data;
var User = require('../server/db/models').User;
var utils = require('../server/utils.js');

/////////////////////////////////////////////////////
// NOTE: these tests are designed for mongo
/////////////////////////////////////////////////////

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

/* New User Creation */
describe('Account Creation:', function() {
  
  // Include a beforeEach and/or afterEach function if necessary

  // TODO: write tests
  describe('Server handling of new users', function() {
    
    xit('Redirects new user to root after account creation', function(done) {
    
    });

    xit('Sends a new user a text message after account creation', function(done) {

    });

  });

  // TODO: write tests
  describe('Database writing of new users', function() {
    
    xit('Does not write a new user to database if user has no associated phone number', function(done) {
    
    });

    xit('Writes a new user to database if user has valid phone number and googleID', function(done) {

    });

  });

});

/* Handling Text Messages */
describe('Text Messages:', function() {
  
  // Include a beforeEach and/or afterEach function if necessary

  // TODO: write tests
  describe('Server handling of new messages', function() {
    
    xit('Throws an error if message isn\'t comma separated', function(done) {

    });

    xit('Throws an error if message has less than three answers', function(done) {

    });

    xit('Throws an error if message has more than three answers', function(done) {

    });

    xit('Throws an error if the first answer is not an integer', function(done) {

    });

    xit('Throws an error if the second answer is not "yes" or "no"', function(done) {

    });

    xit('Sends an affirmative text back if message is appropriately formatted', function(done) {

    });

  });

  // TODO: write tests
  describe('Parsing messages by type', function() {
    
    it('Logs a verbose error message if message is inappropriately formatted', function(done) {
      var notLongEnough = "5, true";
      var notAnInteger = "hi, true, test";
      var notABoolean = "5, hi, test";

      expect(utils.parseMessage(notLongEnough)).to.equal("Invalid format: Not enough arguments");
      expect(utils.parseMessage(notAnInteger)).to.equal("Invalid format: First argument must be a number");
      expect(utils.parseMessage(notABoolean)).to.equal("Invalid format: Second arg must be yes or no");
      done();
    });

    it('Parses message into an array of responses if message is properly formatted', function(done) {
      var validMessage = "5, no, test";
      var parsed = utils.parseMessage(validMessage);
      expect(typeof parsed).to.equal("object");
      done();
    });

    it('Returns true when message requests a "Stop", "Reset", or "Delete" action', function(done) {
      expect(utils.validAccountAction('remove')).to.equal(true);
      expect(utils.validAccountAction('restart')).to.equal(true);
      expect(utils.validAccountAction('delete')).to.equal(true);
      expect(utils.validAccountAction(' remove ')).to.equal(true);
      done();
    });

    it('Returns false when message requests any other action', function(done) {
      expect(utils.validAccountAction('george of the jungle')).to.equal(false);
      done();
    });

  });

  // TODO: write tests
  describe('Database writing of new messages', function() {
    
    xit('Does not write an improperly formatted message to database', function(done) {
    
    });

    xit('Writes a properly formatted message to database', function(done) {

    });

    xit('Deletes a user if the message requests a "Delete" action', function(done) {

    });

    xit('Removes a user from textserve if the message requests a "Stop" action', function(done) {

    });

    xit('Adds a user to textserve if the message requests a "Restart" action', function(done) {

    });

  });

});