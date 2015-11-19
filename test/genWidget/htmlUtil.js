/*jshint multistr: true */
var should = require("should");
var fs = require("fs");
var settings = require("../../settings");
var htmlUtil = require("../../genWidget/htmlUtil");
var beautify_html = require("js-beautify").html;
var cheerio = require("cheerio");
var plist = require("plist");

describe("htmlUtil functionality used to convert plist component to html ones", function() {

    var $;

    var plistify = function(xml, id) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\"><dict><key>" + id + "</key>" + xml + "</dict></plist>";
    };

    beforeEach(function() {
        $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
    });

    describe("#createUrl()", function() {
        before(function() {
            $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
            var id = "66a152ec.995eac";
            var url = "<dict>\
                        <key>ScreenTitle</key>\
                        <string>our website</string>\
                        <key>ScreenType</key>\
                        <string>URL</string>\
                        <key>url</key>\
                        <string>https://www.ubicall.com</string>\
                        <key>__next</key>\
                        <dict>\
                          <key>id</key>\
                          <string>d8dr6dc3.802p</string>\
                        </dict>\
                      </dict>";

            url = plist.parse(plistify(url, id));

            $ = htmlUtil.createChoices($, id, url);

        });

        it("should has title with @param {ScreenTitle}");

        it("should has link to and @param {__next.id} screen if exist ");

        it("should has `data-url-node` attribute equal `true`");

        it("should has `data-url` attribute equal @param {url}");

    });


});