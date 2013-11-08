'use strict';

angular.module('uiApp')
  .controller('CardCtrl', function ($scope) {
    $scope.cards = api.cards({ "userId": 1} );
    $scope.apply();
  });
