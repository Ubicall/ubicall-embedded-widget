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

    describe("#createChoices()", function() {
        before(function() {
            $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
            var id = "3dd947db.c226b8";
            var choice = "<dict>\
                          <key>ScreenTitle</key>\
                          <string>Help Types</string>\
                          <key>ScreenType</key>\
                          <string>Choice</string>\
                          <key>choices</key>\
                          <array>\
                            <dict>\
                              <key>ChoiceText</key>\
                              <string>Sales</string>\
                              <key>__next</key>\
                              <dict>\
                                <key>id</key>\
                                <string>d8d0fdc3.272f</string>\
                              </dict>\
                            </dict>\
                            <dict>\
                              <key>ChoiceText</key>\
                              <string>Subscriptions</string>\
                              <key>__next</key>\
                              <dict>\
                                <key>id</key>\
                                <string>kiad65rf.55fg9</string>\
                              </dict>\
                            </dict>\
                            <dict>\
                              <key>ChoiceText</key>\
                              <string>Technical support</string>\
                              <key>__next</key>\
                              <dict>\
                                <key>id</key>\
                                <string>66a152ec.995eac</string>\
                              </dict>\
                            </dict>\
                          </array>\
                        </dict>";

            choice = plist.parse(plistify(choice, id));

            $ = htmlUtil.createChoices($, id, choice);

        });

        it("should has @{choices} has same size as @param {choice.wires}");

        it("should has choices with length @param {choice.choices}");

        it("should has title with @param {choice.name}");

        it("should has choice with next wire in same order");

    });

});