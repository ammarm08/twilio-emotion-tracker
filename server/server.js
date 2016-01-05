var app = require('./server-config');
var port = process.env.PORT || 3000;

// START SERVER
app.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});

module.exports = app;