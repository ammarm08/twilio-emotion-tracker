var twilio = require('./twilio');
var utils = require('./utils');
var handlers = require('./handlers');

module.exports = function(app, passport) {

  app.get('/', utils.checkUser, utils.checkUserRegistry, handlers.renderIndex);
  app.get('/complete', handlers.renderComplete);
  app.post('/complete', handlers.addUserNumber);
  app.get('/login', handlers.renderLogin);
  app.get('/logout', handlers.logout);

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
  app.get('/api/users', function(req, res) {

    utils.findOrCreateUser(req.user, function(err, user) {
      if (err) return res.status(404).json([]);
      var results = user.children;
      res.status(200).json(results);
    });

  }) 

  // TWILIO ROUTES
  app.post('/api/messages', function(req, res) {
    if (twilio.handler.validateExpressRequest(req, twilio.authToken)) {
      utils.handleTextMessage(req.body, twilio.client, twilio.num, function(err, data) {
        if (err) return res.status(403).send(err);
        res.status(201).send(data);
      });
    } else {
      res.status(403).send("Error handling text messsage. Check your request params");
    }
   
  });

  // ALL OTHER ROUTES
  app.get('/*', utils.checkUser, function(req, res, next) {
    res.redirect('/');
  })
};