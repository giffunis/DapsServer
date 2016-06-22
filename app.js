

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

var fs = require("fs");
var https = require("https");

// var options = {
//   key: fs.readFileSync('cert/daps-key.pem').toString(),
//   cert: fs.readFileSync('cert/daps-cert.pem').toString(),
//   passphrase: 'password'
// };

var options = {
  key: fs.readFileSync('cert/daps-2016-key.pem').toString(),
  cert: fs.readFileSync('cert/daps-2016-cert.pem').toString()
};

require('./config/express')(app, config);

var server = app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

var serverSecure = https.createServer(options, app);
serverSecure.listen(4000, function() {
  console.log('Express serverSecure listening on port ' + server.address().port);
});
