var fs = require("fs");
var when = require("when");
var cheerio = require("cheerio");
var beautify_html = require("js-beautify").html;
var plist = require("plist");
var request = require("request");
var mkdirp = require("mkdirp");
var htmlUtil = require("./htmlUtil.js");
var settings = require("../settings");

function _MakeStream_widget(html, licence_key) {
    mkdirp.sync(settings.platformTemplatesPath, 0777);
    var stream = fs.createWriteStream(settings.platformTemplatesPath + "/widget" + licence_key + ".html");
    stream.once("open", function() {
        stream.write(html);
        stream.end();
    });
}

function _MakeStream_popUp(html, licence_key) {
    mkdirp.sync(settings.platformTemplatesPath, 0777);
    var stream = fs.createWriteStream(settings.platformTemplatesPath + "/" + licence_key + ".html");
    stream.once("open", function() {
        stream.write(html);
        stream.end();
    });
}

function parsePlist(plistContent) {
    return when.promise(function(resolve, reject) {
        var plistObject = plist.parse(plistContent);
        var licence_key = plistObject.key;
        plistObject.theme = plistObject.theme || "Default";
        if (!licence_key) {
            return reject("plist has no licence_key");
        }
        var $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
        var $$ = cheerio.load(fs.readFileSync(settings.mainTemplate_popUp));
        var home = plistObject.__home.id;

        $ = htmlUtil.Set_Home($, home);

        for (var row in plistObject) {
            if (typeof plistObject[row] === "object") { // parse only plist component
                var stype = plistObject[row].ScreenType;
                switch (stype) {
                    case "Choice":
                        $ = htmlUtil.createChoices($, row, plistObject[row].choices, plistObject[row].ScreenTitle, home);
                        break;
                    case "Form":
                        $ = htmlUtil.createForm($, row, plistObject[row], home);
                        break;
                    case "ZendeskForm":
                        $ = htmlUtil.createForm($, row, plistObject[row], home);
                        break;
                    case "Grid":
                        $ = htmlUtil.createGrid($, row, plistObject[row].choices, plistObject[row].ScreenTitle, home);
                        break;
                    case "Info":
                        $ = htmlUtil.createInfo($, row, plistObject[row], home);
                        break;

                    case "URL":
                        $ = htmlUtil.createUrl($, row, plistObject[row], home);
                        break;

                    case "SubmitCall":
                        $ = htmlUtil.createCall($, row, plistObject[row], home);
                        break;

                    case "SendEmail":
                        $ = htmlUtil.createAction($, row, plistObject[row], home);
                        break;
                    case "SubmitZendeskTicket":
                        $ = htmlUtil.createAction($, row, plistObject[row], home);
                        break;
                    case "ZopimChat":
                        $ = htmlUtil.createZopim($, row, plistObject[row], home);
                        break;


                }
            } else if (typeof plistObject[row] === "string" || plistObject[row] instanceof String) { //work with mete info like font , version ,theme
                switch (row.toLowerCase()) {
                    case "theme":
                        $ = htmlUtil.applyTheme($, plistObject[row], settings.themeHost);
                        break;
                }
            }
        }

        $$ = htmlUtil.createWidget($$, licence_key, "Help", "https://cdn-dev.ubicall.com/static/ubicall/images/time-icon.png");

        _MakeStream_widget($.html(), licence_key);
        _MakeStream_popUp($$.html(), licence_key);
        return resolve({});
    });
}

module.exports = {
    parsePlist: parsePlist
};