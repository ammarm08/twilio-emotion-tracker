var partials = require('express-partials');
var session = require('express-session');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

module.exports = function(app, express, passport) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('views', __dirname + '/../public/views');
  app.set('view engine', 'ejs');
  app.use(session({ resave: true, saveUninitialized: false, secret: 'ron swanson' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(partials());
  app.use(express.static(__dirname + '/../public'));
  app.use(favicon("./public/images/favicon.ico"));
};