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
    $("#sign-up-submit").click(function (e) {
        e.preventDefault();
        var data = {
            email: $("#email").val(),
            firstName: $("#firstname").val(),
            lastName: $("#lastname").val(),
            passcode: $("#passcode").val()
        };

        $.ajax({
            type: "PUT",
            url: "",
            cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function () {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (result) {
                $.mobile.changePage($("#confirmation"));
            },
            error: function (request, error) {

            }
        });
    });

    //login
    $("#login-form").submit(function () {
        var data = {
            email: $("#email").val(),
            passcode: $("#passcode").val()
        };

        if (navigator.notification) {
            navigator.notification.alert("email: " + data.email + " | passcode: " + data.passcode);
        }

        // if (data.email === "" || data.passcode === "") {
        //     if (navigator.notification) {
        //         navigator.notification.alert("Email and Passcode are required.", loginAlertDismissed);
        //     }
        // } else {
        //     $.mobile.changePage($("#wallet"));

        //     // $.ajax({
        //     //     type: "POST",
        //     //     url: "",
        //     //     data: data,
        //     //     ,
        //     //     beforeSend: function () {
        //     //         $.mobile.showPageLoadingMsg(true);
        //     //     },
        //     //     complete: function () {
        //     //         $.mobile.hidePageLoadingMsg();
        //     //     },
        //     //     success: function (result) {
        //     //         $.mobile.changePage($("#wallet"));
        //     //     },
        //     //     error: function (request, error) {

        //     //     }
        //     // });
        // }
    });
});

function loginAlertDismissed() {
    $.mobile.changePage("#login");
}


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
