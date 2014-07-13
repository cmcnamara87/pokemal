'use strict';

/**
 * @ngdoc function
 * @name nickApp.controller:PokedexCtrl
 * @description
 * # PokedexCtrl
 * Controller of the nickApp
 */

// 1p4a3kdeljvvldl8 trove key
// http://api.trove.nla.gov.au/result?key=1p4a3kdeljvvldl8&encoding=json&zone=newspaper&q=
angular.module('nickApp')
.controller('PokedexCtrl', function($scope,$http) {
	$scope.mydata = [];
	$scope.troveData = [];
	
	$scope.loadtrove = function() {
		$http({method: "GET", url:"trovelevel1.json", headers: {'Content-type': 'application/json'}})
		.success(function(data) {
			console.log(data.response.zone[0].records.article);
			$scope.troveData=data.response.zone[0].records.article;
		});
	};
	
	$scope.loaddata = function() {
		$http({method: "GET", url:"species_img_10_pretty.json", headers: {'Content-type': 'application/json'}})
		.success(function(data) {
			//console.log(data);
			$scope.mydata = data;
			$scope.selected_animal=data._Species[0];
		});
	};
	$scope.loaddata();
	

	$scope.query=function (data){
		$scope.selected_animal=data;
		$scope.loadtrove();
		//console.log($scope.selected_animal);
		//console.log($scope.selected_animal.ConservationStatus.ConservationSignificant);
		// $http({method: "GET", url:"http://api.trove.nla.gov.au/result?key=1p4a3kdeljvvldl8&encoding=json&zone=article&q="+data.FamilyCommonName, headers: {'Content-type': 'application/json'}})
		// .success(function(data) {
		// 	console.log(data);
		// 	$scope.troveData = data;
		// });
	};
});