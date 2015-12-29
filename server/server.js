var express = require('express');
var app = express();
var partials = require('express-partials');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

var config = require('./config.js');
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
  twilio.sendMessage({

    to:'2404819157', // Any number Twilio can deliver to
    from: '2406509223', // A number you bought from Twilio and can use for outbound communication
    body: 'testing node back-end.' // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
        res.status(201).send("Message successfully sent");

    }
  });
})

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