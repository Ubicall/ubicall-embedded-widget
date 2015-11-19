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

    describe("#createCall()", function() {
        before(function() {
            $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
            var id = "5872hjd.poj906";
            var call = "<dict>\
                        <key>ScreenTitle</key>\
                        <string>call our customer support</string>\
                        <key>ScreenType</key>\
                        <string>SubmitCall</string>\
                        <key>destination</key>\
                        <dict>\
                          <key>mobile</key>\
                          <dict>\
                            <key>HTTPMethod</key>\
                            <key>POST</key>\
                            <key>endPoint</key>\
                            <string>https://api.ubicall.com/v1/sip/call/201/customer-support</string>\
                          </dict>\
                          <key>web</key>\
                          <dict>\
                            <key>HTTPMethod</key>\
                            <key>POST</key>\
                            <key>endPoint</key>\
                            <string>https://api.ubicall.com/v1/web/call/201/customer-support</string>\
                          </dict>\
                        </dict>\
                        <key>__next</key>\
                        <dict>\
                          <key>id</key>\
                          <string>d8d0fdc3.272f</string>\
                        </dict>\
                      </dict>";

            call = plist.parse(plistify(call, id));

            $ = htmlUtil.createChoices($, id, call);

        });

        it("should has title with @param {ScreenTitle}");

    });

});