var fs = require('fs');
var beautify_html = require('js-beautify').html;
var plist = require('plist');
var request = require('request');
var mkdirp = require('mkdirp');
var htmlUtil = require('./htmlUtil.js');
var settings = require('../settings');
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));

function generate(plistUrl) {
  request(plistUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      return _parsePlist(body);
    } else {
      return false;
    }
  });
}

function _parsePlist(plistContent) {
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
          content = htmlUtil.createForm(content, plistObject[row].FormFields);
          _MakeStream(content.html(), licence_key, row);
          break;
        case "Grid":
          var grids = [];
          for (var grid in plistObject[row].choices) {
            var grid = {};
            if (main[grid].ChoiceType == 'URL') {
              grid.nextLink = main[grid].url;
            } else {
              grid.nextLink = main[grid].ScreenName;
            }
            grid.iconLink = main[grid].UrlImage;
            grid.text = main[grid].ChoiceText;
            grids.push(grid)
          }
          content = htmlUtil.createGrid(content, grids);
          _MakeStream(content, licence_key, row);
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
  return true;
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
