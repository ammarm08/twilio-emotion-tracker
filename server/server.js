// GLOBAL MODULES
var express = require('express');
var app = express();
var partials = require('express-partials');
var session = require('express-session');
var bodyParser = require('body-parser');
var twilio = require('twilio');

// LOCAL MODULES
var passport = require('./auth-strategy.js');
var utils = require('./utils');

// KEYS
var port = process.env.PORT || 3000;
var accountSid = process.env.TWILIO_SID || require('./config.js').twilio.account;
var authToken = process.env.TWILIO_AUTH || require('./config.js').twilio.token;
var twilioNum = process.env.NUM || require('./config.js').twilio.number;

// APP SETTINGS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/../public/views');
app.set('view engine', 'ejs');
app.use(session({ resave: true, saveUninitialized: false, secret: 'ron swanson' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(partials());
app.use(express.static(__dirname + '/../public'));

// TWILIO CLIENT
var client = twilio(accountSid, authToken);

// RENDERED ROUTES
app.get('/', utils.checkUser, utils.checkUserRegistry, function(req, res) {
  console.log(req);
  res.render('index');
});

app.get('/complete', function(req, res, next) {
  res.render('complete', req.user);
});

app.post('/complete', function(req, res, next) {
  var options = req.user;
  options.phone_number = req.body.phone_number;
  utils.findOrCreateUser(options, function(err, user) {
    if (err) return res.status(403).send(err);
    console.log(user);
    res.render('index');
  })
})

app.get('/login', function(req, res, next) {
  res.render('login');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

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

// TWILIO ROUTES
app.post('/api/messages', function(req, res) {

  if (req.body.SmsStatus === 'received' && req.body.AccountSid === accountSid) {
    utils.handleTextMessage(req.body, client, twilioNum, function(err, data) {
      if (err) return res.status(403).send(err);
      res.status(201).send(data);
    });
  } else {
    res.status(403).send("Error handling text messsage. Check your request params");
  }
 
});

//test route!
// app.get('/api/messages', function(req, res) {
//   var message1 = "5, yes, I had to pack for my trip to NYC "; // it works
//   var message2 = "5, yes"; // not enough args
//   var message3 = "yo, no"; // first is not an int
//   var message4 = "5, si"; // second is not yes/no
//   var message5 = "5, no, I had to pack for my trip to NYC, and then drive to the bus stop"; // third is long
//   var parsed1 = utils.parse(message1);
//   var parsed2 = utils.parse(message2);
//   var parsed3 = utils.parse(message3);
//   var parsed4 = utils.parse(message4);
//   var parsed5 = utils.parse(message5);

//   utils.writeData(req.user, parsed1, function(err, message) {
//     if (err) return res.status(403).send(err);
//     console.log(message);
//     res.status(201).json(message);
//   });
// })

// ALL OTHER ROUTES
app.get('/*', utils.checkUser, function(req, res, next) {
  res.redirect('/');
})

// START SERVER
app.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});