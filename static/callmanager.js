'use strict';
var ubiCallManager = ubiCallManager || (function() {


  var GEO = GEO || _getGeoInfo();
  var LICENSE = LICENSE || _getLicenceKey();
  var phoneCallSubmitQueue , formData;
  _initGeo();

  //will use jquery q
  sipSign();

  function setLicenceKey(lic) {
    localStorage.setItem('lic', lic);
    window.frameElement.setAttribute("lic" , lic)
  }

  function _getLicenceKey() {
    return localStorage.getItem('lic') || window.frameElement.getAttribute("lic");
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

  function sipSign(){
    $.ajax({
      type: "get",
      url: "https://ws.ubicall.com/webservice/get_web_acc.php",
      contentType: "application/json",
      data: {
        sdk_name: 0,
        sdk_version: 0,
        deviceuid: 0,
        device_token: 0,
        device_model: 0,
        device_version: 0,
        licence_key: LICENSE
      },
      success: function(response) {
        if (response.status == 200) {
          _saveSipInfo(status.data);
        } else {
          console.log("error un able to get your sip credentials ");
        }
      },
      error: function(xhr) {
        console.log("error un able to get your sip credentials ");
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
        voiceuser_id: _getSipInfo().username,
        license_key: LICENSE,
        qid: queue || phoneCallSubmitQueue,
        ipaddress: GEO.ip || '',
        call_data : formData || ''
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
        ipaddress: GEO.ip,
        call_data : formData || ''
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

  function setFormDate(data){
    formData = data;
  }

  return {
    setLicenceKey : setLicenceKey,
    scheduleSipCall: scheduleSipCall,
    setPhoneCallQueue : setPhoneCallQueue,
    schedulePhoneCall: schedulePhoneCall,
    getSipInfo : _getSipInfo,
    setFormDate : setFormDate
  }
}());
