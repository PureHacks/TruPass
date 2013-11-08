'use strict';

describe('Directive: creditCard', function () {

  // load the directive's module
  beforeEach(module('uiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<credit-card></credit-card>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the creditCard directive');
  }));
});
