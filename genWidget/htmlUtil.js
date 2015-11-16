/*jshint scripturl:true*/

var settings = require("../settings");



function Set_Home($,home) {
 var _script= $("<script/>");
     _script.text("   window.onload = UbiCallManager._Set_Home('" + home + "');");
$("head").append(_script);
    return $ ;
}

/**
@param title is current sub page title
@return
    <div class="ubi-header">
        <a onClick="javascript:history.go(-1)">
          <i class="fa fa-chevron-left fa-left"/>
        </a>
        <a href="#" onclick="UbiCallManager.goToHomeScreen()">
          <i class="fa fa-home fa-right"/>
        </a>
        <h3> @param title </h3>
    </div>";
**/
function setTitle($, title) {
    var $header = $("<div/>").attr("class", "ubi-header");

    var $a_back = $("<a/>").attr("onclick", "javascript:history.go(-1)");
    var $a_back_i = $("<i/>").attr("class", "fa fa-chevron-left fa-left");

    var $a_home = $("<a/>").attr("href", "#").attr("onclick", "UbiCallManager.goToHomeScreen()");
    var $a_home_i = $("<i/>").attr("class", "fa fa-home fa-right");

    var $title = $("<h3/>").text(title);

    $a_back.append($a_back_i);
    $a_home.append($a_home_i);

    $header.append($a_back);
    $header.append($a_home);
    $header.append($title);

    return $header;
}

/**
@param title is current sub page title for main Screen
@return
    <div class="ubi-header">

        <h3> @param title </h3>
    </div>";
**/


function setTitle_main($, title) {
    var $header = $("<div/>").attr("class", "ubi-header");

    var $title = $("<h3/>").text(title);


    $header.append($title);

    return $header;
}

/**
@param $ is cheerio documnet
@return
    <div class="ubi-search" >
      <div id = "imaginary_container" >
        <div class = "input-group stylish-input-group" >
          <input class = "form-control" placeholder = "Search" type = "text" > < /div>
          <span class = "input-group-addon" >
            <button type = "submit" >
              <span class = "fa fa-search" > < /span>
              </button>
          </span>
        </div>
      </div>
    </div>
**/
function _search($) {

    var $search = $("<div/>").attr("class", "ubi-search");
    var $div_container = $("<div/>").attr("id", "imaginary_container");

    var $div_input_group = $("<div/>").attr("class", "input-group stylish-input-group");
    var $list_data = $("<ul/>").attr("id", "search-list");

    var $input = $("<input/>").attr("class", "form-control search_input").attr("placeholder", "Search").attr("type", "text").attr("data-list", ".search-list");
    var $list_search = $("<ul/>").attr("class", "search-list");
    var $search_span = $("<span/>").attr("class", "input-group-addon");

    var $search_button = $("<button/>").attr("type", "submit");
    var $search_button_icon = $("<span/>").attr("class", "fa fa-search");

    $search_button.append($search_button_icon);
    $search_span.append($search_button);

    $div_input_group.append($input);
    $div_input_group.append($list_search);
    $div_input_group.append($search_span);

    $div_container.append($div_input_group);
    $div_container.append($list_search);
    $search.append($div_container);

    return $search;
}

