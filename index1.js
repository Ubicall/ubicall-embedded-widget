var http = require('http');
var os = require( 'os' );
var fs = require('fs');
var path = require('path');

var express = require('express');
var ejs = require('ejs');
var body_parser = require('body-parser');

var defaults = {
    SERVER_PORT: 54100,
    CLIENT_PORT: 54101,
    EMBED_TYPE: 'iframe'
};

var serverPort = process.env.SERVER_PORT || defaults.SERVER_PORT;
var clientPort = process.env.CLIENT_PORT || defaults.CLIENT_PORT;
//NOTE Set EMBED_TYPE to "iframe" or "dom"
var useIframe = (process.env.EMBED_TYPE || defaults.EMBED_TYPE) === 'iframe';

console.log('useIframe', useIframe);

function getIpAddress() {
    var networkInterfaces = os.networkInterfaces();
    var keys = Object.keys(networkInterfaces);
    for (var x = 0; x < keys.length; ++x) {
        var netIf = networkInterfaces[keys[x]];
        for (var y = 0; y < netIf.length; ++ y) {
            var addr = netIf[y];
            if (addr.family === 'IPv4' && !addr.internal) {
                return addr.address;
            }
        }
    }
    return '127.0.0.1';
}

var serverHostSansProtocol = ''+getIpAddress()+':'+serverPort;
var clientHostSansProtocol = ''+getIpAddress()+':'+clientPort;
var serverHost = '//'+serverHostSansProtocol;
module.exports.serverHost = serverHost;
module.exports.serverDirname = __dirname;

var platformScriptPathTemplate = '/3rd/:platform/platform.js';
var platformStylePathTemplate = __dirname+'/views/server/3rd/:platform/platform.css';
var platformWidgetInitPathTemplate = '/3rd/:platform/plist/MainScreen.html';
module.exports.platformScriptPathTemplate = platformScriptPathTemplate;
module.exports.platformStylePathTemplate = platformStylePathTemplate;
module.exports.platformWidgetInitPathTemplate = platformWidgetInitPathTemplate;

var demo3rdPartyId = 1122334455;
//NOTE For additional security, require 3rd parties to white list
//domains that they will be pasting their snippets onto
var demo3rdPartyAllowedHostsFixtures;
if (! useIframe) {
    demo3rdPartyAllowedHostsFixtures = {
        '1122334455': [ clientHostSansProtocol ]
    };
}

//Platform server
var serverApp = express();
serverApp.use(body_parser.json());

function isValidPartyId(partyId) {
    //NOTE this check is trivial for now, of course,
    //in a production platform we would use something like an API key
    //lookup against the requested resources
    return partyId && partyId.length === 10;
}

function isOriginAllowedForThisPartyId(origin, partyId) {
    var allowedHostsForParty = demo3rdPartyAllowedHostsFixtures[''+partyId];
    // console.log('isOriginAllowedForThisPartyId', partyId, origin, allowedHostsForParty);
    if (Array.isArray(allowedHostsForParty)) {
        var hostSansProtocol = origin.split('//');
        hostSansProtocol = hostSansProtocol[hostSansProtocol.length -1];
        return (allowedHostsForParty.indexOf(hostSansProtocol) >= 0);
    }
    else {
        return false;
    }
}

//enable CORS - only if not using iframes
if (!useIframe) {
    serverApp.use(function(req, res, next) {
        //only for paths that come under /api/3rd
        if ((/^\/api\/3rd\/.+$/).test(req.path)) {
            var partyId = req.query.partyId;
            if (! isValidPartyId(partyId)) {
                res.status(403).end();
                return;
            }
            var corsOrigin = req.headers.origin;
            var corsMethod = req.headers['access-control-request-method'];
            var corsHeaders = req.headers['access-control-request-headers'];
            var hasACorsFlag = corsOrigin || corsMethod || corsHeaders;
            //console.log('cors middleware xhr', hasACorsFlag, corsOrigin, corsMethod, corsHeaders);
            if (hasACorsFlag) {
                if (req.method !== 'OPTIONS') {
                    //pre-flight check: do *not* count on query parameters being set

                    //TODO Ask each 3rd party to login to an admin panel and white list
                    //the domains that they would like to embed these widgets on
                    //Then test here that the domain matches
                    if (! isOriginAllowedForThisPartyId((corsOrigin || ''), partyId)) {
                        res.status(403).end();
                        return;
                    }
                }
                res.header('Access-Control-Allow-Origin', corsOrigin);
                res.header('Access-Control-Allow-Methods', corsMethod);
                res.header('Access-Control-Allow-Headers', corsHeaders);
                res.header('Access-Control-Max-Age', 60 * 60 * 24);
                if (req.method === 'OPTIONS') {
                    res.status(200).end();
                    return;
                }
            }
        }
        next();
    });
}

