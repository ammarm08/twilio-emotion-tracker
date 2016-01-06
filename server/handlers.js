var utils = require('./utils');
var twilio = require('./twilio');

var WELCOME_MESSAGE = "Thanks for signing up for the emotion tracker! We will be sending you a daily text to remind you to record your data, as well as instructions as to how we need your text to be formatted. Happy self improving!";

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.renderLogin = function(req, res) {
  res.render('login');
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};

exports.renderComplete = function(req, res) {
  res.render('complete', req.user);
}

exports.addUserNumber = function(req, res, next) {

  if (!validPhoneNumberFormat(req.body.phone_number)) {
    return res.render('index', {flashError: "Invalid phone number- must be a 10-digit number with no spaces!"});
  }

  var options = req.user;
  options.phone_number = req.body.phone_number;

  utils.findOrCreateUser(options, function(err, user) {
    if (err) return res.status(403).send(err);
    console.log(user);
    twilio.client.messages.create({
      to: user.phone_number,
      from: twilio.num,
      body: WELCOME_MESSAGE
    }, function(err, result) {
      console.log(result.sid);
    })
    res.redirect('/');
  });
};

var validPhoneNumberFormat = function(number) {
  var pattern = /(\d{10})/i;
  var found = number.match(pattern);
  return !!found;
}