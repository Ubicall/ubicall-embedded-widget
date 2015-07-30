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

              var choices = [] ;
              for (var choice in obj[row].choices) {
                var choice = {} ;
                if (main[choice].ChoiceType == 'URL') {
                  choice.ScreenName = main[choice].url;
                } else {
                  choice.ScreenName = main[choice].ScreenName;
                }
                choice.ChoiceText = main[choice].ChoiceText;
                choices.push(choice)
              }
              var content = htmlUtil.setTitle($, obj[row].ScreenTitle) ;
              content = htmlUtil.createChoice(content, choices);
              MakeStream(content, licence_key, row);
            break;
            case "Form":

               var content = htmlUtil.setTitle($, obj[row].ScreenTitle) ;
               content = htmlUtil.setTitlecontent (content,obj[row].QueueDestination) ;
                MakeStream(content, licence_key, row);
              break;
             
              ///////

            case "Grid":


              var grids = [] ;
              for (var grid in obj[row].choices) {
                var grid = {} ;
                if (main[grid].ChoiceType == 'URL') {
                  grid.ScreenName = main[grid].url;
                } else {
                  grid.ScreenName = main[grid].ScreenName;
                }
                grid.UrlImage = main[grid].UrlImage;
                grid.ChoiceText = main[grid].ChoiceText;
                grids.push(grid)
              }
             var content = htmlUtil.setTitle($, obj[row].ScreenTitle) ;
              content = htmlUtil.createGrid(content, grids);
              MakeStream(content, licence_key, row);
              break;



          
            case "Info":

                var content = htmlUtil.setTitle($, obj[row].ScreenTitle) ;
                content = htmlUtil.createInfo(content,obj[row].ContentText );
                MakeStream(content.html(),licence_key,row);
                break;
           
              /*
            case "Call":
                // var main=obj[row].choices;
                var html ='<!DOCTYPE html><html><head></head><body><center><h1>'+obj[row].ChoiceText+'</h1><form action="/api/3rd/foo/widget/2/form" method="post">';
                 var main=obj[row].QueueDestination;
                 for(var call in main){
                html+=' <p> <label>Please enter your phone number</label></p><p> <input name="phone" type="tel" placeholder=" phone number" required="required" > <input name="qid" value="'+main[call].id+'" type="hidden"  ></p>';

                 }
                html+='<button class="btn btn-default" type="submit">Submit</button></form></center></body></html>';
                MakeStream(html,row);
                break;
                */

          }

        }


      }
      /////

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


