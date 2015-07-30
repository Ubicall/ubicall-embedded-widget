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
            var content = htmlUtil.setTitle($, plistObject[row].ScreenTitle);
            content = htmlUtil.createChoices(content, plistObject[row].choices);
            _MakeStream(content.html(), licence_key, row);
            break;
          case "Form":
            var content = htmlUtil.setTitle($, plistObject[row].ScreenTitle);
            content = htmlUtil.createForm(content, plistObject[row].FormFields , plistObject[row].QueueDestination.id);
            _MakeStream(content.html(), licence_key, row);
            break;
          case "Grid":
            var content = htmlUtil.setTitle($, plistObject[row].ScreenTitle);
            content = htmlUtil.createGrid(content, plistObject[row].choices);
            _MakeStream(content.html(), licence_key, row);
            break;
          case "Info":
            var content = htmlUtil.setTitle($, plistObject[row].ScreenTitle);
            content = htmlUtil.createInfo(content, plistObject[row].ContentText);
            _MakeStream(content.html(), licence_key, row);
            break;
          case "Call":
            var content = htmlUtil.setTitle($, plistObject[row].QueueDestination.name);
            content = htmlUtil.createCall(content, plistObject[row].QueueDestination.id);
            _MakeStream(content.html(), licence_key, row);
            break;
        }
      }
    }
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
