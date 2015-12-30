var express = require('express');
var app = express();
var passport = require('./auth-strategy.js');
var port = process.env.PORT || 3000;

// INITIALIZE APP
require('./server-config')(app, express, passport);
require('./routes')(app, passport);

// START SERVER
app.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});