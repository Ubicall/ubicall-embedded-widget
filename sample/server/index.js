var express = require('express');
var ejs = require('ejs');
var body_parser = require('body-parser');
var settings = require('./settings');

var clientApp = express();
clientApp.set('view engine', 'html');
clientApp.engine('html', ejs.renderFile);
clientApp.get('/favicon.ico', function(req, res) {
  res.status(404).end();
});

clientApp.get('/demo', function(req, res) {
  var platformScriptPath = platformScriptPathTemplate.replace(':platform', req.params.platform);
  res.render('client/' + req.params.platform + '/index', {
    partyId: demo3rdPartyId,
    serverHost: serverHost,
    platformScript: platformScriptPath
  });
});
http.createServer(clientApp).listen(1880);
