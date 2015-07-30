'use strict';
var ubiCallManager = ubiCallManager || (function() {

  _initGeo();

  var GEO = GEO || _getGeoInfo();
  var LICENSE = LICENSE || _getLicenceKey();
  var phoneCallSubmitQueue;

  function setLicenceKey(lic) {
    localStorage.setItem('lic', lic);
  }

  function _getLicenceKey() {
    setLicenceKey('e6053eb8d35e02ae40beeeacef203c1a');
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

  function _saveGeoInfo(geo) {
    localStorage.removeItem('geo');
    localStorage.setItem('geo', sip);
  }

  function _removeGeoInfo() {
    localStorage.removeItem('geo');
  }

  function _getGeoInfo() {
    localStorage.getItem('geo');
  }

  function _initGeo() {
    $.ajax({
      url: 'https://freegeoip.net/json',
      type: 'POST',
      dataType: 'jsonp',
      success: function(geo) {
        _saveGeoInfo(geo)
      },
      error: function(xhr){
        console.log("unable to get geo data , retry with another service provider")
        __geoFallBack()
      },
      timeout: 3000 // sets timeout to 3 seconds
    });
  }

  function __geoFallBack(){
    $.ajax({
      url: 'https://l2.io/ip',
      type: 'POST',
      dataType: 'jsonp',
      success: function(ip) {
        _saveGeoInfo({ip:ip});
      }
    });
  }

  function scheduleSipCall(queue) {
    var lic_key = _getLicenceKey();
    _getNumber({
      license_key: lic_key
    });
    $.ajax({
      type: "get",
      url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
      contentType: "application/json",
      data: {
        voiceuser_id: _getSipInfo.username,
        license_key: LICENSE,
        qid: queue || phoneCallSubmitQueue,
        ipaddress: GEO.ip || ''
      },
      success: function(response) {
        if (response.status == 200) {
          console.log("sechduling call");
        } else {
          console.log("error in sechduling web call");
        }
      },
      error: function(xhr) {
        console.log("error in sechduling web call");
      }
    });
  }

  function schedulePhoneCall(phone , time) {
    var lic_key = _getLicenceKey();
    $.ajax({
      type: "get",
      url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
      contentType: "application/json",
      data: {
        voiceuser_id: phone,
        license_key: LICENSE,
        qid: phoneCallSubmitQueue,
        ipaddress: GEO.ip
      },
      success: function(response) {
        if (response.status == 200) {
          console.log("sechduling call");
          phoneCallSubmitQueue = null;
        } else {
          console.log("error in sechduling phone call");
        }
      },
      error: function(xhr) {
        console.log("error in sechduling phone call");
      }
    });
  }

  function setPhoneCallQueue(queue){
    phoneCallSubmitQueue = queue;
  }

  return {
    setLicenceKey : setLicenceKey,
    scheduleSipCall: scheduleSipCall,
    setPhoneCallQueue : setPhoneCallQueue,
    schedulePhoneCall: schedulePhoneCall
  }
}());
