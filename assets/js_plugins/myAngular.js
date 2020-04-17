var app = angular.module('kleynodShop', ['ngRoute', 'ngSanitize']);



app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});




app.controller('kleynodShopCtrl', function($scope, $http) {
    $scope.frameCart = [];
    $scope.frameCodes = [];

    $scope.cartQuant = 0;
    $scope.totalSum = 0;
    $scope.countSum = function() {
        $scope.totalSum = 0;
        angular.forEach($scope.frameCart, function(i) {
            $scope.totalSum += $scope.data[i].price;
            $scope.frameCodes += $scope.data[i].code +",";
        });
    };



    $scope.selectFrame = function(index) {
        $scope.selectedFrame = index;

    };
    $scope.addToCart = function(index) {

        if ($scope.frameCart.indexOf(index) === -1) {
            $scope.frameCart.push(index);
            $scope.cartQuant++;
        }
    };


    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;

    });
});

// ["ім’я", "телефон", "коди рамок", "примітки", "оплата", "delivery", "адреса", "сума"]