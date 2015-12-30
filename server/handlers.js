var utils = require('./utils');

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
  var options = req.user;
  options.phone_number = req.body.phone_number;
  utils.findOrCreateUser(options, function(err, user) {
    if (err) return res.status(403).send(err);
    console.log(user);
    res.render('index');
  });
}