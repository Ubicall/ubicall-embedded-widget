"use strict";
var UbiCallManager = UbiCallManager || (function() {

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
        window.location.hash = "MainScreen";
    }

    function _saveLicenceKey(lic) {
        localStorage.setItem("lic", lic);
    }

    function _getLicenceKey() {
        return localStorage.getItem("lic");
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
            type: "get",
            url: "https://ws.ubicall.com/webservice/get_web_acc.php",
            contentType: "application/json",
            data: {
                sdk_name: "0000", // web sdk
                sdk_version: "0.2",
                deviceuid: "0000",
                device_token: "0000",
                device_model: navigator.platform,
                device_name: navigator.userAgent, // browser
                device_version: navigator.appVersion, //browser version
                licence_key: LICENSE
            },
            success: function(response) {
                if (response.status === 200) {
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

    function scheduleSipCall(queue) {
        sipSign().done(function(_sip) {
            $.ajax({
                type: "get",
                url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
                contentType: "application/json",
                data: {
                    pstn: 2, // flag mean this is usuall web call
                    voiceuser_id: _sip.username,
                    license_key: LICENSE,
                    qid: queue || PHONE_SUBMIT_QUEUE,
                    json: FORM_DATA || "",
                    long: GEO && GEO.longitude ? GEO.longitude : "",
                    lat: GEO && GEO.latitude ? GEO.latitude : ""
                },
                success: function(response) {
                    if (response.status === 200) {
                        console.log("sechduling call");
                        // sample response : {"status":200,"data":[{"call":"processing","call_id":604}]}
                        _setCallId(response.data[0].call_id);
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
                type: "get",
                url: "https://ws.ubicall.com/webservice/cancle_web_call.php",
                contentType: "application/json",
                data: {
                    call_id: call_id
                },
                success: function(response) {
                    if (response.status === 200) {
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
            type: "get",
            url: "https://ws.ubicall.com/webservice/get_schedule_web_call.php",
            contentType: "application/json",
            data: {
                pstn: 3, // flag mean this is pstn phone call
                voiceuser_id: phone,
                license_key: LICENSE,
                qid: PHONE_SUBMIT_QUEUE,
                json: FORM_DATA || "",
                long: GEO && GEO.longitude ? GEO.longitude : "",
                lat: GEO && GEO.latitude ? GEO.latitude : ""
            },
            success: function(response) {
                if (response.status === 200) {
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
                type: "get",
                url: "https://ws.ubicall.com/webservice/get_feedback.php",
                contentType: "application/json",
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

    function send_form(data, email_id) {
        $.ajax({
            type: "get",
            url: "https://ws.ubicall.com/webservice/get_send_mail.php?email_id=" + email_id + "&json=" + data + "&license_key=" + LICENSE,
            contentType: "application/json",
            success: function(response) {
                if (response.status === 200) {
                    goToHomeScreen();
                } else {
                    _someThingGoWrong();
                }
            },
            error: function(xhr) {

                _someThingGoWrong();
            }
        });

    }



    function _getFormDate(data) {
        return JSON.parse(localStorage.getItem("formData"));
    }

    function _clearFormDate() {
        FORM_DATA = null;
        localStorage.removeItem("formData");
    }

    var GEO = GEO || _getGeoInfo();
    var SIP = _getSipInfo();
    var LICENSE = LICENSE || _getLicenceKey() || window.location.href.split("/li/")[1].split(".")[0];
    // page navigation load script again and clear these variable [till we put all widget in single page , load only once]
    var PHONE_SUBMIT_QUEUE = PHONE_SUBMIT_QUEUE || _getPhoneCallQueue();
    var FORM_DATA = FORM_DATA || _getFormDate();

    if (LICENSE) {
        _saveLicenceKey(LICENSE);
    }

    if (!GEO) {
        $.when(_initGeo()).done(function(_geo) {
            GEO = _geo;
            _saveGeoInfo(GEO);
        });
    }

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
        submitFeedback: submitFeedback
    };
}());