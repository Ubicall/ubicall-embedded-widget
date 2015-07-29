var fs = require('fs');
var beautify_html = require('js-beautify').html;
var plist = require('plist');
var request = require('request');
var htmlUtil = require('./htmlUtil.js');
var settings = require('../settings');
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));

function generate(plistUrl) {
  request(plistUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      if (_parsePlist(body)) {
        res.status(200).json({
          message: "widget generated successfully"
        });
      } else {
        res.status(500).json({
          message: "error generating widget , plist may be courrpted"
        })
      }
    } else {
      res.status(500).json({
        message: "error generating widget , plist may be courrpted"
      })
    }
  });
}


function _parsePlist(plistContent) {
  var plistObject = plist.parse(plistContent);
  var licence_key = plistObject.key;
  for (var row in plistObject) {
    if (typeof plistObject[row] == 'object') {
      var stype = plistObject[row].ScreenType;
      switch (stype) {
        case "Choice":
          var content = htmlUtil.setTitle($, plistObject[row].ScreenTitle);
          content = htmlUtil.createChoice(content, plistObject[row]);
          _MakeStream(content.html(), licence_key, row);
        case "Form":
          var main = plistObject[row].FormFields;
          var html = '<!DOCTYPE html><html><head><meta charset="utf-8" /> < link href = "http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/bootstrap.min.css"
          rel = "stylesheet" / > < link href = "http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/style-fonts.css"
          rel = "stylesheet" / > < link href = "http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/plist.css"
          rel = "stylesheet" / > < link href = "http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/animsition.css"
          rel = "stylesheet" / > < /head><body><!-- Header --><div id="header"><a onClick="javascript:history.go(-1)"><i class="fa fa-chevron-left fa-left"></i > < /a><a href="MainScreen.html"><i class="fa fa-home fa-right"></i > < /a><h3>' + plistObject[row].ScreenTitle + '</h
          3 > < /div><!-- Animsition --><div class="animsition"><!-- Pages --><div id="pages"><form>';
          for (var form in main) {
            if (main[form].isMandatory == true) {
              html += '<div class="form-group"> <label>' +
                main[form].FieldLabel + '</label></p><p> <input  class="form-control" type="text" placeholder="' + main[form].Placeholder + '" required="required" ></div>';
            } else {
              html += ' <div class="form-group"><label>' + main[form].FieldLabel + '</label></p><p> <input  class="form-control" type="text" placeholder="' + main[form].Placeholder + '"></div>';
            }
          }
          html += '<button type="submit" class="btn btn-default">Submit</button></form></div><!-- Page End --></div><!-- js --><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/jquery.min.js"></script><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/animsition.js"></script><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/cust.js"></script></body></html>';
          _MakeStream(html, licence_key, row);
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
    } else {
      return false;
    }
  }
  return true;
}

function _MakeStream(html, namefolder, namefile) {
  var stream = fs.createWriteStream(settings.platformTemplatesPath + namefolder + "/" + namefile + ".html");
  stream.once('open', function() {
    stream.write(html);
    stream.end();
  });
}

module.exports = {
  generate: generate
}
