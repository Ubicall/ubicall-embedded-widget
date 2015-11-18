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

    describe("#createGrid()", function() {
        it("should return ul with nested li contain anchor with href as nextLink has text as text and nested image with source as iconLink", function() {

            $ = htmlUtil.setTitle($, "Grid Screen");
            var grids = [{
                ChoiceText: "Shipping Returns",
                url: "http://www.fedex.com/",
                UrlImage: "https://designer.ubicall.com/uploads/fdab76ef5814558d0e5fae788d9a7bd1.png"
            }, {
                "ChoiceText": "FAQ",
                "ScreenName": "df63be64.823108",
                "UrlImage": "https://designer.ubicall.com/uploads/509deebc910aee6633a8d7f6d0e33358.png"
            }];
            $ = htmlUtil.createGrid($, grids);

            ("Grid Screen").should.be.exactly($("#header .header").text());

            (2).should.be.exactly($("#pages ul").children().length);

            (grids[0].url).should.be.exactly($("#pages ul :nth-child(1) a").attr("href"));
            ("_blank").should.be.exactly($("#pages ul :nth-child(1) a").attr("target"));
            (grids[0].ChoiceText).should.be.exactly($("#pages ul :nth-child(1) a").text());
            (grids[0].UrlImage).should.be.exactly($("#pages ul :nth-child(1) a img").attr("src"));

            (grids[1].ScreenName + ".html").should.be.exactly($("#pages ul :nth-child(2) a").attr("href"));
            (grids[1].ChoiceText).should.be.exactly($("#pages ul :nth-child(2) a").text());
            (grids[1].UrlImage).should.be.exactly($("#pages ul :nth-child(2) a img").attr("src"));

            // console.log(beautify_html($("#pages").html()));

        });
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

    describe("#createInfo()", function() {
        it("should return paragraph with same content", function() {

            var InfoText = "this is an info message";
            $ = htmlUtil.setTitle($, "Info Screen");
            $ = htmlUtil.createInfo($, InfoText);

            ("Info Screen").should.be.exactly($("#header .header").text());

            (1).should.be.exactly($("#pages").children().length);
            (InfoText).should.be.exactly($("#pages p").text());

            // console.log(beautify_html($("#pages").html()));
        });
    });

});