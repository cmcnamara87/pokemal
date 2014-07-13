'use strict';

/**
 * @ngdoc function
 * @name nickApp.controller:PokedexCtrl
 * @description
 * # PokedexCtrl
 * Controller of the nickApp
 */

// 1p4a3kdeljvvldl8 trove key
// http://api.trove.nla.gov.au/result?key=1p4a3kdeljvvldl8&encoding=json&zone=book&q=
angular.module('nickApp')
.controller('PokedexCtrl', function($scope,$http) {
	$scope.mydata = [];
	$scope.loaddata = function() {
		$http({method: "GET", url:"species_img_10_pretty.json", headers: {'Content-type': 'application/json'}})
		.success(function(data) {
			console.log(data);
			$scope.mydata = data;
		});
	};
	$scope.loaddata();
});