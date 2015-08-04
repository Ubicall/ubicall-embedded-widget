'use strict';
var ubiCallManager = ubiCallManager || (function() {


  var GEO = GEO || _getGeoInfo();
  var SIP = _getSipInfo();
  var LICENSE = LICENSE || _getLicenceKey() || window.location.href.split('/li/')[1].split('/')[0];
  var phoneCallSubmitQueue , formData;

  if( LICENSE ){
    _saveLicenceKey(LICENSE);
  }

  if ( !GEO ) {
      _initGeo();
  }

  function _saveLicenceKey(lic) {
    localStorage.setItem('lic', lic);
  }

  function _getLicenceKey() {
    return localStorage.getItem('lic');
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
        if(xhr.statusText == 'timeout'){
          xhr.abort();
        }
        _saveGeoInfo({ip : '127.0.0.1'});
        console.log("unable to get geo data");
      },
      timeout: 3000 // sets timeout to 3 seconds
    });
  }

  function sipSign(){
    var deferred = $.Deferred();
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
          deferred.resolve(response.data);
        } else {
          console.log("error un able to get your sip credentials ");
          deferred.reject("error un able to get your sip credentials ");
        }
      },
      error: function(xhr) {
        console.log("error un able to get your sip credentials ");
        deferred.reject("error un able to get your sip credentials ");
      }
    });
    return deferred.promise();
  }

  function scheduleSipCall(queue , next) {
    sipSign().done(function () {
      $.ajax({
        type: "get",
        url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
        contentType: "application/json",
        data: {
          voiceuser_id: SIP.username,
          license_key: LICENSE,
          qid: queue || phoneCallSubmitQueue,
          ipaddress: GEO && GEO.ip ? GEO.ip : '',
          call_data : formData || ''
        },
        success: function(response) {
          if (response.status == 200) {
            console.log("sechduling call");
            window.location.href = next ;
          } else {
            console.log("error in sechduling web call");
            return false;
          }
        },
        error: function(xhr) {
          console.log("error in sechduling web call");
          return false;
        }
      });
    }).fail(function (error) {
      console.log(error);
      return false;
    });
    return false;
  }

  function schedulePhoneCall(phone , time, next) {
    sipSign().done(function () {
      $.ajax({
        type: "get",
        url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
        contentType: "application/json",
        data: {
          voiceuser_id: phone,
          license_key: LICENSE,
          qid: phoneCallSubmitQueue,
          ipaddress: GEO && GEO.ip ? GEO.ip : '',
          call_data : formData || ''
        },
        success: function(response) {
          if (response.status == 200) {
            console.log("sechduling call");
            phoneCallSubmitQueue = null;
            window.location.href = next ;
          } else {
            console.log("error in sechduling phone call");
            return false;
          }
        },
        error: function(xhr) {
          console.log("error in sechduling phone call");
          return false;
        }
      });
    }).fail(function(){
      console.log("error in sechduling phone call");
      return false;
    });
    return false;
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
