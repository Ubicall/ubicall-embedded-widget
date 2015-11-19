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

    describe("#createInfo()", function() {

        before(function() {
            $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
            var id = "4b266393.b4d99c";
            var info = "<dict>\
                  <key>ScreenTitle</key>\
                  <string>Help Note</string>\
                  <key>ScreenType</key>\
                  <string>Info</string>\
                  <key>ContentText</key>\
                  <string>Increase customer satisfaction through Ubicall’s Interactive Visual Response (Visual IVR),smart form-filling, self-queueing technology and more</string>\
                  <key>__next</key>\
                  <dict>\
                    <key>id</key>\
                    <string>d8d0fdc3.272f</string>\
                  </dict>\
              </dict>";

            info = plist.parse(plistify(info, id));

            $ = htmlUtil.createInfo($, id, info);

        });

        it("should has title with @param {info.ScreenTitle}");

        it("should has content with @param {info.ContentText}");

        it("should has next link with value @param {info.__next.id}");

    });
});