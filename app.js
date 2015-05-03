//Dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

app.get('/*', function (req, res) {
  res.redirect('/index.html');
});

var server = app.listen(port, function () {
  console.log('Starter App Listening at port', port);
});