var fs = require('fs');
var path = require('path');
var express = require('express');
var body_parser = require('body-parser');
var http = require('http');
var request = require('request');
var settings = require('../settings');
var genWidget = require('./genWidget');

var platformApp = express();

platformApp.use(bodyParser.json());
platformApp.use(bodyParser.urlencoded({
  extended: true
}));

platformApp.post('/widget', function(req, res) {
  if (req.body.plistUrl && settings.plistHostRegex.test(req.body.plistUrl)) {
    if (genWidget.generate(req.body.plistUrl)) {
      res.status(200).json({
        message: "widget generated successfully"
      });
    } else {
      res.status(500).json({
        message: "error generating widget , plist may be courrpted"
      });
    }
  } else {
    res.status(401).json({
      message: "not authorized plist server"
    });
  }

});

http.createServer(serverApp).listen(settings.serverPort);
module.exports = platformApp;
