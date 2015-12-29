var db = require('./db/database');
var User = require('./db/userModel');

exports.checkUser = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

exports.isAuthorizedUser = function (req, res, next) {
  var id = req.user.id || null;

  // Change to Sequelize semantics
  User.findOne({googleid: id}, function(err, user) {
    if (err) return res.status(401).send('Unauthorized User');
    req.persistedUser = user;
    return next();
  });
}

exports.findOrCreateUser = function (profile, callback) {
  findUser(profile, function(exists) {
    if (exists) return callback(null, exists);

    var options = {
      googleid: profile.id, 
      name: profile.displayName,
      prestige: 10,
      massAppeal: 10,
      weirdFactor: 10,
      funFactor: 10,
      score: {x: 0, y: 0},
    };

    // Change to Sequelize semantics
    var newUser = new User(options);

    newUser.save(function(user) {
      return callback(null, user);
    });
    
  });

}

var findUser = function (options, callback) {

  // Change to Sequelize semantics
  User.findOne({googleid: options.id}, function(err, doc) {
    return doc ? callback(doc) : callback(null);
  })
};