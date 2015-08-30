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


function __endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function extractIvr(req, res, next) {
  var ivr = {};
  ivr.licence_key = req.params.licence_key;
  ivr.version = req.params.version;

  if (!ivr.licence_key) {
    res.status(422).json({
      message: "Validation Failed",
      errors: [{
        field: "licence_key",
        code: "missing_field"
      }]
    });
  }

  if (!ivr.version) {
    res.status(422).json({
      message: "Validation Failed",
      errors: [{
        field: "version",
        code: "missing_field"
      }]
    });
  }

  var plistHost = req.header('plistHost') || settings.plistHost;
  if (!__endsWith(plistHost, "/")) {
    plistHost += "/";
  }

  ivr.plistUrl = plistHost + ivr.licence_key + "/" + ivr.version;

  req.ubi = req.ubi || {};
  req.ubi.plistUrl = ivr.plistUrl;

  next();

}

function updateWidget(req, res, next) {
  //End generate plist url
  //TODO check if plist hosted under *.ubicall.com otherwise 401 unauthorized
  var plistUrl = req.ubi.plistUrl;
  genWidget.generate(plistUrl).then(function() {
    log.info("Widget generated successfully from " + plistUrl)
    res.status(200).json({
      message: "Widget generated successfully"
    });
  }).otherwise(function(err) {
    log.error("Error generating widget from " + plistUrl + ' ' + err)
    res.status(500).json({
      message: "Error generating widget , plist may be courrpted"
    });
  });
}

platformApp.post('/api/widget/:licence_key/:version', extractIvr, updateWidget);

platformApp.put('/api/widget/:licence_key/:version', extractIvr, updateWidget);


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
