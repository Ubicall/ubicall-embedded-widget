'use strict';
var ubiCallManager = ubiCallManager || (function() {


  var GEO = GEO || _getGeoInfo();
  var SIP = SIP || _getSipInfo();
  var LICENSE = LICENSE || window.location.href.split('/li/')[1].split('/')[0];
  var phoneCallSubmitQueue , formData;
  if(!GEO){
      _initGeo();
  }

  if(!SIP){
      sipSign();
  }

  function _saveSipInfo(sip) {
    _removeSipInfo('sip');
    localStorage.setItem('sip', JSON.stringify(sip));
  }

  function _removeSipInfo() {
    localStorage.removeItem('sip');
  }

  function _getSipInfo() {
    return JSON.parse(localStorage.getItem('sip'));
  }

  function _saveGeoInfo(geo) {
    _removeGeoInfo('geo');
    localStorage.setItem('geo', JSON.stringify(geo));
  }

  function _removeGeoInfo() {
    localStorage.removeItem('geo');
  }

  function _getGeoInfo() {
    return JSON.parse(localStorage.getItem('geo'));
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
        __geoFallBack();
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
        sdk_name: '0000',
        sdk_version: '0000',
        deviceuid: '0000',
        device_token: '0000',
        device_model: '0000',
        device_name:'0000',
        device_version: '0000',
        licence_key: LICENSE
      },
      success: function(response) {
        if (response.status == 200) {
          _saveSipInfo(response.data);
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
    $.ajax({
      type: "get",
      url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
      contentType: "application/json",
      data: {
        voiceuser_id: SIP.username,
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
    scheduleSipCall: scheduleSipCall,
    schedulePhoneCall: schedulePhoneCall,
    setPhoneCallQueue : setPhoneCallQueue,
    setFormDate : setFormDate,
    getSipInfo : _getSipInfo
  }
}());
