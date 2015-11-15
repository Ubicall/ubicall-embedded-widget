"use strict";
var UbiCallManager = UbiCallManager || (function() {

    var API = "https://api.ubicall.com";
    var V1 = API + "/v1";
    var AUTH = API + "/auth";
    var Home_Screen;

    function _goToCallOptions() {
        window.location.hash = "callOptions";
    }

    function _sipScheduledPage() {
        window.location.href = "https://platform.ubicall.com/widget/waiting.html";
    }

    function _phoneScheduledPage() {
        window.location.hash = "phoneCallScheduled";
    }

    function _goTosubmitPhoneCall() {

        window.location.hash = "submitPhoneCall";

    }

    function _someThingGoWrong() {
        window.location.hash = "sorry";
    }
        function _sent_successfully() {
        window.location.hash = "email_Succes";
    }

    function goToFeedBackScreen() {
        window.location.hash = "callFeedback";
    }

    function goToHomeScreen() {
        window.location.hash = Home_Screen;
    }
        function _sent_Next(__next) {
            
            window.location.hash = __next;
    }

    function _saveLicenceKey(lic) {
        localStorage.setItem("lic", lic);
    }

    function _getLicenceKey() {
        return localStorage.getItem("lic");
    }

    function _saveAccessToken(at) {
        localStorage.setItem("access_token", at);
    }

    function _getAccessToken() {
        return localStorage.getItem("access_token");
    }

    function _saveSipInfo(sip) {
        localStorage.setItem("sip", JSON.stringify(sip));
    }

    function _removeSipInfo() {
        localStorage.removeItem("sip");
    }

    function _getSipInfo() {
        return JSON.parse(localStorage.getItem("sip"));
    }

    function _saveGeoInfo(geo) {
        localStorage.setItem("geo", JSON.stringify(geo));
    }

    function _removeGeoInfo() {
        localStorage.removeItem("geo");
    }

    function _getGeoInfo() {
        return JSON.parse(localStorage.getItem("geo"));
    }

    function _setCallId(id) {
        localStorage.setItem("callID", id);
    }

    function _getCallId() {
        localStorage.getItem("callID");
    }

    function _removeCallId(id) {
        localStorage.removeItem("callID");
    }
    function _Set_Home(home) {
        Home_Screen=home;
        goToHomeScreen();
    }

    function _getAT() {
        var deferred = $.Deferred();
        $.ajax({
            type: "POST",
            url: AUTH + "/token",
            data: {
                client_id: "ubicall-widget",
                grant_type: "authorization_code",
                code: LICENSE
            },
            success: function(response, status, xhr) {
                if (xhr.status === 200) {
                    deferred.resolve(response);
                } else {
                    deferred.reject();
                }
            },
            error: function(xhr, status) {
                deferred.reject();
            }
        });
        return deferred.promise();
    }

    function _initGeo() {
        var deferred = $.Deferred();
        var geo = {};
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                geo.latitude = position.coords.latitude;
                geo.longitude = position.coords.longitude;
                deferred.resolve(geo);
            }, function(error) {
                geo.error = error;
                deferred.resolve(geo);
            });
        } else {
            deferred.resolve({});
        }
        return deferred.promise();
    }

    function sipSign() {
        var deferred = $.Deferred();
        $.ajax({
            type: "POST",
            url: V1 + "/web/account",
            data: {
                sdk_name: "0000", // web sdk
                sdk_version: "0.2",
                deviceuid: "0000",
                device_token: "0000",
                device_model: navigator.platform,
                device_name: navigator.userAgent, // browser
                device_version: navigator.appVersion //browser version
            },
            success: function(response, status, xhr) {
                if (xhr.status === 200) {
                    _saveSipInfo(response);
                    deferred.resolve(response);
                } else {
                    console.log("error unable to get your sip credentials ");
                    deferred.reject("error unable to get your sip credentials ");
                }
            },
            error: function(xhr) {
                console.log("error un able to get your sip credentials ");
                deferred.reject("error unable to get your sip credentials ");
            }
        });
        return deferred.promise();
    }

    function scheduleSipCall(queue) {
        sipSign().done(function(_sip) {
            $.ajax({
                type: "POST",
                url: V1 + "/web/call",
                data: {
                    caller_type: 2, // flag mean this is usuall web call
                    voiceuser_id: _sip.username,
                    qid: queue || PHONE_SUBMIT_QUEUE,
                    json: FORM_DATA || "",
                    long: GEO && GEO.longitude ? GEO.longitude : "",
                    lat: GEO && GEO.latitude ? GEO.latitude : ""
                },
                success: function(response, status, xhr) {
                    if (xhr.status === 200) {
                        console.log("sechduling call");
                        // sample response : {message: "call scheduled successfully", call: XXXX }
                        _setCallId(response.call);
                        _clearPhoneCallQueue();
                        _clearFormDate();
                        _sipScheduledPage();
                    } else {
                        console.log("error in sechduling web call");
                        _someThingGoWrong();
                    }
                },
                error: function(xhr) {
                    console.log("error in sechduling web call");
                    _someThingGoWrong();
                }
            });
        }).fail(function(error) {
            console.log(error);
            _someThingGoWrong();
        });
    }

    function cancleCurrentSipCall() {
        var call_id = _getCallId();
        if (call_id) {
            $.ajax({
                type: "DELETE",
                url: V1 + "/call/" + call_id,
                data: {
                    call_id: call_id
                },
                success: function(response, status, xhr) {
                    if (xhr.status === 200) {
                        console.log("canceling web call");
                    } else {
                        console.log("error in canceling web call");
                    }
                    _removeCallId();
                },
                error: function(xhr) {
                    console.log("error in canceling web call");
                }
            });
        } else {
            console.log("error in canceling web call");
        }
    }

    function schedulePhoneCall(phone, time) {
        $.ajax({
            type: "POST",
            url: V1 + "web/call",
            data: {
                caller_type: 3,
                voiceuser_id: phone,
                qid: PHONE_SUBMIT_QUEUE,
                json: FORM_DATA || "",
                long: GEO && GEO.longitude ? GEO.longitude : "",
                lat: GEO && GEO.latitude ? GEO.latitude : ""
            },
            success: function(response, status, xhr) {
                if (xhr.status === 200) {
                    console.log("sechduling call");
                    _clearPhoneCallQueue();
                    _clearFormDate();
                    _phoneScheduledPage();
                } else {
                    console.log("error in sechduling phone call");
                    _someThingGoWrong();
                }
            },
            error: function(xhr) {
                console.log("error in sechduling phone call");
                _someThingGoWrong();
            }
        });
    }

    function submitFeedback(feedback) {
        var callId = _getCallId();
        if (callId && (feedback.text || (feedback.feel && feedback.feel !== 1))) {
            $.ajax({
                type: "POST",
                url: V1 + "/call/" + callId + "/feedback",
                data: {
                    call_id: callId,
                    feedback: feedback.feel || 1,
                    feedback_text: feedback.text
                }
            });
        } else {
            console.log("no thing inportant to feedback it");
        }
        _removeCallId();
        goToHomeScreen();
    }

    function setPhoneCallQueue(queue) {
        PHONE_SUBMIT_QUEUE = queue;
        localStorage.setItem("queue", queue);
    }

    function _getPhoneCallQueue() {
        return localStorage.getItem("queue");
    }

    function _clearPhoneCallQueue() {
        PHONE_SUBMIT_QUEUE = null;
        localStorage.removeItem("queue");
    }

    function setFormDate(data) {
        FORM_DATA = data;
        localStorage.setItem("formData", JSON.stringify(data));
    }

    function _getFormDate(data) {
        return JSON.parse(localStorage.getItem("formData"));
    }

    function _clearFormDate() {
        FORM_DATA = null;
        localStorage.removeItem("formData");
    }


    function send_form(data, email_id) {    

 $.ajax({
            type: "POST",
            url: V1 + "/email",
            data: {
                json: data, 
                long: GEO && GEO.longitude ? GEO.longitude : "",
                lat: GEO && GEO.latitude ? GEO.latitude : "",
                email_id:email_id
            },
            success: function(response, status, xhr) {
                if (xhr.status === 200) {
                    console.log("email submitted successfully");
                          _sent_successfully();
                   
                } else {
                    console.log("error in send email");
                    _someThingGoWrong();
                }
            },
            error: function(xhr) {
                     console.log("error in send email");
                _someThingGoWrong();
            }
        });

    }




    function send_Action(type, url, __next) {    
var SDate =_getFormDate;
 $.ajax({
            type: type,
            url:url,
            data:  JSON.stringify(SDate),
            success: function(response, status, xhr) {
                if (xhr.status === 200) {
                    console.log("email submitted successfully");
                          _sent_Next(__next);
                   
                } else {
                    console.log("error in send_Action");
                    _someThingGoWrong();
                }
            },
            error: function(xhr) {
                     console.log("error in send email");
                _someThingGoWrong();
            }
        });

    }


    function getWorkingHours(queue, result) {
        var offset = new Date().getTimezoneOffset() / 60;
        var array = [];
        $.ajax({
            type: "GET",
            url: V1 + "/workinghours/" + offset + "/" + queue,
            success: function(response) {
                if (response.message === "successful") {
                    array[0] = response.message;
                    var remaining_hours = Math.floor(response.remaining / 60);
                    var waiting_time = Math.floor(response.waiting);
                    var min = Math.floor(response.remaining);
                    array[1] = remaining_hours;
                    array[2] = waiting_time;
                    array[3] = min;
                    result(array);

                } else {
                    if (response.message === "day off") {
                        array[0] = response.message;
                        result(array);
                    }
                    if (response.message === "closed") {
                        array[0] = response.message;
                        array[1] = response.starts;
                        array[2] = response.ends;
                        result(array);
                    }
                }
            },
            error: function(xhr) {}
        });
    }

    var GEO = GEO || _getGeoInfo();
    var SIP = _getSipInfo();

    var LICENSE = LICENSE || _getLicenceKey() || window.location.href.split("/li/")[1].split(".")[0];

    var ACCESS_TOKEN = ACCESS_TOKEN || _getAccessToken();

    // page navigation load script again and clear these variable [till we put all widget in single page , load only once]
    var PHONE_SUBMIT_QUEUE = PHONE_SUBMIT_QUEUE || _getPhoneCallQueue();
    var FORM_DATA = FORM_DATA || _getFormDate();

    if (LICENSE) {
        _saveLicenceKey(LICENSE);
    }
    if (ACCESS_TOKEN) {
        _saveAccessToken(ACCESS_TOKEN);
    } else {
        $.when(_getAT()).done(function(at) {
            ACCESS_TOKEN = at.access_token;
            _saveAccessToken(ACCESS_TOKEN);
        });
    }

    if (!GEO) {
        $.when(_initGeo()).done(function(_geo) {
            GEO = _geo;
            _saveGeoInfo(GEO);
        });
    }

    $.ajaxSetup({
        beforeSend: function(jqXHR, settings) {
            var auth_token = ACCESS_TOKEN;
            if (auth_token) {
                jqXHR.setRequestHeader("Authorization", "Bearer " + auth_token);
            }
        }
    });
    return {
        scheduleSipCall: scheduleSipCall,
        schedulePhoneCall: schedulePhoneCall,
        cancleCurrentSipCall: cancleCurrentSipCall,
        setPhoneCallQueue: setPhoneCallQueue,
        setFormDate: setFormDate,
         send_form: send_form,
        getSipInfo: _getSipInfo,
        clearSipInfo: _removeSipInfo,
        goToHomeScreen: goToHomeScreen,
        goToCallOptions: _goToCallOptions,
        goTosubmitPhoneCall: _goTosubmitPhoneCall,
        goToFeedBackScreen: goToFeedBackScreen,
        fallBackToErrorPage: _someThingGoWrong,
        submitFeedback: submitFeedback,
        getWorkingHours: getWorkingHours,
        send_Action: send_Action,
        _sent_Next: _sent_Next,
        _Set_Home: _Set_Home
    };
}());