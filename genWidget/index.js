var fs = require("fs");
var beautify_html = require("js-beautify").html;
var plist = require("plist");
var request = require("request");
var mkdirp = require("mkdirp");
var htmlUtil = require("./htmlUtil.js");
var settings = require("../settings");
var when = require("when");
var cheerio = require("cheerio");

function _MakeStream(html, licence_key) {
    mkdirp.sync(settings.platformTemplatesPath, 0777);
    var stream = fs.createWriteStream(settings.platformTemplatesPath + "/" + licence_key + ".html");
    stream.once("open", function() {
        stream.write(html);
        stream.end();
    });
}

function _parsePlist(plistContent) {
    return when.promise(function(resolve, reject) {
        var plistObject = plist.parse(plistContent);
        var licence_key = plistObject.key;
        plistObject.theme = plistObject.theme || "Default";
        if (!licence_key) {
            return reject("plist has no licence_key");
        }
        var $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
        for (var row in plistObject) {
            if (typeof plistObject[row] === "object") { // parse only plist component
                var stype = plistObject[row].ScreenType;
                switch (stype) {
                    case "Choice":
                        $ = htmlUtil.createChoices($, row, plistObject[row].choices, plistObject[row].ScreenTitle);
                        break;
                    case "Form":
                        $ = htmlUtil.createForm($, row, plistObject[row].FormFields, plistObject[row].Destination.id, plistObject[row].FormTitle, plistObject[row].ScreenTitle);
                        break;
                    case "Grid":
                        $ = htmlUtil.createGrid($, row, plistObject[row].choices, plistObject[row].ScreenTitle);
                        break;
                    case "Info":
                        $ = htmlUtil.createInfo($, row, plistObject[row].ContentText, plistObject[row].ScreenTitle);
                        break;
                    case "Call":
                        $ = htmlUtil.createCall($, row, plistObject[row].QueueDestination.id, plistObject[row].QueueDestination.name);
                        break;
                }
            } else if (typeof plistObject[row] === "string" || plistObject[row] instanceof String) { //work with mete info like font , version ,theme
                switch (row.toLowerCase()) {
                    case "theme":
                        $ = htmlUtil.applyTheme($, plistObject[row]);
                        break;
                }
            }
        }
        _MakeStream($.html(), licence_key);
        return resolve({});
    });
}

function generate(plistUrl) {
    return when.promise(function(resolve, reject) {
        request(plistUrl, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            return resolve(_parsePlist(body));
        });
    });
}

module.exports = {
    generate: generate
};