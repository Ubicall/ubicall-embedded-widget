'use strict';
var ubiCallManager = ubiCallManager || (function() {
  function _setLicenceKey(lic) {
    localStorage.setItem('lic', lic);
  }

  function _getLicenceKey() {
    _setLicenceKey('e6053eb8d35e02ae40beeeacef203c1a');
    return localStorage.getItem('lic');
  }

  function _saveSipInfo(sip) {
    localStorage.removeItem('sip');
    localStorage.setItem('sip', sip);
  }

  function _removeSipInfo() {
    localStorage.removeItem('sip');
  }

  function _getSipInfo() {
    localStorage.getItem('sip');
  }

  function scheduleSipCall(queue) {
    var lic_key = _getLicenceKey();
    _getNumber({
      license_key: lic_key
    });
    $.ajax({
      type: "get",
      url: "http: //ws.ubicall.com/webservice/get_schedule_web_call.php",
      contentType: "application/json",
      data: {
        voiceuser_id: _getSipInfo.username,
        license_key: _getLicenceKey(),
        qid: queue
      },
      success: function(response) {
        /** sample
          {
            status: 200,
            data: [
              {
                call: "processing",
                call_id: 0
              }
          ]
        }
      **/
        if (response.status == 200) {
          console.log("sechduling call");
        }else {
          console.log("error in sechduling call");
        }
      },
      error: function(xhr) {
        console.log("error in sechduling call ");
      }
    });
  }
  return {
    scheduleSipCall: scheduleSipCall
}());
