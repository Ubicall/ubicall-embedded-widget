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

    describe("#createAction()", function() {
        before(function() {
            $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
            var id = "5872hjd.poj906";
            var action = "<dict>\
                          <key>ScreenTitle</key>\
                          <string>Send an Email To Help Center</string>\
                          <key>ScreenType</key>\
                          <string>SendEmail</string>\
                          <key>__type</key>\
                          <string>Action</string>\
                          <key>destination</key>\
                          <dict>\
                            <key>mobile</key>\
                            <dict>\
                              <key>HTTPMethod</key>\
                              <key>POST</key>\
                              <key>endPoint</key>\
                              <string>https://api.ubicall.com/v1/sip/call/701/help-center</string>\
                            </dict>\
                            <key>web</key>\
                            <dict>\
                              <key>HTTPMethod</key>\
                              <string>POST</string>\
                              <key>endPoint</key>\
                              <string>https://api.ubicall.com/v1/web/call/701/help-center</string>\
                            </dict>\
                          </dict>\
                          <key>__next</key>\
                          <dict>\
                            <key>id</key>\
                            <string>5487kgd.laax98</string>\
                          </dict>\
                        </dict>";

            action = plist.parse(plistify(action, id));

            $ = htmlUtil.createAction($, id, action);

        });

        it("should has has class `popup-01`");

        it("should has content with gif image");

        it("should has `data-action-node` attribute equal `true`");

        it("should has `data-http-method` attribute equal @param {action.destination.web.HTTPMethod}");

        it("should has `data-end-point` attribute equal @param {action.destination.web.endPoint}");

        it("should has `data-next` attribute equal @param {action.__next.id} if exist");

    });

});