//serve platform script





serverApp.get(platformScriptPathTemplate, function(req, res) {
    var partyId = req.query.partyId;
    var platform = req.params.platform;
    var platformScriptPath = platformScriptPathTemplate.replace(':platform', platform);
    var platformStylePath = platformStylePathTemplate.replace(':platform', platform);
    //TODO inserting the CSS file into the platform script like this is quite wasteful
    //This is a prime candidate for refactoring or at the very least result caching
    fs.readFile(path.normalize(platformStylePath), function(err, data) {
        data = ((!err && data && data.toString()) || '').replace( /(?:\r\n|\r|\n)/g , ' ');
        res.render('server'+platformScriptPath, {
            partyId: partyId,
            serverHost: serverHost,
            platformScript: platformScriptPath,
            inlineCss: data,
            useIframe: useIframe
        });
    });
});


//////



//serve platform script file
fs.readdir('platforms', function(err, files) {
    var dirs = [];
    if (Array.isArray(files)) {
        dirs = files.filter(function(file) {
            return fs.statSync('platforms/'+file).isDirectory();
        });
    }
    console.log(dirs);
    serverApp.set('view engine', 'html');
    serverApp.engine('html', ejs.renderFile);
    serverApp.engine('js', ejs.renderFile);
    dirs.forEach(function(dir) {
        serverApp.use(require('./platforms/'+dir));
    });
    serverApp.use(express.static('server'));
});

//3rd party using widgets served by platform server
var clientApp = express();
clientApp.set('view engine', 'html');
clientApp.engine('html', ejs.renderFile);
clientApp.get('/favicon.ico', function(req, res) {
    res.status(404).end();
});
clientApp.get('/:platform/', function(req, res) {
    var platformScriptPath = platformScriptPathTemplate.replace(':platform', req.params.platform);
    res.render('client/'+req.params.platform+'/index', {
        partyId: demo3rdPartyId,
        serverHost: serverHost,
        platformScript: platformScriptPath
    });
});

http.createServer(serverApp).listen(serverPort);
http.createServer(clientApp).listen(clientPort);
/////////////////////////////////////

var plist = require('plist');
var obj = plist.parse(fs.readFileSync('admin6.xml', 'utf8'));
console.log(JSON.stringify(obj));

//////////////////////////////

function MakeStream(html,namefolder){
    var stream = fs.createWriteStream("views/server/3rd/foo/plist/" + namefolder + ".html");
    stream.once('open', function() {
        stream.write(html);
        stream.end();
    });
}


/////////////////////////////////////
var i=0;
 var c=1;
