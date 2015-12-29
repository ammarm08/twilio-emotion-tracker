var express = require('express');
var app = express();
var partials = require('express-partials');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

var config = require('./config.js') || undefined;
var accountSid = process.env.TWILIO_SID || config.twilio.account;
var authToken = process.env.TWILIO_AUTH || config.twilio.token;
var twilio = require('twilio')(accountSid, authToken);

var passport = require('./auth-strategy.js');
var session = require('express-session');
var utils = require('./utils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/../public/views');
app.set('view engine', 'ejs');
app.use(session({ resave: true, saveUninitialized: false, secret: 'ron swanson' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(partials());
app.use(express.static(__dirname + '/../public'));

app.get('/', utils.checkUser, function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res, next) {
  res.render('login');
});

app.post('/api/messages', function(req, res) {
  if (twilio.validateExpressRequest(req, accountSid)) {
    var twiml = new twilio.TwimlResponse();
    twiml.say('express sez - hello twilio!');

    res.type('text/xml');
    res.send(twiml.toString());
  }
  else {
    res.status(403).send('you are not twilio. Buzz off.');
  }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }),
  function(req, res, next) {
    // nothing
});

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

/* Wildcard */
app.get('/*', utils.checkUser, function(req, res, next) {
  res.redirect('/');
})

app.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});