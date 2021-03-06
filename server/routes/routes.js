var twilio = require('../twilio');
var utils = require('../utils');
var handlers = require('./routeHandlers');
var demoData = require('../demo/demoData');

module.exports = function(app, passport) {

  app.get('/', utils.checkUser, utils.checkUserRegistry, handlers.renderIndex);
  app.get('/complete', utils.checkUser, handlers.renderComplete);
  app.post('/complete', utils.checkUser, handlers.addUserNumber);
  app.get('/login', handlers.renderLogin);
  app.get('/logout', handlers.logout);
  app.get('/demo', handlers.renderDemo);

  // OAUTH ROUTES
  app.get('/auth/google',
    passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }),
    function(req, res, next) {
      // do nothing
  });

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
  });

  // DATA ROUTES
  app.get('/api/users', utils.checkUser, utils.checkUserRegistry, function(req, res) {

    utils.findOrCreateUser(req.user, function(err, user) {
      if (err) return res.status(404).json([]);
      var results = user.children;
      res.status(200).json(results);
    });

  });

  app.get('/api/demo', function(req, res) {

    demoData(function(data) {
      res.status(200).json(data);
    });

  });

  // TWILIO ROUTES
  app.post('/api/messages', function(req, res) {
    if (twilio.handler.validateExpressRequest(req, twilio.authToken)) {
      utils.handleTextMessage(req.body, twilio.client, twilio.num, function(err, data) {
        if (err) return res.set('Content-Type', 'text/xml').status(400).send(err);
        res.set('Content-Type', 'text/xml').status(201).send(data);
      });
    } else {
      res.set('Content-Type', 'text/xml').status(403).send("Error handling text messsage. Check your request params");
    }
   
  });

  // ALL OTHER ROUTES
  app.get('/*', utils.checkUser, function(req, res, next) {
    res.redirect('/');
  })
};