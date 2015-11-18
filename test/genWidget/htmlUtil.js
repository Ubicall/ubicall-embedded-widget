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
        it("should return should return div with nested anchors which has href as ScreenName or url and text ad ChoiceText", function() {

            $ = htmlUtil.setTitle($, "Choice Screen");
            $ = htmlUtil.createChoices($, [{
                "url": "http://www.fedex.com/",
                "ChoiceText": "Track Your Order"
            }, {
                "ScreenName": "7fc41f2b.803be",
                "ChoiceText": "Call Us"
            }]);

            ("Choice Screen").should.be.exactly($("#header .header").text());

            (2).should.be.exactly($("#pages .list-group").children().length);

            ("http://www.fedex.com/").should.be.exactly($("#pages .list-group :nth-child(1)").attr("href"));
            ("_blank").should.be.exactly($("#pages .list-group :nth-child(1)").attr("target"));
            ("Track Your Order").should.be.exactly($("#pages .list-group :nth-child(1)").text());

            ("7fc41f2b.803be.html").should.be.exactly($("#pages .list-group :nth-child(2)").attr("href"));
            ("Call Us").should.be.exactly($("#pages .list-group :nth-child(2)").text());

            // console.log(beautify_html($("#pages").html()));
        });
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