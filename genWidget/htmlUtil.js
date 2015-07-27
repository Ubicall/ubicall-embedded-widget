module.exports = {

  createHeader: function() {
    // TODO
  },
  createCall: function(){
    var main = obj[row].choices;
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/bootstrap.min.css" rel="stylesheet" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/style-fonts.css" rel="stylesheet" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/plist.css" rel="stylesheet" /><link href="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/css/animsition.css" rel="stylesheet" /></head><body><!-- Header --><div id="header"><a onClick="javascript:history.go(-1)"><i class="fa fa-chevron-left fa-left"></i></a><a href="MainScreen.html"><i class="fa fa-home fa-right"></i></a><h3>' + obj[row].ScreenTitle + '</h3></div><!-- Animsition --><div class="animsition"><!-- Pages --><div id="pages"><div class="list-group">';

    for (var cho in main) {
      if (main[cho].ChoiceType == 'Choice') {

        html += '<a href="' + main[cho].ScreenName + '.html" class="list-group-item lest-01" data-toggle="collapse" >' + main[cho].ChoiceText + '</a>';
      }
      if (main[cho].ChoiceType == 'URL') {

        html += '<a href="' + main[cho].url + '" class="list-group-item lest-01" data-toggle="collapse" target="_blank" >' + main[cho].ChoiceText + '</a>';
      } else if (main[cho].ChoiceType == 'Call') {


        /// TODO : genertate call file on the fly

                          var htmlcall ='<html><head></head><body><center><h1>'+main[cho].ChoiceText+
                          '</h1><form action="/api/3rd/foo/widget/2/form" method="post">';
                          htmlcall+=' <p> <label>Please enter your phone number</label></p><p> <input name="phone"
                          type="tel" placeholder=" phone number" required="required" ><input name="qid"
                          value="'+main[cho].QueueDestination+'" type="hidden"  >  </p>';
                          htmlcall+='<button class="btn btn-default" type="submit">Submit</button> </form></center></body></html>';
                          MakeStream(htmlcall,'call'+c);

        // TODO now use this static link @'call' + c as next page for link
        html += '<a href="call' + c + '" class="list-group-item lest-01" data-toggle="collapse" >' + main[cho].ChoiceText + '</a></p>';

      } else {

        html += '<a href="' + main[cho].ScreenName + '.html" class="list-group-item lest-01" data-toggle="collapse" >' + main[cho].ChoiceText + '</a>';
      }
      c++;
    }
    html += '</div></div><!-- Page End --></div><!-- Animsition End --><!-- js --><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/jquery.min.js"></script><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/animsition.js"></script><script src="http://10.0.0.161/ubicall/nodeifram/views/server/3rd/foo/js/cust.js"></script><!-- js End --></body></html>';
    MakeStream(html, licence_key, row);
    break;
  },
  createFooter :function() {
    // TODO
  }

}
