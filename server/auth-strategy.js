var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var clientID = process.env.CLIENT_ID || require('config.js').clientID;
var clientSecret = process.env.CLIENT_SECRET || require('config.js').clientSecret;
var utils = require('./utils');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Change to Sequelize semantics
    utils.findOrCreateUser(profile, function(err, user) {
      if (err) return done(err, null);
      return done(null, profile);
    });
  }
));

module.exports = passport;