var fs = require('fs');
var path = require('path');
var express = require('express');
var body_parser = require('body-parser');
var http = require('http');
var request = require('request');
var settings = require('../settings');


//Platform server
var platformApp = express();
platformApp.use(body_parser.json());


function isValidPartyId(partyId) {
  //NOTE this check is trivial for now, of course,
  //in a production platform we would use something like an API key
  //lookup against the requested resources
  return partyId && partyId.length === 10;
}

//respond to widget API
platformApp.get('/api/3rd/widget/:partyId', function(req, res) {
  var partyId = req.param.partyId;
  if(partId && isValidPartyId(partId)){
    // folder contain @partId widget components
    res.sendFile( settings.platformTemplatesPath + partyId +  '/MainScreen.html' );
  }else {
    res.redirect(settings.widgetError);
  }
});




///////////////////////////////////////////////

platformApp.get('/api/3rd/widget:path/call/call/:page/:qid', function(req, res) {

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var id = req.params.qid

  if (req.params.page == 'web') {
    var url = 'http://ws.ubicall.com/webservice/get_web_acc.php?sdk_name=0000&sdk_version=0000&deviceuid=0000&device_token=0000&device_name=0000&device_model=0000&device_version=0000&licence_key=e6053eb8d35e02ae40beeeacef203c1a';
    console.log('url id ' + url);


    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {

        var json_data = JSON.parse(body);

        var user = json_data.data.username;
        var pass = json_data.data.password;

        ////////////////

        // TODO change next web service fro GET to Post and use https instead of http
        // TODO move this call to client
        var url = 'http://ws.ubicall.com/webservice/get_schedule_web_call.php?voiceuser_id=' + user + '&license_key=e6053eb8d35e02ae40beeeacef203c1a&ipaddress=' + ip + '&time=0&address=test&qid=' + id;
        console.log('url id ' + url);
        request(url, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("ws2 : " + body); // Show the HTML for the Modulus homepage.
          } else {
            console.log("ws2 ERR : " + error)
          }
        });


        ///////////////

        res.render('server/3rd/generated/' + req.params.path + '/freeswitch.html', {
          username: user,
          pass: pass

        });

      } else {
        res.send("ERR : " + error);
      }
    });





  } else {
    res.render('server/3rd/generated/' + req.params.path + '/call_phone', {
      qid: req.params.qid
    });

  }

});



///////////////////////////////////////////




var bodyParser = require("body-parser");
var parseBody = bodyParser.urlencoded({
  extended: true
});

platformApp.post('/api/3rd/widget/:path/form', parseBody, function(req, res) {
  //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var id = req.body.qid;
  var phone = req.body.phone;
  var ip = "10.0.0.161";


  var url = 'http://ws.ubicall.com/webservice/get_schedule_web_call.php?voiceuser_id=' + phone + '&license_key=123123123&ipaddress=' + ip + '&time=0&address=test&qid=' + id;
  console.log('url id ' + url);
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Show the HTML for the Modulus homepage.
    } else {
      console.log("ERR : " + error)
    }
  });

  /////////////////////////
  res.status(201);
  res.send("Sent successfully");
  // res.render('server/3rd/foo/plist/MainScreen.html');

});





platformApp.get('/api/3rd/widget/:path/call/:qid', function(req, res) {

  res.render('server/3rd/generated/' + req.params.path + '/call.html', {
    qid: req.params.qid

  });


});





platformApp.get('/api/3rd/widget/:path/:page', function(req, res) {

  res.render('server/3rd/generated/' + req.params.path + '/' + req.params.page);


});


module.exports = platformApp;
