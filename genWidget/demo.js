// demo for how genWidget will generate html content for every component
var fs = require('fs');
var settings = require('../settings');
var htmlUtil = require('../genWidget/htmlUtil');
var beautify_html = require('js-beautify').html;
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));



var content = htmlUtil.setTitle($, 'choice SCRENN') ;
content = htmlUtil.createCall($ , 5);
// content = htmlUtil.createChoices(content,
//     [
//     		{"ScreenName":"http://www.fedex.com/","ChoiceText":"Track Your Order"},
//     		{"ScreenName":"eeeba174.b1edc","ChoiceText":"Returns & Exchange"},
//     		{"ScreenName":"622f68d9.41c69","ChoiceText":"Shipping Rates"},
//     		{"ScreenName":"95934b1b.df9038","ChoiceText":"Warranty"},
//     		{"ScreenName":"3834cdc.a475fb2","ChoiceText":"Speak to an Agent"}
//     ]);

/*
var content = htmlUtil.setTitle($, 'INFO SCRENN') ;
content = htmlUtil.createInfo(content , 'contentsssssssssssssssssssssssssssssssss');
*/


/*var content = htmlUtil.setTitle($, 'SCRENN NAME');

content = htmlUtil.createGrid(content, [{
  text: 'Shipping & Returns',
  nextLink: 'e00b2cb8.70e9f8.html',
  iconLink: 'https://designer.ubicall.com/uploads/fdab76ef5814558d0e5fae788d9a7bd1.png'
}, {
  text: 'FAQ\'s',
  nextLink: 'df63be64.823108.html',
  iconLink: 'https://designer.ubicall.com/uploads/509deebc910aee6633a8d7f6d0e33358.png'
}]);*/


console.log(beautify_html(content.html()));
