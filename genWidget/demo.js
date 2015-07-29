// demo for how genWidget will generate html content for every component
var fs = require('fs');
var settings = require('../settings');
var htmlUtil = require('../genWidget/htmlUtil');
var beautify_html = require('js-beautify').html;
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));



var content = htmlUtil.setTitle($, 'SCRENN NAME');

content = htmlUtil.createGrid(content, [{
  text: 'Shipping & Returns',
  nextLink: 'e00b2cb8.70e9f8.html',
  iconLink: 'https://designer.ubicall.com/uploads/fdab76ef5814558d0e5fae788d9a7bd1.png'
}, {
  text: 'FAQ\'s',
  nextLink: 'df63be64.823108.html',
  iconLink: 'https://designer.ubicall.com/uploads/509deebc910aee6633a8d7f6d0e33358.png'
}]);


console.log(beautify_html(content.html()));
