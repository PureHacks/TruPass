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
        // //app.receivedEvent('deviceready');
        // var xhr = new XMLHttpRequest();
        // xhr.open('GET', 'https://api.github.com/legacy/repos/search/javascript', true);
        // // Response handlers.
        // xhr.onload = function () {
        //     var repos = JSON.parse(xhr.response), i, reposHTML = "";
        //     for (i = 0; i < repos.repositories.length; i++) {
        //         reposHTML += "<p><a href='https://github.com/" + repos.repositories[i].username + "/" + repos.repositories[i].name + "'>" + repos.repositories[i].name + "</a><br>" + repos.repositories[i].description + "</p>";
        //     }
        //     document.getElementById("allRepos").innerHTML = reposHTML;
        // };

        // xhr.onerror = function () {
        //     alert('error making the request.');
        // };

        // xhr.send();

        // $.ajax("https://api.github.com/legacy/repos/search/javascript").done(function(data) {
        //      var i, repo;
        //      $.each(data.repositories, function (i, repo) {
        //         $("#allRepos").append("<p><a href='https://github.com/" + repo.username + "/" + repo.name + "'>" + repo.name + "</a><br>"+ repo.description + "&g\lt;/p>");
        //      });
        // });
        //loadRepos();
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
            email: $("#sign-up-email").val(),
            firstName: $("#sign-up-firstname").val(),
            lastName: $("#sign-up-lastname").val(),
            passcode: $("#sign-up-passcode").val()
        };

        if (data.email === "" || data.firstname === "" || data.lastname === "" || data.passcode === "") {
            if (navigator.notification) {
                navigator.notification.alert("All fields are required.", signUpAlertDismissed);
            }
        } else {
            $.mobile.changePage($("#confirmation"));

            // $.ajax({
            //     type: "POST",
            //     url: "",
            //     cache: false,
            //     data: JSON.stringify(data),
            //     contentType: "application/json; charset=utf-8",
            //     beforeSend: function () {
            //         $.mobile.showPageLoadingMsg(true);
            //     },
            //     complete: function () {
            //         $.mobile.hidePageLoadingMsg();
            //     },
            //     success: function (result) {
            //         $.mobile.changePage($("#confirmation"));
            //     },
            //     error: function (request, error) {

            //     }
            // });
        }
    });

    //login
    $("#login-form").submit(function () {
        var data = {
            email: $("#login-email").val(),
            passcode: $("#login-passcode").val()
        };

        if (data.email === "" || data.passcode === "") {
            if (navigator.notification) {
                navigator.notification.alert("All fields are required are required.", loginAlertDismissed);
            }
        } else {
            $.mobile.changePage($("#wallet"));

            // $.ajax({
            //     type: "POST",
            //     url: "",
            //     data: data,
            //     ,
            //     beforeSend: function () {
            //         $.mobile.showPageLoadingMsg(true);
            //     },
            //     complete: function () {
            //         $.mobile.hidePageLoadingMsg();
            //     },
            //     success: function (result) {
            //         $.mobile.changePage($("#wallet"));
            //     },
            //     error: function (request, error) {
            //     }
            // });
        }
    });

    //add card
    $("#add-card-form").submit(function () {
        var data = {
            mastercard: $("#add-card-mastercard").val(),
            cardholder: $("#add-card-cardholder").val(),
            expiration: $("#add-card-month").val() + $("#add-card-year").val(),
            cvv: $("#add-card-cvv").val()
        }

        if (data.mastercard === "" || data.cardholder === "" || data.expiration === "" || data.cvv === "") {
            if (navigator.notification) {
                navigator.notification.alert("All fields are required are required.", addCardAlertDismissed);
            }
        } else {
            $.mobile.changePage($("#wallet"));

            // $.ajax({
            //     type: "POST",
            //     url: "",
            //     data: data,
            //     ,
            //     beforeSend: function () {
            //         $.mobile.showPageLoadingMsg(true);
            //     },
            //     complete: function () {
            //         $.mobile.hidePageLoadingMsg();
            //     },
            //     success: function (result) {
            //         $.mobile.changePage($("#wallet"));
            //     },
            //     error: function (request, error) {
            //     }
            // });
        }
    });

    //accept trupass
    $("#accept-trupass-form").submit(function () {
        var data = {
            answer: $("#security-answer").val()
        };
        
        if (data.answer === "") {
            if (navigator.notification) {
                navigator.notification.alert("All fields are required are required.", addCardAlertDismissed);
            }
        } else {
            $.mobile.changePage($("#wallet"));

            // $.ajax({
            //     type: "POST",
            //     url: "",
            //     data: data,
            //     ,
            //     beforeSend: function () {
            //         $.mobile.showPageLoadingMsg(true);
            //     },
            //     complete: function () {
            //         $.mobile.hidePageLoadingMsg();
            //     },
            //     success: function (result) {
            //         $.mobile.changePage($("#wallet"));
            //     },
            //     error: function (request, error) {
            //     }
            // });
        }
    });

    //account confirmation
    $("#confirmation-form").submit(function () {
        $.mobile.changePage($("#enter-passcode"));

        // $.ajax({
        //     type: "POST",
        //     url: "",
        //     data: data,
        //     ,
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
        var data = {
            passcode: $("#enter-passcode-passcode").val()
        };

        if (data.passcode === "") {
            if (navigator.notification) {
                navigator.notification.alert("All fields are required are required.", enterPasscodeAlertDismissed);
            }
        } else {
            $.mobile.changePage($("#wallet"));

            // $.ajax({
            //     type: "POST",
            //     url: "",
            //     data: data,
            //     ,
            //     beforeSend: function () {
            //         $.mobile.showPageLoadingMsg(true);
            //     },
            //     complete: function () {
            //         $.mobile.hidePageLoadingMsg();
            //     },
            //     success: function (result) {
            //         $.mobile.changePage($("#wallet"));
            //     },
            //     error: function (request, error) {
            //     }
            // });
        }
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

function loadMyCards() {
    // $.ajax("").done(function (data) {
    //     var idx, card;

    //     $.each(data.cards, function (idx, card) {
    //         $("#my-cards").append("<li></li>");
    //     });
    //     $("#my-cards").listview("refresh");
    // });
}

function loadMyTruPass() {
    // $.ajax("").done(function (data) {
    //     var idx, trupass;

    //     $.each(data.cards, function (idx, trupass) {
    //         $("#my-trupass").append("<li></li>");
    //     });
    //     $("#my-trupass").listview("refresh");
    // });
}

$(document).on("pageshow", "#wallet", function (e) {
    loadMyCards();
    loadMyTruPass();
});


// $('#reposHome').bind('pageinit', function(event) {
//     loadRepos();
// });

// function loadRepos() {
//     $.ajax("https://api.github.com/legacy/repos/search/javascript").done(function(data) {
//         var i, repo;
//         $.each(data.repositories, function (i, repo) {
//             $("#allRepos").append("<li><a href='repo-detail.html?owner=" + repo.username + "&name=" + repo.name + "'>"
//             + "<h4>" + repo.name + "</h4>"
//             + "<p>" + repo.username + "</p></a></li>");
//         });
//         $('#allRepos').listview('refresh');
//     });
// }


// function getUrlVars() {
//     var vars = [], hash;
//     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
//     for(var i = 0; i < hashes.length; i++)
//     {
//         hash = hashes[i].split('=');
//         vars.push(hash[0]);
//         vars[hash[0]] = hash[1];
//     }
//     return vars;
// }


// $(document).on("pageshow", "#reposDetail", function(event) {
//     var owner = getUrlVars().owner;
//     var name = getUrlVars().name;
//     loadRepoDetail(owner,name);
// });

// function loadRepoDetail(owner,name) {
//      $.ajax("https://api.github.com/repos/" + owner + "/" + name).done(function(data) {
//          //console.log(data);
//          var repo = data;

//         $('#repoName').html("<a href='" + repo.homepage + "'>" + repo.name + "</a>");
//         $('#description').text(repo.description);
//         $('#forks').html("<strong>Forks:</strong> " + repo.forks + "<br><strong>Watchers:</strong> " + repo.watchers);

//         $('#avatar').attr('src', repo.owner.avatar_url);
//         $('#ownerName').html("<strong>Owner:</strong> <a href='" + repo.owner.url + "'>" + repo.owner.login + "</a>");
//      });
// }
