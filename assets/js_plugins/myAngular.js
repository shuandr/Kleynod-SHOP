var app = angular.module('kleynodShop', ['ngRoute', 'ngSanitize']);



app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|viber|tel|mailto|chrome-extension):/);
}]);



app.controller('kleynodShopCtrl', function($scope, $http) {
    $scope.frameCart = [];
    $scope.frameCodes = [];
    $scope.emptyCart = !0;


    $scope.cartQuant = 0;
    $scope.totalSum = 0;


    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;

    });
    $http.get("assets/data/shop.json").then(function(response) {
        $scope.shop = response.data;
        $scope.selectedCat = $scope.shop[0];

    });


    $scope.countSum = function() {
        $scope.totalSum = 0;
        angular.forEach($scope.frameCart, function(i) {
            $scope.totalSum += Number(i.price);
            $scope.frameCodes += i.code + ", ";
        });
    };

    $scope.selectFrame = function(frame) {
        // $scope.selectedFrame = $scope.selectedCat.items.indexOf(frame);
        $scope.selectedFrame = frame;

    };
    $scope.selectCat = function(cat) {
        $scope.selectedCat = $scope.shop[$scope.shop.indexOf(cat)];



    };

    $scope.addToCart = function(frame) {
        if (!$scope.frameCart.some(x => x.code == frame.code)) {
            // $scope.frameCart.push(index); // було робоче
            // $scope.frameCart.push($scope.selectedCat.items[index]); 
            $scope.frameCart.push(frame);
            $scope.cartQuant = $scope.frameCart.length;
            $scope.emptyCart = !$scope.frameCart;
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

    $scope.nextFrame = function() {
        arr = $scope.selectedCat.items;
        index = arr.indexOf($scope.selectedFrame);
        if (index < arr.length - 1) {
            $scope.selectedFrame = arr[index + 1];
        } else {
            $scope.selectedFrame = arr[0];
        };
    };

    $scope.prevFrame = function() {
        arr = $scope.selectedCat.items;
        index = arr.indexOf($scope.selectedFrame);
        if (index !== 0) {
            $scope.selectedFrame = arr[index - 1];

        } else {
            $scope.selectedFrame = arr[arr.length - 1];
        };
    };

    $scope.key = function($event) {
        // nреба додати ng-keydown="key($event)" в html
        if ($event.keyCode == 37) { // left arrow
            $scope.prevFrame();

        } else if ($event.keyCode == 39) { // right arrow
            $scope.nextFrame();
        }
    };


});