/**
@param $ is cheerio documnet
@param choices [{ ScreenName, ChoiceText , url},{ ScreenName, ChoiceText , url}]
@return
      <div class="list-group">
        <a target="_blank" data-toggle="collapse" class="list-group-item lest-01"  href="http://www.fedex.com/">Track Your Order</a>
        <a data-toggle="collapse" class="list-group-item lest-01" href="eeeba174.b1edc.html">Returns &amp; Exchange</a>
      </div>
**/
function createChoices($, pageId, choices, title,home) {

    var header;
    if (pageId === home) {
        header = setTitle_main($, title);
    } else {
        header = setTitle($, title);
    }
    var search = _search($);

    var $divlist = $("<div/>").attr("class", "list-group");
    choices.forEach(function(choice) {

        var $a = $("<a/>").attr("class", "list-group-item lest-01").text(choice.ChoiceText);
            $a.attr("href", "#" + choice.__next.id);
        
        $divlist.append($a);
    });
    var $divpages = $("<div/>").attr("class", "ubi-pages");
    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $divpages.append($divlist);
    $content.append(header);
    $content.append(search);
    $content.append($divpages);
    $page.append($content);
    $("body").prepend($page);
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
             FAQ"s
          </a>
         </li>
       </ul>
 **/
function createGrid($, pageId, grids, title,home) {
    var header;
    if (pageId === home) {
        header = setTitle_main($, title);
    } else {
        header = setTitle($, title);
    }
    var search = _search($);

    var $ul = $("<ul/>").attr("class", "grid-01");
    grids.forEach(function(grid) {
        var $li = $("<li/>");
        var $a = $("<a/>");
        $a.attr("href", "#" + grid.__next.id).attr("class", "animsition-link");
        var $img = $("<img/>").attr("src", grid.UrlImage).attr("height", 50).attr("width", 50);
        $a.append($img).append(grid.ChoiceText);
        $li.append($a);
        $ul.append($li);
    });

    var $divpages = $("<div/>").attr("class", "ubi-pages");
    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $divpages.append($ul);
    $content.append(header);
    $content.append(search);
    $content.append($divpages);
    $page.append($content);

    $("body").prepend($page);
    return $;

}

/**
  @param $ is form documnet
  @param pageId is screen id
  @param formFields [{FieldLabel, Placeholder, isMandatory ,FieldType,Keyboard} , {FieldLabel, Placeholder, isMandatory ,FieldType,Keyboard}]
  @param queue where to submit this form data
  @param FormTitle "what this form about"
  @return
    <div>
        <p>@param FormTitle</p>
        <form id="form-@param pageId" action="" method="post" onsubmit="helpers.submitCallForm("form-@param pageId");return false;">
            <div class="form-group">
                <label>Gender</label>
                <select class="form-control" name="Gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
        </form>
        <input type="hidden" id="qid" value="@param queue">
    </div>
 **/
function createForm($, pageId ,form ,home) {

    var formId = pageId.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "-");
 
    var header;

    if (pageId === home) {
        header = setTitle_main($, form.ScreenTitle);
    } else {
        header = setTitle($, form.ScreenTitle);
    }
     var search = _search($);

    var $maidiv = $("<div/>").attr("class", "ubi-pages");

    var $p = $("<p/>").text(form.FormTitle);
    var path;
if(form.__next){
path =form.__next.id;
}else{ path = home }
    var $form = $("<form/>").attr("id", "form-" + formId).attr("method", "post").attr("action", "")
            .attr("onsubmit", "helpers.submitForm('form-" + formId + "','"+ path +"');return false;");
   

    form.FormFields.forEach(function(field) {

        var $div = $("<div/>").attr("class", "form-group");
        var $label = $("<label/>").text(field.FieldLabel);

        var $input = $("<input/>").attr("class", "form-control").attr("placeholder", field.Placeholder).attr("name", field.FieldLabel);
        if (field.editable === false){
           $input.attr("readonly", "readonly");
        }
           if (field.FieldType === "Integer"){
           $input.attr("type", "number").attr("step", 1);
        }
           if (field.FieldType === "Decimal"){
           $input.attr("type", "number").attr("step", 0.01);;
        }

        if (field.required === true) {
            $input.attr("required", "required");
          }
        if (field.FieldType === "Date") {
            $input.attr("type", "date");
        } else if (field.FieldType === "Selector") {

            $input = $("<select/>").attr("class", "form-control").attr("name", field.FieldLabel);
            field.select_field_options.forEach(function(op) {
                 var $option ;
                if(op.value==="__default"){
               $option = $("<option/>").text(op.name).val("").attr("disabled selected");
                }
                else{ $option = $("<option/>").text(op.name).val(op.value);}
                $input.append($option);
            });

        } 
        $div.append($label);
        $div.append($input);
        $form.append($div);

    });

  
  
    var $button = $("<button/>").attr("type", "submit").attr("class", "btn btn-default").text("Submit");
    $form.append($button);
    $maidiv.append($p);
    $maidiv.append($form);



    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $content.append(header);
    $content.append(search);
    $content.append($maidiv);
    $page.append($content);

    $("body").prepend($page);
    return $;

}





/**
@param $ is cheerio documnet
@param content " content for info screen "
@return
  <p> @param content</p>
**/
function createInfo($, pageId, info,home) {

   var header;
    if (pageId === home) {
        header = setTitle_main($, info.ScreenTitle);
    } else {
        header = setTitle($, info.ScreenTitle);
    }
     var search = _search($);
    

        var $p = $("<p/>").text(info.ContentText);


    var $divpages = $("<div/>").attr("class", "ubi-pages");
    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $divpages.append($p);
        if(info.__next){
  var $a = $("<a/>").attr("class", "list-group-item lest-01").text("Next");
            $a.attr("href", "#" + info.__next.id);
             $divpages.append($a);
}

    $content.append(header);
    $content.append(search);
    $content.append($divpages);
    $page.append($content);
    $("body").prepend($page);
    return $;
}





