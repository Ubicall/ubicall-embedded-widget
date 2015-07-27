'use strict';

//inspired from http://stackoverflow.com/a/2190927
var ubiWidget = ubiWidget || (function() {
  var _args = {}; // private


  function _createUbiWidgetContainer(id) {
    var containerId = id || 'ubi-widget' + Math.random() * (9999 - 10254);
    document.body.innerHTML += '<div id=' + _args.containerId + '></div>';
    return containerId;
  }

  function _createUbiWidget(ubiWidget, partyId) {
    var iframeSource;
    if (partyId) {
      iframeSource = serverHost + '/api/3rd/widget/' + partyId;
    } else {
      // TODO FALL BACK URL FOR ERROR API
      iframeSource = serverHost + '/api/3rd/widget/err'
    }
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', iframeSource);
    iframe.setAttribute('class', ' popup-ifram-style');
    iframe.setAttribute('frameborder', '0');
    fooWidget.appendChild(iframe);
  }

  //See http://css-tricks.com/snippets/javascript/inject-new-css-rules

  function _injectStyles() {
    var css = '<%= inlineCss %>';
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    var head = document.head || document.querySelector('head');
    head.appendChild(style);
  }

  return {
    init: function(Args) {
      _args = Args;

      var ubiWidget;
      if (_args.containerId) {
        ubiWidget = document.getElementById(_args.containerId);
        if (!ubiWidget) {
          _args.containerId = _createUbiWidgetContainer(_args.containerId);
        }
      } else {
        _args.containerId = createUbiWidgetContainer();
      }

      _createUbiWidget(ubiWidget, _args.licence_key);
      _injectStyles();
    }
  };
}());
