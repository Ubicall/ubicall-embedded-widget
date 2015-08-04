/**
@param $ is cheerio documnet
@param choices [{ ScreenName, ChoiceText , url},{ ScreenName, ChoiceText , url}]
@return
      <div class="list-group">
        <a target="_blank" data-toggle="collapse" class="list-group-item lest-01"  href="http://www.fedex.com/">Track Your Order</a>
        <a data-toggle="collapse" class="list-group-item lest-01" href="eeeba174.b1edc.html">Returns &amp; Exchange</a>
      </div>
**/
function createChoices($, choices) {

  var $div = $('<div/>').attr('class', 'list-group')
  choices.forEach(function(choice) {

    var $a = $('<a/>').attr('class', 'list-group-item lest-01').text(choice.ChoiceText);
    if (choice.url) {
      $a.attr('href', choice.url).attr('target', '_blank');
    } else {
      $a.attr('href', choice.ScreenName + '.html');
    }
    $div.append($a);
  });

  $('#pages').html($div);
  return $;
}

/**
  @param $ is cheerio documnet
  @param grids is [{ScreenName, url, UrlImage ,ChoiceText} , {ScreenName, url, UrlImage ,ChoiceText}]
  @return
      <ul class="grid-01">
         <li>
           <a href="e00b2cb8.70e9f8.html" class="animsition-link">
             <img src="https://designer.ubicall.com/uploads/fdab76ef5814558d0e5fae788d9a7bd1.png" height="50" width="50">
              Shipping & Returns
          </a>
         </li>
         <li>
           <a href="df63be64.823108.html" class="animsition-link">
             <img src="https://designer.ubicall.com/uploads/509deebc910aee6633a8d7f6d0e33358.png" height="50" width="50">
             FAQ's
          </a>
         </li>
       </ul>
 **/
function createGrid($, grids) {
  var $ul = $('<ul/>').attr('class', 'grid-01')
  grids.forEach(function(grid) {
    var $li = $('<li/>');
    var $a = $('<a/>');
    if (grid.url) {
      $a.attr('href', grid.url).attr('target', '_blank');
    } else {
      $a.attr('href', grid.ScreenName + '.html').attr('class', 'animsition-link');
    }

    var $img = $('<img/>').attr('src', grid.UrlImage).attr('height', 50).attr('width', 50);
    $a.append($img).append(grid.ChoiceText);
    $li.append($a);
    $ul.append($li);
  });
  $('#pages').html($ul);
  return $;
}

function createForm($, formFields, queue) {

  var scrip = " <script> $(document) .ready(function(){$.fn.serializeObject = function(){    var o = {};    var a = this.serializeArray();    $.each(a, function() {        if (o[this.name] !== undefined) {            if (!o[this.name].push) {                o[this.name] = [o[this.name]];            }            o[this.name].push(this.value || '');        } else {            o[this.name] = this.value || '';        }    });    return o;};       $('form').submit(function(){       var data =JSON.stringify($('form').serializeObject()));    ubiCallManager.setFormDate(data);    ubiCallManager.setPhoneCallQueue(" + queue + ");                                                   });});</script>";

  var $maidiv = $('<div/>').append(scrip);



  var $form = $('<form/>').attr('action', 'https://platform.ubicall.com/widget/call.html');
  formFields.forEach(function(field) {

    var $div = $('<div/>').attr('class', 'form-group');
    var $label = $('<label/>').text(field.FieldLabel);

    var $input = $('<input/>').attr('class', 'form-control').attr('placeholder', field.Placeholder).attr('name', field.FieldLabel);

    if (field.isMandatory == true) {
      $input.attr('required', 'required');
    }
    if (field.Keyboard == '1') {
      $input.attr('type', 'number');
    } else {
      $input.attr('type', 'text');
    }

    $div.append($label);
    $div.append($input);
    $form.append($div);
  });


  // TODO on submit callmanager.setPhoneCallQueue(queue) then go to https://platform.ubicall.com/widget/call.html
  var $button = $('<button/>').attr('type', 'submit').attr('class', 'btn btn-default').text('Submit');
  $form.append($button);
  $maidiv.append($form);
  $('#pages').html($maidiv);

  return $;
}





/**
@param $ is cheerio documnet
@param content ' content for info screen '
@return
  <p> @param content</p>
**/
function createInfo($, content) {
  var $p = $('<p/>').text(content);
  $('#pages').html($p);
  return $;
}

/**
@param $ is cheerio documnet
@param queue queue id
@return
  <div>

      <button class="btn btn-default"
        click="ubiCallManager.scheduleSipCall(@param queue, 'https://platform.ubicall.com/widget/waiting.html')">
          Receive web VoIP call
      </button>

      <button class="btn btn-default"
        click="ubiCallManager.setPhoneCallQueue(@param queue, 'https://platform.ubicall.com/widget/submitCall.html')">
          Receive a call on Cell phone
      </button>

  </div>
**/
function createCall($, queue) {
  var $div = $('<div/>');

  var $buttona = $('<button/>').attr('class', 'btn btn-default').text('Receive web VoIP call')
    .attr('onclick', 'ubiCallManager.scheduleSipCall(' + queue + ',"https://platform.ubicall.com/widget/waiting.html")');

  var $b = $('<a/>').attr('onclick', 'ubiCallManager.setPhoneCallQueue(' + queue + ')')
    .attr('href','https://platform.ubicall.com/widget/submitCall.html');
  var $butB = $('<button/>').attr('class', 'btn btn-default').text('Receive a call on Cell phone');
  $b.append($butB);

  $div.append($buttona);
  $div.append($b);

  $('#pages').html($div);
  return $;
}

module.exports = {
  setTitle: function($, title) {
    $("#header .header").text(title);
    return $;
  },
  createGrid: createGrid,
  createChoices: createChoices,
  createInfo: createInfo,
  createCall: createCall,
  createForm: createForm
}
