'use strict';

//inspired from http://stackoverflow.com/a/2190927
var ubiWidget = ubiWidget || (function() {
  var _args = {};

  function _createUbiWidgetContainer(id) {
    var containerId = id || 'ubi-widget' + Math.random() * (9999 - 10254);
    document.body.innerHTML += '<div id=' + _args.containerId + '></div>';
    return containerId;
  }

  function _createUbiWidget(ubiWidget, partyId) {
    var iframeSource;
    if (partyId) {
      iframeSource = 'https://platform.ubicall.com/widget/li/' + partyId;
    } else {
      iframeSource = 'https://www.ubicall.com/40x.html';
    }
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', iframeSource);
    iframe.setAttribute('class', ' popup-ifram-style');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('lic', partyId);
    ubiWidget.appendChild(iframe);
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
    }
  };
}());
