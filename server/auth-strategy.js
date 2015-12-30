var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var clientID = process.env.CLIENT_ID || require('./config.js').google.clientID;
var clientSecret = process.env.CLIENT_SECRET || require('./config.js').google.clientSecret;
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
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

module.exports = passport;