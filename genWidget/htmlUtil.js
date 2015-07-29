var extUrlRegex =
  new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");


function createGrid($, grids){
  var $ul = $('<ul/>').attr('id', 'grid-01')
  grids.forEach(function(grid) {
    var $li = $('<li/>');
    var $a = $('<a/>').attr('href', grid.nextLink).attr('class', 'animsition-link').text(grid.text);
    if(extUrlRegex.test(grid.nextLink)){
      $a.attr('target', '_blank');
    }
    var $img = $('<img/>').attr('src', grid.iconLink).attr('height', 50).attr('width', 50);
    $a.append($img);
    $li.append($a);
    $ul.append($li);
  });
  $('#pages').html($ul);
  return $;
}



function createInfo($, content){
 
  var $p = $('<p>').text(content);
  $('#pages').html($p );
  return $;
}


function createCall($ , queue){

  return $;
}

 /**
  @param choices [{"ScreenName":"http://www.fedex.com/","ChoiceText":"Track Your Order"},
    {"ScreenName":"eeeba174.b1edc","ChoiceText":"Returns & Exchange"}]
  @ return 
      <div class="list-group">
        <a target="_blank" data-toggle="collapse" class="list-group-item lest-01"  href="http://www.fedex.com/">Track Your Order</a>
        <a data-toggle="collapse" class="list-group-item lest-01" href="eeeba174.b1edc.html">Returns &amp; Exchange</a>
      </div>
  **/
function createChoices($ , choices)
{

  var $div = $('<div/>').attr('class', 'list-group')
  choices.forEach(function(choice) {
   
   var $a = $('<a/>').attr('class', 'list-group-item lest-01').text(choice.ChoiceText);
    if(extUrlRegex.test(choice.ScreenName)){
      $a.attr('href', choice.ScreenName).attr('target', '_blank');
    } else {
       $a.attr('href', choice.ScreenName+'.html');
    }
    $div.append($a);
  });

  $('#pages').html($div);
  return $;
}


function createGrid($, grids){
  var $ul = $('<ul/>').attr('id', 'list-group')
  grids.forEach(function(grid) {
    var $li = $('<li/>');
    var $a = $('<a/>').attr('href', grid.ScreenName).attr('class', 'animsition-link').text(grid.ChoiceText);
    if(extUrlRegex.test(grid.ScreenName)){
      $a.attr('target', '_blank');
    }
    var $img = $('<img/>').attr('src', grid.ScreenName).attr('height', 50).attr('width', 50);
    $a.append($img);
    $li.append($a);
    $ul.append($li);
  });
  $('#pages').html($ul);
  return $;
}

module.exports = {

  setTitle: function($, title) {
    $("#header .header").text(title);
    return $;
  },

  /**
   *@grids is [{text , nextLink , iconLink} , {text , nextLink , iconLink}]
    return
        <ul class="grid-01">
           <li>
             <a href="e00b2cb8.70e9f8.html" class="animsition-link">
               <img src="https://designer.ubicall.com/uploads/fdab76ef5814558d0e5fae788d9a7bd1.png" height="50" width="50"> Shipping & Returns</a>
           </li>
           <li>
             <a href="df63be64.823108.html" class="animsition-link">
               <img src="https://designer.ubicall.com/uploads/509deebc910aee6633a8d7f6d0e33358.png" height="50" width="50"> FAQ's</a>
           </li>
         </ul>
   **/
  createGrid: createGrid,
  /**
  <div class="list-group">
      <a target="_blank" data-toggle="collapse" class="list-group-item lest-01" 
        href="http://www.fedex.com/">Track Your Order</a><a data-toggle="collapse" 
        class="list-group-item lest-01" href="eeeba174.b1edc.html">Returns &amp; Exchange</a>
        <a data-toggle="collapse" class="list-group-item lest-01" href="eeeba174.b1edc.html">Returns &amp; Exchange</a><a data-toggle="collapse" class="list-group-item lest-01" href="622f68d9.41c69.html">Shipping Rates</a><a data-toggle="collapse" class="list-group-item lest-01" href="95934b1b.df9038.html">Warranty</a><a data-toggle="collapse" class="list-group-item lest-01" href="95934b1b.df9038.html">Warranty</a><a data-toggle="collapse" class="list-group-item lest-01" href="3834cdc.a475fb2.html">Speak to an Agent</a></div>
  **/
  createChoices: createChoices,
  createInfo : createInfo,
  createCall : createCall
}
