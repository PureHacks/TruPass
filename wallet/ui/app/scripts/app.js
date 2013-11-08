'use strict';

angular.module('uiApp', ['ngCookies', 'ngResource', 'ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'UserCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'UserCtrl'
      })
      .when('/confirmation', {
        templateUrl: 'views/confirmation.html',
        controller: 'UserCtrl'
      })
      .when('/profile/:userId', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .when('/edit/:userId', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .when('/update:/userId', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .when('/wallet/:userId', {
        templateUrl: 'views/wallet.html',
        controller: 'CardCtrl'
      })
      .when('/add-card', {
        templateUrl: 'views/add-card.html',
        controller: 'CardCtrl'
      })
      .when('/transaction/:cardId', {
        templateUrl: 'views/transaction.html',
        controller: 'CardCtrl'
      })
      .when('/payment', {
        templateUrl: 'views/payment.html',
        controller: 'CardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
