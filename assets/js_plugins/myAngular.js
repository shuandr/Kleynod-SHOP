var app = angular.module('kleynodShop', ['ngRoute', 'ngSanitize']); // "ngAnimate",

app.config(['$compileProvider', "$routeProvider", "$interpolateProvider",

    function($compileProvider, $routeProvider, $interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|viber|tel|mailto|chrome-extension):/);
        $routeProvider
            .when('/shop', {
                templateUrl: 'shop.html'
            })
            .when('/product', {
                templateUrl: 'product.html'
            })
            .when('/order', {
                templateUrl: 'order.html'
            })
            .otherwise({
                redirectTo: '/shop'
            });
    }
]);

app.controller('kleynodShopCtrl', function($scope, $http, $route, $routeParams, $location, $timeout) {
    $scope.frameCart = [];
    $scope.frameCodes = [];
    $scope.emptyCart = !0;
    $scope.cartQuant = 0;
    $scope.totalSum = 0;
    
    $scope.$on('$viewContentLoaded', function(event) {
        $timeout(function() {
            if ($route.current.templateUrl == 'product.html') {
                $location.search({ id: $scope.selectedFrame.code });

            }
        }, 200);
    });

    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;

    });
    $http.get("assets/data/shop.json").then(function(response) {
        $scope.shop = response.data;
        var urlQuery = $location.search();
        if (urlQuery.cat && urlQuery.cat < $scope.shop.length) {
            $scope.selectedCat = $scope.shop[urlQuery.cat];
        } else {
            $scope.selectedCat = $scope.shop[0];

        }
        if (urlQuery.id) {
            for (var i = $scope.shop.length - 1; i >= 0; i--) {
                var cat = $scope.shop[i].items;

                for (var u = cat.length - 1; u >= 0; u--) {
                    if (cat[u].code == urlQuery.id) {
                        $scope.selectedFrame = cat[u];
                        $scope.selectedCat = $scope.shop[i];
                        break;
                    }
                }
            }
        } else {
            $scope.selectedFrame = $scope.shop[0].items[0];
        }

    });



    $scope.countSum = function() {
        $scope.totalSum = 0;
        angular.forEach($scope.frameCart, function(i) {
            $scope.totalSum += Number(i.price);
            $scope.frameCodes += i.code + ", ";
        });
    };

    $scope.selectFrame = function(frame) {
        $scope.selectedFrame = frame;
        $location.search({ id: frame.code });


    };

    $scope.selectCat = function(cat) {
        $scope.selectedCat = $scope.shop[$scope.shop.indexOf(cat)];
        $location.search({ cat: $scope.shop.indexOf(cat) });

    };

    $scope.addToCart = function(frame) {
        if (!$scope.frameCart.some(x => x.code == frame.code)) {
            
            for (var i = $scope.shop.length - 1; i >= 0; i--) {
                var cat = $scope.shop[i];

                for (var u = cat.items.length - 1; u >= 0; u--) {
                    if (cat.items[u].code == frame.code) {
                        frame.Field1 = cat.Field1;
                        frame.Field2 = cat.Field2;
                        frame.Field3 = cat.Field3;
                        break;
                    }
                }
            }

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

        $location.search({ id: $scope.selectedFrame.code });

    };

    $scope.prevFrame = function() {
        arr = $scope.selectedCat.items;
        index = arr.indexOf($scope.selectedFrame);
        if (index !== 0) {
            $scope.selectedFrame = arr[index - 1];

        } else {
            $scope.selectedFrame = arr[arr.length - 1];
        };
        $location.search({ id: $scope.selectedFrame.code });

    };

    $scope.key = function($event) {
        // nреба додати ng-keydown="key($event)" в html
        if ($event.keyCode == 37) { // left arrow
            $scope.prevFrame();
            // console.log("йо");


        } else if ($event.keyCode == 39) { // right arrow
            $scope.nextFrame();
        }
    };

    // FORM-SUBMISSION-HANDLER

    // get all data in form and return object
    function getFormData() {
        var elements = document.getElementById("gform").elements; // all form elements
        var fields = Object.keys(elements).map(function(k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
                // special case for Edge's html collection
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function(item, pos, self) {
            return self.indexOf(item) == pos && item;
        });
        var data = {};
        fields.forEach(function(k) {
            data[k] = elements[k].value;
            if (elements[k].type === "checkbox") {
                data[k] = elements[k].checked;
                // special case for Edge's html collection
            } else if (elements[k].length) {
                for (var i = 0; i < elements[k].length; i++) {
                    if (elements[k].item(i).checked) {
                        data[k] = elements[k].item(i).value;
                    }
                }
            }
        });
        console.log(data);
        return data;
    }

    $scope.formSubmit = function() { // handles form submit withtout any jquery
        // event.preventDefault(); // we are submitting via xhr below
        var data = getFormData(); // get the values submitted in the form

        // var url = event.target.action; //
        var url = "https://script.google.com/macros/s/AKfycbzTk1MXcnDWmccVSjUGPJBzp_7SpaRey36ebKNFRg/exec"; //
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            console.log(xhr.status, xhr.statusText)
            console.log(xhr.responseText);
            // document.getElementById('gform').style.display = 'none'; // hide form
            document.getElementById('thankyou_message').style.display = 'block';
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        xhr.send(encoded);
        // }
    }
    // END of FORM-SUBMISSION-HANDLER
});

app.directive('angularMask', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            isModelValueEqualViewValues: '='
        },
        link: function($scope, el, attrs, model) {
            $scope.$watch(function() { return attrs.angularMask; }, function(value) {
                if (model.$viewValue != null) {
                    model.$viewValue = mask(String(model.$viewValue).replace(/\D/g, ''));
                    el.val(model.$viewValue);
                }
            });

            model.$formatters.push(function(value) {
                return value === null ? '' : mask(String(value).replace(/\D/g, ''));
            });

            model.$parsers.push(function(value) {
                model.$viewValue = mask(value);
                var modelValue = $scope.isModelValueEqualViewValues ? model.$viewValue : String(value).replace(/\D/g, '');
                el.val(model.$viewValue);
                return modelValue;
            });

            function mask(val) {
                var format = attrs.angularMask,
                    arrFormat = format.split('|');

                if (arrFormat.length > 1) {
                    arrFormat.sort(function(a, b) {
                        return a.length - b.length;
                    });
                }

                if (val === null || val == '') {
                    return '';
                }
                var value = String(val).replace(/\D/g, '');
                if (arrFormat.length > 1) {
                    for (var a in arrFormat) {
                        if (value.replace(/\D/g, '').length <= arrFormat[a].replace(/\D/g, '').length) {
                            format = arrFormat[a];
                            break;
                        }
                    }
                }
                var newValue = '';
                for (var nmI = 0, mI = 0; mI < format.length;) {
                    if (!value[nmI]) {
                        break;
                    }
                    if (format[mI].match(/\D/)) {
                        newValue += format[mI];
                    } else {
                        newValue += value[nmI];
                        nmI++;
                    }
                    mI++;
                }
                return newValue;
            }
        }
    };
});