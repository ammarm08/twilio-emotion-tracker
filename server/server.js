//NEW RELIC AVAILABILITY MONITORING
require('newrelic');

var app = require('./server-config');
var port = process.env.PORT || 3000;

// START SERVER
app.listen(port, function() {
  console.log('Listening on:' + port);
});

module.exports = app;