'use strict';

angular.module('uiApp')
  .directive('creditCard', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the creditCard directive');
      }
    };
  });
