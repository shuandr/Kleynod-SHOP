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
    $http.get("assets/data/shop.json").then(function(response) {
        $scope.shop = response.data;
        $scope.selectedCat = $scope.shop[0];

    });


    $scope.countSum = function() {
        $scope.totalSum = 0;
        angular.forEach($scope.frameCart, function(i) {
            $scope.totalSum += Number(i.price);
            $scope.frameCodes += i.code + ",";
        });
    };

    $scope.selectFrame = function(frame) {
        $scope.selectedFrame = $scope.selectedCat.items.indexOf(frame);

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
        // $scope.selectedFrame = selectFrame(index);
    };

    $scope.nextFrame = function() {
        if ($scope.selectedFrame < $scope.selectedCat.items.length - 1) {
            $scope.selectedFrame++;
        } else {
            $scope.selectedFrame = 0;
        };
    };

    $scope.prevFrame = function() {
        if ($scope.selectedFrame !== 0) {
            $scope.selectedFrame--;

        } else {
            $scope.selectedFrame = $scope.selectedCat.items.length - 1;
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

// ["ім’я", "телефон", "mail", "коди рамок", "примітки", "оплата", "delivery", "адреса", "адреса НП", "сума"]