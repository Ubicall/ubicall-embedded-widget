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

function createChoices($ , choices){

  return $;
}

module.exports = {

  setTitle: function($, title) {
    $("#header .header").text(title);
    return $;
  },
  createChoices: function($, choices) {
    //TODO
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
  createGrid: createGrid
}
