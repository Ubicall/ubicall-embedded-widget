var fs = require('fs');
var path = require('path');
var express = require('express');
var body_parser = require('body-parser');
var http = require('http');
var mainServer = require('../..');
var request = require('request');


var platformScriptPath = mainServer.platformScriptPathTemplate.replace(':platform', 'foo') ;// = '/3rd/foo/platform.js';
var platformStylePath = mainServer.platformStylePathTemplate.replace(':platform', 'foo') ;// = mainServer.serverDirname+'/views/server/3rd/foo/platform.css';
//var platformWidgetInitPath = mainServer.platformWidgetInitPathTemplate.replace(':platform', 'foo') ;// = '/3rd/foo/widget-init.html';

//Platform server
var platformApp = express();
platformApp.use(body_parser.json());

//respond to widget API
platformApp.get('/api/3rd/foo/widget/:id/init', function(req, res) {
    var id = req.params.id;
    var partyId = req.query.partyId;
    var isIframe = req.query.iframe === 'true';
    

    var platformWidgetInitPath = mainServer.platformWidgetInitPathTemplate.replace(':path', id) ;// = '/3rd/foo/widget-init.html';
    res.render('server'+platformWidgetInitPath, {
        id: id,
        partyId: partyId,
        serverHost: mainServer.serverHost,
        isIframe: isIframe
    });
});




///////////////////////////////////////////////

platformApp.get('/api/3rd/foo/widget/:path/call/call/:page/:qid', function(req, res) {
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var id =req.params.qid
    
    if(req.params.page == 'web'){ 
        var url = 'http://ws.ubicall.com/webservice/get_web_acc.php?sdk_name=0000&sdk_version=0000&deviceuid=0000&device_token=0000&device_name=0000&device_model=0000&device_version=0000&licence_key=e6053eb8d35e02ae40beeeacef203c1a';
        console.log('url id ' + url);
      
      
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var json_data=JSON.parse(body);

                var  user = json_data.data.username;
                var pass = json_data.data.password;
                
                ////////////////
               
                
                 var url = 'http://ws.ubicall.com/webservice/get_schedule_web_call.php?voiceuser_id='+user+'&license_key=e6053eb8d35e02ae40beeeacef203c1a&ipaddress='+ip+'&time=0&address=test&qid='+id;
    console.log('url id ' + url);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("ws2 : " + body); // Show the HTML for the Modulus homepage.
        }else{
            console.log("ws2 ERR : " + error)
        }
    });
                
                
                ///////////////

                res.render('server/3rd/foo/'+req.params.path+'/freeswitch.html',{
                    username:user,
                    pass:pass
           
                });
    
            }else{
                res.send("ERR : " + error);
            }
        });

   
       

       
    }
    else{
        res.render('server/3rd/foo/'+req.params.path+'/call_phone', {
            qid: req.params.qid
        });
        
    }

});



///////////////////////////////////////////




var bodyParser = require("body-parser");
var parseBody = bodyParser.urlencoded({
    extended: true
});

platformApp.post('/api/3rd/foo/widget/:path/form',parseBody, function(req, res) {
    //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var id= req.body.qid;
    var phone= req.body.phone;
    var ip = "10.0.0.161";
  

    var url = 'http://ws.ubicall.com/webservice/get_schedule_web_call.php?voiceuser_id='+phone+'&license_key=123123123&ipaddress='+ip+'&time=0&address=test&qid='+id;
    console.log('url id ' + url);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
        }else{
            console.log("ERR : " + error)
        }
    });

    /////////////////////////
    res.status(201);
    res.send("Sent successfully");
// res.render('server/3rd/foo/plist/MainScreen.html');
   
});





platformApp.get('/api/3rd/foo/widget/:path/call/:qid', function(req, res) {

    res.render('server/3rd/foo/'+req.params.path+'/call.html', {
        qid: req.params.qid
       
    });


});





platformApp.get('/api/3rd/foo/widget/:path/:aaa', function(req, res) {
  
    res.render('server/3rd/foo/'+req.params.path+'/'+req.params.aaa);
  
  
});

platformApp.post('/api/3rd/foo/widget/:id/:action', function(req, res) {
    var id = req.params.id;
    var action = req.params.action;
    var partyId = req.query.partyId;
    res.send({
        action: req.params.action,
        success: true, //In this demo, all actions succeed
        content: req.body
    });
});

module.exports = platformApp;
