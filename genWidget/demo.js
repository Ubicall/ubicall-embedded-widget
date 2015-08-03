// will be deleted after moving all of examples to test/genWidget/htmlUtil.js
var fs = require('fs');
var settings = require('../settings');
var htmlUtil = require('../genWidget/htmlUtil');
var beautify_html = require('js-beautify').html;
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));


//content = htmlUtil.createCall($, 5);

content = htmlUtil.createForm(content,
   [
         {
            "FieldLabel":"hi",
            "FieldType":"Selector",
            "isMandatory":true,
            "Keyboard":"1",
            "Placeholder":"hi",
            "Values":[
               "aaa",
               "2222",
               "111"
            ]
         }
      ]
      ,4,'hhhhhh'
    );



console.log(beautify_html(content.html()));
