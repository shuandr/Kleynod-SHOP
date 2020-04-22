var app = angular.module('kleynodShop', ['ngRoute', 'ngSanitize']);



app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});




app.controller('kleynodShopCtrl', function($scope, $http) {
    $scope.frameCart = [];
    $scope.frameCodes = [];
    $scope.emptyCart = !0;


    $scope.cartQuant = 0;
    $scope.totalSum = 0;


    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;

    });

    $scope.countSum = function() {
        $scope.totalSum = 0;
        angular.forEach($scope.frameCart, function(i) {
            $scope.totalSum += $scope.data[i].price;
            $scope.frameCodes += $scope.data[i].code + ",";
        });
    };

    $scope.selectFrame = function(index) {
        $scope.selectedFrame = index;

    };

    $scope.addToCart = function(index) {
        if ($scope.frameCart.indexOf(index) === -1) {
            $scope.frameCart.push(index);
            $scope.cartQuant = $scope.frameCart.length;
            $scope.emptyCart = !$scope.frameCart ;
        }
    };

    $scope.deleteFromCart = function(index) {
        $scope.frameCart.splice(index, 1);
        $scope.countSum();
        $scope.cartQuant = $scope.frameCart.length;
        $scope.emptyCart = !$scope.frameCart.length;

    };
     $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };





});

// ["ім’я", "телефон", "mail", "коди рамок", "примітки", "оплата", "delivery", "адреса", "адреса НП", "сума"]