var fs = require('fs');
var beautify_html = require('js-beautify').html;
var plist = require('plist');
var request = require('request');
var mkdirp = require('mkdirp');
var htmlUtil = require('./htmlUtil.js');
var settings = require('../settings');
var when = require('when');
var cheerio = require('cheerio'),
$ = cheerio.load(fs.readFileSync(settings.mainTemplate));

function generate(plistUrl) {
  return when.promise(function(resolve,reject){
    request(plistUrl, function(error, response, body) {
      if(error){
        return reject(error)
      }
      return resolve(_parsePlist(body));
    });
  });
}

function _parsePlist(plistContent) {

  return when.promise(function(resolve,reject){
    var plistObject = plist.parse(plistContent);
    var licence_key = plistObject.key;
    for (var row in plistObject) {
      if (typeof plistObject[row] == 'object') {  // parse only plist component and leave mete info like font , version now
        var stype = plistObject[row].ScreenType;
        switch (stype) {
          case "Choice":
         
            $ = htmlUtil.createChoices($,row, plistObject[row].choices,plistObject[row].ScreenTitle);

            break;
          case "Form":
            
            $  = htmlUtil.createForm($,row, plistObject[row].FormFields , plistObject[row].QueueDestination.id,plistObject[row].FormTitle,plistObject[row].ScreenTitle);
        
            break;

          case "Grid":
            
            $ = htmlUtil.createGrid($,row, plistObject[row].choices,plistObject[row].ScreenTitle);
            
            break;
          case "Info":
       
            $ = htmlUtil.createInfo($,row, plistObject[row].ContentText,plistObject[row].ScreenTitle);
          
            break;
          case "Call":
         
          
            $ = htmlUtil.createCall($,row, plistObject[row].QueueDestination.id,plistObject[row].QueueDestination.name);
           
            break;
        }
      }
    }

     _MakeStream($.html(), licence_key, 'MainScreen');
    return resolve({});
  });
}

function _MakeStream(html, namefolder, namefile) {
  mkdirp.sync(settings.platformTemplatesPath + namefolder, 0777);
  var stream = fs.createWriteStream(settings.platformTemplatesPath + namefolder + "/" + namefile + ".html");
  stream.once('open', function() {
    stream.write(html);
    stream.end();
  });
}

module.exports = {
  generate: generate
}
