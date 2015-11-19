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

    describe("#createForm()", function() {
        before(function() {
            $ = cheerio.load(fs.readFileSync(settings.mainTemplate));
            var id = "c77036b2.388fc8";
            var form = "<dict>\
                        <key>ScreenType</key>\
                        <string>Form</string>\
                        <key>ScreenTitle</key>\
                        <string>sign up form</string>\
                        <key>FormTitle</key>\
                        <string>sign up to get latest promotions</string>\
                        <key>__next</key>\
                        <dict>\
                          <key>id</key>\
                          <string>ckhb56fg4.548jng</string>\
                        </dict>\
                        <key>FormFields</key>\
                        <array>\
                          <dict>\
                            <key>FieldLabel</key>\
                            <string>Name</string>\
                            <key>FieldValue</key>\
                            <string>Name</string>\
                            <key>FieldType</key>\
                            <string>Text Field</string>\
                            <key>required</key>\
                            <true/>\
                            <key>Placeholder</key>\
                            <string>John Smith</string>\
                          </dict>\
                          <dict>\
                            <key>FieldLabel</key>\
                            <string>Email</string>\
                            <key>FieldValue</key>\
                            <string>Email</string>\
                            <key>FieldType</key>\
                            <string>Text Field</string>\
                            <key>required</key>\
                            <true/>\
                            <key>editable</key>\
                            <true/>\
                            <key>Placeholder</key>\
                            <string>JohnSmith@exmaple.com</string>\
                          </dict>\
                          <dict>\
                            <key>FieldLabel</key>\
                            <string>Birth Date</string>\
                            <key>FieldValue</key>\
                            <string>Birth Date</string>\
                            <key>FieldType</key>\
                            <string>Date</string>\
                            <key>required</key>\
                            <true/>\
                            <key>editable</key>\
                            <true/>\
                            <key>Placeholder</key>\
                            <string>31/12/1990</string>\
                          </dict>\
                          <dict>\
                            <key>FieldLabel</key>\
                            <string>Max Price</string>\
                            <key>FieldValue</key>\
                            <string>Max Price</string>\
                            <key>FieldType</key>\
                            <string>Decimal</string>\
                            <key>required</key>\
                            <true/>\
                            <key>editable</key>\
                            <false/>\
                            <key>Placeholder</key>\
                            <string>200.00</string>\
                          </dict>\
                          <dict>\
                            <key>FieldLabel</key>\
                            <string>Type</string>\
                            <key>FieldValue</key>\
                            <string>Type</string>\
                            <key>FieldType</key>\
                            <string>Selector</string>\
                            <key>required</key>\
                            <false/>\
                            <key>editable</key>\
                            <true/>\
                            <key>Placeholder</key>\
                            <string>Request type</string>\
                            <key>select_field_options</key>\
                            <array>\
                              <dict>\
                                <key>value</key>\
                                <string>__default</string>\
                                <key>name</key>\
                                <string>Request type</string>\
                              </dict>\
                              <dict>\
                                <key>value</key>\
                                <string>question</string>\
                                <key>name</key>\
                                <string>Question</string>\
                              </dict>\
                              <dict>\
                                <key>value</key>\
                                <string>incident</string>\
                                <key>name</key>\
                                <string>Incident</string>\
                              </dict>\
                              <dict>\
                                <key>value</key>\
                                <string>problem</string>\
                                <key>name</key>\
                                <string>Problem</string>\
                              </dict>\
                              <dict>\
                                <key>value</key>\
                                <string>task</string>\
                                <key>name</key>\
                                <string>Task</string>\
                              </dict>\
                            </array>\
                          </dict>\
                        </array>\
                        </dict>\
                      </dict>";

            form = plist.parse(plistify(form, id));

            $ = htmlUtil.createForm($, id, form);

        });

        it("should has title with @param {ScreenTitle}");

    });

});