var utils = require('../utils');
var twilio = require('../twilio');

var WELCOME_MESSAGE = "Hello, this is Sigmund. I commend you for prioritizing your health. Expect a daily message from me to remind you to record your data. All you need to do is follow the instructions. Happy self-improving!";

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

// pass username to EJS template
exports.renderComplete = function(req, res) {
  var name = {displayName: req.user.displayName};
  res.render('complete', name);
}

exports.renderDemo = function(req, res) {
  res.render('demo');
}

// when a user submits his phone number to complete the sign-up process
exports.addUserNumber = function(req, res, next) {

  // this shouldn't ever be hit since the client takes care of this too,
  // but just in case.
  if (!validPhoneNumberFormat(req.body.phone_number)) {
    return res.render('index', {flashError: "Invalid phone number- must be a 10-digit number with no spaces!"});
  }

  var options = req.user;
  options.phone_number = req.body.phone_number;

  // find or create user
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

    // user can finally go to the home page
    res.redirect('/');
  });
};

// must be 10 consecutive integers, no spaces or other symbols
var validPhoneNumberFormat = function(number) {
  var pattern = /(\d{10})/i;
  var found = number.match(pattern);
  return !!found;
}