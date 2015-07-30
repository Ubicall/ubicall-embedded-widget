var fs = require('fs');
var path = require('path');
var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');
var settings = require('./settings');
var genWidget = require('./genWidget');
var log = require('./log');

process.env.node_env = process.env.node_env || 'development';

var platformApp = express();

var server = http.createServer(function(req, res) {
  platformApp(req, res);
});


platformApp.use(bodyParser.json());
platformApp.use(bodyParser.urlencoded({
  extended: false
}));

platformApp.post('/api/widget', function(req, res) {
  if (req.body.plistUrl && settings.plistHostRegex.test(req.body.plistUrl)) {
    genWidget.generate(req.body.plistUrl).then(function(){
      log.info("Widget generated successfully from " + req.body.plistUrl)
      res.status(200).json({
        message: "Widget generated successfully"
      });
    }).otherwise(function(err){
      log.error("Error generating widget from " + req.body.plistUrl + ' ' + err)
      res.status(500).json({
        message: "Error generating widget , plist may be courrpted"
      });
    });
  } else {
    log.error("Unauthorized plist server " + req.body.url)
    res.status(401).json({
      message: "Unauthorized plist server"
    });
  }
});


function getListenPath() {
    var listenPath = 'http' + (settings.https ? 's' : '') + '://' +
        (settings.host == '0.0.0.0' ? '127.0.0.1' : settings.host) +
        ':' + settings.port || 7575;
    return listenPath;
}


server.on('error', function(err) {
  if (err.errno === "EADDRINUSE") {
    log.error('Unable to listen on ' + getListenPath());
    log.error('Error: port in use');
  } else {
    log.error('Uncaught Exception:');
    if (err.stack) {
      log.error(err.stack);
    } else {
      log.error(err);
    }
  }
  process.exit(1);
});


server.listen(settings.port || 7575, settings.host || '0.0.0.0', function() {
  process.title = 'widget';
  log.info('Server running now on  ' + process.env.node_env + " Mode ");
  log.info('Server now running at ' + getListenPath());
});

process.on('uncaughtException', function(err) {
  log.error('[Widget] Uncaught Exception:');
  if (err.stack) {
    log.error(err.stack);
  } else {
    log.error(err);
  }
  process.exit(1);
});

process.on('unhandledRejection', function(err) {
  log.error('[Widget] unhandled Rejection:');
  if (err.stack) {
    log.error(err.stack);
  } else {
    log.error(err);
  }
});

process.on('SIGINT', function() {
  process.exit();
});
