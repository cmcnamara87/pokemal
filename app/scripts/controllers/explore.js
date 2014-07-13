'use strict';

/**
 * @ngdoc function
 * @name nickApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the nickApp
 */
angular.module('nickApp')
  .controller('ExploreCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