function createUrl($, pageId, Url,home) {

   var header;
    if (pageId === home) {
        header = setTitle_main($, Url.ScreenTitle);
    } else {
        header = setTitle($, Url.ScreenTitle);
    }
     var search = _search($);
    

        var $p = $("<p/>").text("The URL  is Opened in another Page");

var s_page = pageId.replace(/\./g, '\\\\.');
    var _script= $("<script/>");
     _script.text("$('#"+s_page+"').on('pageshow',function(event){window.open('"+Url.url+"', '_blank');});");
    var $divpages = $("<div/>").attr("class", "ubi-pages");
    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $divpages.append($p);
    $divpages.append(_script);
        if(Url.__next){
  var $a = $("<a/>").attr("class", "list-group-item lest-01").text("Next");
            $a.attr("href", "#" + Url.__next.id);
             $divpages.append($a);
}

    $content.append(header);
    $content.append(search);
    $content.append($divpages);
    $page.append($content);
    $("body").prepend($page);
    return $;
}

/**
@param $ is cheerio documnet
@param queue queue id
@return
  <div>
    <button onclick="this.disabled=true;UbiCallManager.scheduleSipCall(@param queue);this.disabled=false;" class="btn btn-default">Receive web VoIP call</button>
    <button onclick="this.disabled=true;UbiCallManager.setPhoneCallQueue(@param queue);UbiCallManager.goTosubmitPhoneCall();this.disabled=false;" class="btn btn-default">Receive a call on Cell phone</button>
  </div>
**/

function createCall($, pageId, queue, title) {

    var header;
    if (pageId === home) {
        header = setTitle_main($, title);
    } else {
        header = setTitle($, title);
    }
     var search = _search($);

    var $div = $("<div/>");

    var $buttona = $("<button/>").attr("class", "btn btn-default").text("Receive web VoIP call").attr("id", "receive-web")
        .attr("onclick", "this.disabled=true;UbiCallManager.scheduleSipCall(" + queue + ");this.disabled=false");

    var $buttonb = $("<button/>").attr("class", "btn btn-default").text("Receive a call on Cell phone")
        .attr("onclick", "this.disabled=true;UbiCallManager.setPhoneCallQueue(" + queue + ");UbiCallManager.goTosubmitPhoneCall();helpers.getHours(" + queue + ");this.disabled=false;");


    $div.append($buttona);
    $div.append($buttonb);

    var $divpages = $("<div/>").attr("class", "ubi-pages");
    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $divpages.append($div);
    $content.append(header);
    $content.append(search);
    $content.append($divpages);
    $page.append($content);

    $("body").prepend($page);
    return $;
}


function createAction($, pageId, action,home) {
var next;
if(action.__next){
 next=action.__next.id;
}
else {next=home;}


    var $p = $("<p/>").text("please wait");

    var s_page = pageId.replace(/\./g, '\\\\.');
    var _script= $("<script/>");
     _script.text("$('#"+s_page+"').on('pageshow',function(event){UbiCallManager.send_Action('"+ action.destination.web.HTTPMethod +"','"+ action.destination.web.endPoint + "','"+ next +"');});");
    var $divpages = $("<div/>").attr("class", "ubi-pages");
    var $content = $("<div/>").attr("data-role", "content");
    var $page = $("<div/>").attr("data-role", "page").attr("id", pageId);

    $divpages.append($p);
    $divpages.append(_script);
    $content.append($divpages);
    $page.append($content);
    $("body").prepend($page);
    return $;
}

/**
@param $ is cheerio documnet
@param theme - theme name to add it"s css url
@return
  <link href="cssHref" rel="stylesheet" />
**/
function applyTheme($, theme) {
    theme = theme.toLowerCase();
    if (theme !== "default") {
        var cssHref = settings.themeHost + theme + ".css";
        var $cssLink = $("<link/>").attr("href", cssHref).attr("rel", "stylesheet");
        $("head").append($cssLink);
    }
    return $;
}

module.exports = {

    createGrid: createGrid,
    createChoices: createChoices,
    createInfo: createInfo,
    createCall: createCall,
    createForm: createForm,
    createAction:createAction,
    applyTheme: applyTheme,
    Set_Home: Set_Home,
    createUrl: createUrl
};