for( var row in obj ) {   
   
    if(i>3)
    {
        var stype = obj[row].ScreenType;
        switch (stype){
            
            //////////
            
            case "Choice":
                var main=obj[row].choices;
                var html ='<html><head></head><body><center><h1>'+obj[row].ScreenTitle+'</h1>';
               
                for(var cho in main){
                    if( main[cho].ChoiceType=='Choice'){
               
                        html+='<p><a href="'+ main[cho].ScreenName+'.html" >'+main[cho].ChoiceText+'</a></p>';
                    }
                    if(main[cho].ChoiceType=='URL'){
               
                        html+='<p><a href="'+ main[cho].url+'" >'+main[cho].ChoiceText+'</a></p>';
                    }
                    
                    else if(main[cho].ChoiceType=='Call'){
               
                        html+='<p><a href="call'+c+'.html" >'+main[cho].ChoiceText+'</a></p>';
                        
                        
                        var htmlcall ='<html><head></head><body><center><h1>'+main[cho].ChoiceText+'</h1><form action="/api/3rd/foo/widget/2/form" method="post">';
                        htmlcall+=' <p> <label>Please enter your phone number</label></p><p> <input name="phone" type="tel" placeholder=" phone number" required="required" ><input name="qid" value="'+main[cho].QueueDestination+'" type="hidden"  >  </p>';
                   

                        htmlcall+='<button class="btn btn-default" type="submit">Submit</button> </form></center></body></html>';
                        MakeStream(htmlcall,'call'+c);
                        
                        
                    }
                    else{
               
                        html+='<p><a href="'+ main[cho].ScreenName+'.html" >'+main[cho].ChoiceText+'</a></p>';
                    }
                    c++;
                }
                html+='</center></body></html>';
                MakeStream(html,row);
                break;
                
            //////
            case "Form":
                var main=obj[row].FormFields;
                var html ='<html><head></head><body><center><h1>'+obj[row].ScreenTitle+'</h1><form>';
                for(var form in main){
                    
                    
                    if( main[form].isMandatory==true){
                        html+='<p> <label>'+ main[form].FieldLabel+'</label></p><p> <input type="text" placeholder="'+ main[form].Placeholder+'" required="required" > <p>';
                    }
                    else{
                        html+='<p> <label>'+ main[form].FieldLabel+'</label></p><p> <input type="text" placeholder="'+ main[form].Placeholder+'"></p>';
                    }
                    
                }
                html+='<button class="btn btn-default" type="submit">Submit</button> </form></center></body></html>';
                MakeStream(html,row);
                break;
            ///////

            case "Grid":
                var main=obj[row].choices;
                var html ='<html><head></head><body><center><h1>'+obj[row].ScreenTitle+'</h1><ul>';
               
                for(var grid in main){
                    
                    if(main[grid].ChoiceType=='URL'){
                        html+=' <li> <a  href="'+ main[grid].url+'"> <img  src="'+ main[grid].UrlImage+'"height="50" width="50"> '+ main[grid].ChoiceText+'</a></li>';
                    }
                    else if(main[grid].ChoiceType=='Call'){
               
                        html+=' <li> <a  href="call.html"> <img  src="'+ main[grid].UrlImage+'"height="50" width="50"> '+ main[grid].ChoiceText+'</a></li>';
                        
                        
                          var htmlcall ='<html><head></head><body><center><h1>'+main[grid].ChoiceText+'</h1><form action="/api/3rd/foo/widget/2/form" method="post">';
                        htmlcall+=' <p> <label>Please enter your phone number</label></p><p> <input name="phone" type="tel" placeholder=" phone number" required="required" > <input name="qid" value="'+main[grid].QueueDestination+'" type="hidden"  ></p>';
                   

                        htmlcall+='<button class="btn btn-default" type="submit">Submit</button> </form></center></body></html>';
                        MakeStream(htmlcall,'call'+c);
                        
                    }
                    else{
                                      
                        html+=' <li> <a  href="'+ main[grid].ScreenName+'.html"> <img  src="'+ main[grid].UrlImage+'"height="50" width="50"> '+ main[grid].ChoiceText+'</a></li>';
                    }
                    c++;
                }
                html+='</ul></center></body></html>';
                MakeStream(html,row);
                break;
            //////////
            case "URL":
                var main=obj[row].choices;
                var html ='<html><head></head><body><center><h1>'+obj[row].ScreenTitle+'</h1><ul>';
                html+='<p><a href="'+obj[row].URL+'" >'+obj[row].ChoiceText+'</a></p>';
                html+='</ul></center></body></html>';
                MakeStream(html,row);
                break;
            ///////////
            case "Info":
                var main=obj[row].choices;
                var html ='<html><head></head><body><center><h1>'+obj[row].ScreenTitle+'</h1><ul>';
                html+='<div>'+obj[row].ContentText+'</div>';
                html+='</ul></center></body></html>';
                MakeStream(html,row);
                break;
                
            case "Call":
                // var main=obj[row].choices;
                var html ='<html><head></head><body><center><h1>'+obj[row].ChoiceText+'</h1><form action="/api/3rd/foo/widget/2/form" method="post">';
                 var main=obj[row].QueueDestination;
                 for(var call in main){
                html+=' <p> <label>Please enter your phone number</label></p><p> <input name="phone" type="tel" placeholder=" phone number" required="required" > <input name="qid" value="'+main[call].id+'" type="hidden"  ></p>';
                 
                 }
                html+='<button class="btn btn-default" type="submit">Submit</button></form></center></body></html>';
                MakeStream(html,row);
                break;
                
        }
    }
    
    i++;
}
 
/////


