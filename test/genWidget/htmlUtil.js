var should = require("should");
var fs = require("fs");
var settings = require("../../settings");
var htmlUtil = require("../../genWidget/htmlUtil");
var beautify_html = require("js-beautify").html;
var cheerio = require("cheerio");

describe("htmlUtil functionality used to convert plist component to html ones", function() {

    var $;

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
            var choice = {
                id: "3dd947db.c226b8",
                name: "Help Types",
                type: "view-choice",
                choices: [{
                    text: "Sales"
                }, {
                    text: "Subscriptions"
                }, {
                    text: "Technical support"
                }],
                wires: [
                    ["d8d0fdc3.272f"],
                    ["kiad65rf.55fg9"],
                    ["66a152ec.995eac"]
                ],
                x: 357,
                y: 141,
                z: "17032888.e8fcd7"
            };

            $ = htmlUtil.createChoices($, choice.id, choice);

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