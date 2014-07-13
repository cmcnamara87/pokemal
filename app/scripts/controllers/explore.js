'use strict';

/**
 * @ngdoc function
 * @name nickApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the nickApp
 */
angular.module('nickApp')
    .controller('ExploreCtrl', function ($scope,$routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.lat=$routeParams.lat;
    $scope.lon=$routeParams.lon;
    console.log($routeParams);
    /*
    $scope.loaddata = function($routeParams,$scope) {
	console.log($routeParams);
	    $scope.params = $routeParams.message;
	};
	$scope.loaddata();
	console.log("hello");
	console.log($scope.params);
    */

  });
