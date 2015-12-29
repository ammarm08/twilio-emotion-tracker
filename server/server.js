var express = require('express');
var app = express();
var partials = require('express-partials');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/../public/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});