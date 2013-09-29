/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var user = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        nfc.addMimeTypeListener('rc/json', parseReceipt);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready(function () {
    //user sign up
    $("#sign-up-form").submit(function () {
        var data = {
            method: "register",
            email: $("#sign-up-email").val(),
            firstName: $("#sign-up-firstname").val(),
            lastName: $("#sign-up-lastname").val(),
            pass: $("#sign-up-passcode").val()
        };

        $.mobile.changePage($("#confirmation"));

        // if (data.email === "" || data.firstname === "" || data.lastname === "" || data.passcode === "") {
        //     if (navigator.notification) {
        //         navigator.notification.alert("All fields are required.", signUpAlertDismissed);
        //     }
        // } else {
        //     $.ajax({
        //         type: "POST",
        //         url: "/api",
        //         data: data,
        //         beforeSend: function () {
        //             $.mobile.showPageLoadingMsg(true);
        //         },
        //         complete: function () {
        //             $.mobile.hidePageLoadingMsg();
        //         },
        //         success: function (result) {
        //             if (result.ok) {
        //                 $.mobile.changePage($("#confirmation"));
        //             } else if (result.error) {
        //                 if (navigator.notification) {
        //                     navigator.notification.alert(result.error, signUpAlertDismissed);
        //                 }
        //             } else {
        //                 if (navigator.notification) {
        //                     navigator.notification.alert("An error occurred", signUpAlertDismissed);
        //                 }
        //             }
        //         },
        //         error: function (request, error) {
        //         }
        //     });
        // }
    });

    //login
    $("#login-form").submit(function () {
        var data = {
            method: "login",
            email: $("#login-email").val(),
            pass: $("#login-passcode").val()
        };

        $.mobile.changePage($("#wallet"));

        // if (data.email === "" || data.passcode === "") {
        //     if (navigator.notification) {
        //         navigator.notification.alert("All fields are required are required.", loginAlertDismissed);
        //     }
        // } else {
        //     $.ajax({
        //         type: "POST",
        //         url: "api",
        //         data: data,
        //         beforeSend: function () {
        //             $.mobile.showPageLoadingMsg(true);
        //         },
        //         complete: function () {
        //             $.mobile.hidePageLoadingMsg();
        //         },
        //         success: function (result) {
        //             if (result.error) {
        //                 if (navigator.notification) {
        //                     navigator.notification.alert(result.error, loginAlertDismissed);
        //                 }
        //             } else {
        //                 user = result;
        //                 $.mobile.changePage($("#wallet"));
        //             }
        //         },
        //         error: function (request, error) {
        //         }
        //     });
        //}
    });

    //add card
    $("#add-card-form").submit(function () {
        // var data = {
        //     method: "addCreditCard",
        //     number: $("#add-card-mastercard").val(),
        //     nameOnCard: $("#add-card-cardholder").val(),
        //     expiry: $("#add-card-month").val() + $("#add-card-year").val(),
        //     ccid: $("#add-card-cvv").val()
        // }

        // if (data.mastercard === "" || data.cardholder === "" || data.expiration === "" || data.cvv === "") {
        //     if (navigator.notification) {
        //         navigator.notification.alert("All fields are required are required.", addCardAlertDismissed);
        //     }
        // } else {
        //     $.ajax({
        //         type: "POST",
        //         url: "api",
        //         data: data,
        //         beforeSend: function () {
        //             $.mobile.showPageLoadingMsg(true);
        //         },
        //         complete: function () {
        //             $.mobile.hidePageLoadingMsg();
        //         },
        //         success: function (result) {
        //             $.mobile.changePage($("#wallet"));
        //         },
        //         error: function (request, error) {
        //         }
        //     });
        // }
    });

    //accept trupass
    $("#accept-trupass-form").submit(function () {
        // var data = {
        //     answer: $("#security-answer").val()
        // };
        
        // if (data.answer === "") {
        //     if (navigator.notification) {
        //         navigator.notification.alert("All fields are required are required.", addCardAlertDismissed);
        //     }
        // } else {
        //     $.mobile.changePage($("#wallet"));

        //     $.ajax({
        //         type: "POST",
        //         url: "",
        //         data: data,
        //         beforeSend: function () {
        //             $.mobile.showPageLoadingMsg(true);
        //         },
        //         complete: function () {
        //             $.mobile.hidePageLoadingMsg();
        //         },
        //         success: function (result) {
        //             $.mobile.changePage($("#wallet"));
        //         },
        //         error: function (request, error) {
        //         }
        //     });
        // }
    });

    //account confirmation
    $("#confirmation-form").submit(function () {
        // $.ajax({
        //     type: "POST",
        //     url: "api",
        //     data: data,
        //     beforeSend: function () {
        //         $.mobile.showPageLoadingMsg(true);
        //     },
        //     complete: function () {
        //         $.mobile.hidePageLoadingMsg();
        //     },
        //     success: function (result) {
        //         $.mobile.changePage($("#enter-passcode"));
        //     },
        //     error: function (request, error) {
        //     }
        // });
    });

    //enter passcode
    $("#enter-passcode-form").submit(function () {
        // var data = {
        //     passcode: $("#enter-passcode-passcode").val()
        // };

        // if (data.passcode === "") {
        //     if (navigator.notification) {
        //         navigator.notification.alert("All fields are required are required.", enterPasscodeAlertDismissed);
        //     }
        // } else {
        //     $.ajax({
        //         type: "POST",
        //         url: "",
        //         data: data,
        //         beforeSend: function () {
        //             $.mobile.showPageLoadingMsg(true);
        //         },
        //         complete: function () {
        //             $.mobile.hidePageLoadingMsg();
        //         },
        //         success: function (result) {
        //             $.mobile.changePage($("#wallet"));
        //         },
        //         error: function (request, error) {
        //         }
        //     });
        // }
    });

    $("#enable-nfc").click(function (e) {
        e.preventDefault();
        
        $(".nfc-disabled").hide();
        $(".nfc-enabled").show();
        shareTag();
    });

    $("#send-nfc-data").click(function (e) {
        e.preventDefault();
        
        $(".nfc-enabled").hide();
        $(".nfc-disabled").show();
        unshareTag();
    });
});

function signUpAlertDismissed() {
    $.mobile.changePage("#sign-up");
}

function loginAlertDismissed() {
    $.mobile.changePage("#login");
}

function addCardAlertDismissed() {
    $.mobile.changePage("#add-card");   
}

function enterPasscodeAlertDismissed() {
    $mobile.changePage("#enter-passcode");
}

function unshareTag() {
    nfc.unshare(
        function () {
            navigator.notification.vibrate(100);
            toast.showShort("Tag is no longer shared");
        }, function (reason) {
            navigator.notification.alert("Failed to unshare tag " + reason);
        });
}

function shareTag() {
    var mimeType = "cc/json",
        payload = '{ "cardNumber": "5113402247971907", "expMonth": "03", "expYear": "18", "cvc": "177" }',
        record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));

    nfc.share(
        [record],
        function () {
            navigator.notification.vibrate(100);
            toast.showShort("Sharing Tag");
        }, function (reason) {
            navigator.notification.alert("Failed to share tag " + reason);
            // when NDEF_PUSH_DISABLED, open setting and enable Android Beam
        });
}

function parseReceipt(receipt) {
    navigator.notification.alert("You've been charged $10.00");
}

// Load User Wallet
$(document).on("pageshow", "#wallet", function (e) {
    //console.log('wallet page');
    //console.log(user);
});
