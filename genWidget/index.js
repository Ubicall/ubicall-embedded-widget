var jquery = require( "jquery" );
var htmlUtil =  require('./htmlUtil.js');
var fs = require('fs');
var settings = require('../settings');
var beautify_html = require('js-beautify').html;
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));

// TODO : enhance generate html function
// TODO : use statndard libraries to manipulate and create html in suggest https://www.npmjs.com/package/jquery
// TODO : there is no function in world has 150 line of code , it's buggy
// TODO : why not seperate function such createForm() , createCall() , createChoice() ... and add them in htmlUtil.js


function generate(plistUrl){
  request(plistUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {

      //  console.log(body);
      var plist = require('plist');
      var obj = plist.parse(body);
      console.log(JSON.stringify(obj));

      ///////////
      var c = 1;
      var licence_key = obj.key;

      for (var row in obj) {


        if (typeof obj[row] == 'object') {



          var stype = obj[row].ScreenType;
          switch (stype) {

            //////////

            case "Choice":

               var content = htmlUtil.setTitle($, obj[row].ScreenTitle) ;
                content = htmlUtil.createChoice(content,obj[row] );
                MakeStream(content.html(),licence_key,row);

            case "Form":
              var main = obj[row].FormFields;
              var html = '<!DOCTYPE html><html><head><meta charset="utf-8" />
              <link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/bootstrap.min.css" rel="stylesheet" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/style-fonts.css" rel="stylesheet" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/plist.css" rel="stylesheet" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/animsition.css" rel="stylesheet" /></head><body><!-- Header --><div id="header"><a onClick="javascript:history.go(-1)"><i class="fa fa-chevron-left fa-left"></i></a><a href="MainScreen.html"><i class="fa fa-home fa-right"></i></a><h3>' + obj[row].ScreenTitle + '</h3></div><!-- Animsition --><div class="animsition"><!-- Pages --><div id="pages"><form>';
              for (var form in main) {


                if (main[form].isMandatory == true) {
                  html += '<div class="form-group"> <label>' +
                  main[form].FieldLabel + '</label></p><p> <input  class="form-control" type="text" placeholder="' + main[form].Placeholder + '" required="required" ></div>';
                } else {
                  html += ' <div class="form-group"><label>' + main[form].FieldLabel + '</label></p><p> <input  class="form-control" type="text" placeholder="' + main[form].Placeholder + '"></div>';
                }
              }


              html += '<button type="submit" class="btn btn-default">Submit</button></form></div><!-- Page End --></div><!-- js --><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/jquery.min.js"></script><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/animsition.js"></script><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/cust.js"></script></body></html>';
              MakeStream(html, licence_key, row);
              break;
              ///////

            case "Grid":


              var grids = [] ;
              for (var grid in obj[row].choices) {
                var grid = {} ;
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
              MakeStream(content, licence_key, row);
              break;


            case "Info":

                var content = htmlUtil.setTitle($, obj[row].ScreenTitle) ;
                content = htmlUtil.createInfo(content,obj[row].ContentText );
                MakeStream(content.html(),licence_key,row);
                break;


            case "Call":
                var content = htmlUtil.setTitle($, obj[row].QueueDestination.name) ;
                content = htmlUtil.createCall(content,obj[row].QueueDestination.id);
                MakeStream(content.html(),licence_key,row);
                break;
          }
        }
      }

      res.sendStatus(200)

    } else {

      res.sendStatus(500);
    }
  });
}


function MakeStream(html, namefolder, namefile) {
  mkdirp.sync('views/server/3rd/foo/' + namefolder, 0777);
  var stream = fs.createWriteStream("/home/sand/Kode/nKode/ubicallwidget/static/generated/" + namefolder + "/" + namefile + ".html");
  stream.once('open', function() {
    stream.write(html);
    stream.end();
  });
}

module.exports = {
  generate : generate
}
