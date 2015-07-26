'use strict';

var ubiWidget = ubiWidget || (function(){
    var _args = {}; // private


    function _createUbiWidgetContainer(){
      var containerId = 'ubi-widget' +  Math.random() * (9999 - 10254);
      document.body.innerHTML += '<div id=' + _args.containerId + '></div>';
      return containerId;
    }

    function _createUbiWidget(ubiWidget,partyId) {
            var iframeSource ;
            if ( partyId ) {
              iframeSource =  serverHost+'/api/3rd/widget/' + partyId ;
            }else {
              // TODO FALL BACK URL FOR ERROR API
              iframeSource = serverHost+'/api/3rd/widget/err'
            }
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', iframeSource);
            iframe.setAttribute('class',' popup-ifram-style');
            iframe.setAttribute('frameborder', '0');
            fooWidget.appendChild(iframe);
          }

    return {
        init : function(Args) {
            _args = Args;

            var ubiWidget;
            if(_args.containerId){
              ubiWidget =document.getElementById('ubi-widget');
              if(!ubiWidget){
                  _args.containerId = _createUbiWidgetContainer();
              }
            }else {
              _args.containerId = createUbiWidgetContainer();
            }

            _createUbiWidget(ubiWidget , _args.licence_key);
        }
    };
}());

(function(global) {
    var serverHost = '<%= serverHost %>';
    var partyId = '<%= partyId %>';

    init();
        //
    function init(args) {
        // create parent container to put all widget contetnt in it ;

        //TODO create <div class="ubi-widget"> </div>
        var ubiWidget = document.querySelectorAll('.ubi-widget')[0];
        processUbiWidget(ubiWidget);
    }

    function processUbiWidget(ubiWidget) {
        // TODO : call web service to check if this partyId is valid or not
        // when ajax call success call createWidget
        // if error call createUbiWidget(ubiWidget);
        createUbiWidget(ubiWidget,partyId);
    }



    //See http://css-tricks.com/snippets/javascript/inject-new-css-rules
    function injectStyles() {
        var css = '<%= inlineCss %>';
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        var head = document.head || document.querySelector('head');
        head.appendChild(style);
    }
}());
