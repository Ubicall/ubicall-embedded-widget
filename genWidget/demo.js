// will be deleted after moving all of examples to test/genWidget/htmlUtil.js
var fs = require('fs');
var settings = require('../settings');
var htmlUtil = require('../genWidget/htmlUtil');
var beautify_html = require('js-beautify').html;
var cheerio = require('cheerio'),
  $ = cheerio.load(fs.readFileSync(settings.mainTemplate));

var content='';
 pObject='{"key":"e6053eb8d35e02ae40beeeacef203c1a","Version":1438187183742,"Font":"Default","Initial":"Choice","MainScreen":{"ScreenType":"Choice","ScreenTitle":"Insurances","choices":[{"ScreenName":"68d6d8f9.c905d8","ChoiceText":"You have an active policy with Costco auto insurance","ChoiceType":"Choice"},{"ScreenName":"8dc8d9b5.3a314","ChoiceText":"Assistance relating to a claim","ChoiceType":"Choice"},{"ScreenName":"5c51f81c.54c33","ChoiceText":"Request a quote for auto, home or umbrella","ChoiceType":"Choice"}]},"501861f7.9187b8":{"ScreenType":"Choice","ScreenTitle":"Insurances","choices":[{"ScreenName":"68d6d8f9.c905d8","ChoiceText":"You have an active policy with Costco auto insurance","ChoiceType":"Choice"},{"ScreenName":"8dc8d9b5.3a314","ChoiceText":"Assistance relating to a claim","ChoiceType":"Choice"},{"ScreenName":"5c51f81c.54c33","ChoiceText":"Request a quote for auto, home or umbrella","ChoiceType":"Choice"}]},"68d6d8f9.c905d8":{"ScreenType":"Choice","ScreenTitle":"Insurance","choices":[{"ScreenName":"16e8a813.abfb08","ChoiceText":"for ID cards or a copy of policy documents","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"fdc178fc.ea1e78","ChoiceText":"Auto","ChoiceType":"Choice"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"Home or umbrella","ChoiceType":"Call","QueueDestination":"4"}]},"16e8a813.abfb08":{"ScreenType":"Call","ChoiceText":"Call","QueueDestination":{"name":"Information Support","id":"4"}},"fdc178fc.ea1e78":{"ScreenType":"Choice","ScreenTitle":"Insurance2","choices":[{"ScreenName":"24bccc0d.dcd5a4","ChoiceText":"Roadside Assistance","ChoiceType":"Form"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"All Other Questions","ChoiceType":"Call","QueueDestination":"4"}]},"24bccc0d.dcd5a4":{"ScreenType":"Form","ScreenTitle":"Insurance4","FormTitle":"Insurance","QueueDestination":{"id":"6","name":"Spanish Support"},"FormFields":[{"FieldLabel":"Enter Your Policy Number","FieldType":"Text Field","isMandatory":true,"Keyboard":"1","Placeholder":"Policy Number"}]},"8dc8d9b5.3a314":{"ScreenType":"Choice","ScreenTitle":"Insurance","choices":[{"ScreenName":"78e501f0.1375e8","ChoiceText":"If you know the last names of the party you wish to speak with","ChoiceType":"Form"},{"ScreenName":"e343a1a1.07c3c","ChoiceText":"Report a New Claim","ChoiceType":"Choice"},{"ScreenName":"8e0e9d5f.60a138","ChoiceText":"Calling About an Existing Claim","ChoiceType":"Choice"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"Information about business hours","ChoiceType":"Call","QueueDestination":"4"}]},"8e0e9d5f.60a138":{"ScreenType":"Choice","ScreenTitle":"Insurance","choices":[{"ScreenName":"4aed8dba.cf2d04","ChoiceText":"Glass Claim","ChoiceType":"Form"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"if you are insured by Costco auto insurance","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"if you are a medical provider","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"84207a64.a113","ChoiceText":"if you are a collission repair shop","ChoiceType":"Choice"}]},"4aed8dba.cf2d04":{"ScreenType":"Form","ScreenTitle":"Glass Claim","FormTitle":"Glass Claim","QueueDestination":{"id":"5","name":"Incident Reporting"},"FormFields":[{"FieldLabel":"Enter your 10 digit phone number associated with your policy","FieldType":"Text Field","isMandatory":true,"Keyboard":"2","Placeholder":"your name"}]},"84207a64.a113":{"ScreenType":"Choice","ScreenTitle":"Repair Shpo","choices":[{"ScreenName":"16e8a813.abfb08","ChoiceText":"If you need technical assistance","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"For status regarding submited estimate","ChoiceType":"Call","QueueDestination":"4"}]},"78e501f0.1375e8":{"ScreenType":"Form","ScreenTitle":"Last Name","FormTitle":"Last Name","QueueDestination":{"id":"11","name":"Sales Queue"},"FormFields":[{"FieldLabel":"Enter the last name of the person you wish to speak with","FieldType":"Text Field","isMandatory":true,"Keyboard":"1","Placeholder":"Last Name"}]},"e343a1a1.07c3c":{"ScreenType":"Choice","ScreenTitle":"Insurance","choices":[{"ScreenName":"16e8a813.abfb08","ChoiceText":"Report a home loss","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"Report an auto loss","ChoiceType":"Call","QueueDestination":"4"}]},"5c51f81c.54c33":{"ScreenType":"Choice","ScreenTitle":"Insurance","choices":[{"ScreenName":"16e8a813.abfb08","ChoiceText":"Auto Only","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"16e8a813.abfb08","ChoiceText":"Home Only","ChoiceType":"Call","QueueDestination":"4"},{"ScreenName":"4aed8dba.cf2d04","ChoiceText":"For new or existing umbrella Quote","ChoiceType":"Form"}]}}';
var plistObject = JSON.parse(pObject);

    for (var row in plistObject) {
      console.log(typeof plistObject[row]);
      if (typeof plistObject[row] == 'object') {  // parse only plist component and leave mete info like font , version now
        var stype = plistObject[row].ScreenType;
        switch (stype) {
          case "Choice":
         
           $ = htmlUtil.createChoices($,row, plistObject[row].choices,plistObject[row].ScreenTitle);

            break;
          case "Form":
            
            $ = htmlUtil.createForm($,row, plistObject[row].FormFields , plistObject[row].QueueDestination.id,plistObject[row].FormTitle,plistObject[row].ScreenTitle);
        
            break;

          case "Grid":

            $ = htmlUtil.createGrid($,row, plistObject[row].choices,plistObject[row].ScreenTitle);
            break;

          case "Info":
            $ = htmlUtil.createInfo($,row, plistObject[row].ContentText,plistObject[row].ScreenTitle);
            break;

          case "Call":
            $ = htmlUtil.createCall($,row, plistObject[row].QueueDestination.id,plistObject[row].QueueDestination.name);
           
            break;
        }
      }
    }

 
  


console.log(beautify_html($.html()));



//content = htmlUtil.createCall($, 5);
/*
content = htmlUtil.createForm(content,
   [
         {
            "FieldLabel":"hi",
            "FieldType":"Selector",
            "isMandatory":true,
            "Keyboard":"1",
            "Placeholder":"hi",
            "Values":[
               "aaa",
               "2222",
               "111"
            ]
         }
      ]
      ,4,'hhhhhh'
    );

*/






