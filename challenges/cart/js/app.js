angular.module('Coffees', ['ui.router', 'angular-uuid', 'LocalStorageModule', 'firebase'])
	.constant('cartKey', 'cart')
	.constant('firebaseUrl', 'https://dawg-coffee-kev.firebaseIO.com')
	.factory('checkout', function (uuid, localStorageService, cartKey) {
		return localStorageService.get(cartKey) || [];
	})
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('main', {
				url: '/menu',
				templateUrl: 'views/selection.html',
				controller: 'CoffeesController'
			})
			.state('checkout', {
				url: '/checkout',
				templateUrl: 'views/checkout.html',
				controller: 'CheckoutController'
			})
			.state('confirm', {
				url: '/confirm',
				templateUrl: 'views/confirm.html',
				controller: 'ConfirmController'
			});

		$urlRouterProvider.otherwise('/menu');
	})
	.directive('inTenYears', function() {
		return {
			require: 'ngModel',
			link: function (scope, elem, attrs, controller) {
				controller.$validators.inTenYears = function(modelValue) {
					var currentYear = new Date().getFullYear();
					var givenYear = new Date(modelValue);
					return (currentYear <= givenYear && givenYear - 10 <= currentYear);
				}
			}
		};
	})
	.directive('luhn', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, controller) {
                controller.$validators.luhn = function(modelValue) {
                    var regex = new RegExp("^[0-9]{16}$");
                    if (!regex.test(modelValue))
                        return false;

                    var sum = 0;
                    for (var i = 0; i < modelValue.length; i++) {
                        var intVal = parseInt(modelValue.substr(i, 1));
                        if (i % 2 == 0) {
                            intVal *= 2;
                            if (intVal > 9) {
                                intVal = 1 + (intVal % 10);
                            }

                        }
                        sum += intVal;
                    }
                    return (sum % 10) == 0;
                }
            }
        };
    })
    .controller('ConfirmController', function($scope, $stateParams, $state, uuid,
    		localStorageService) {

    })
	.controller('CheckoutController', function($scope, $stateParams, $state, uuid,
			localStorageService, firebaseUrl, $firebaseArray, cartKey) {

		$scope.saveCheckout = function (checkoutForm) {
			if (repeatInp.isChecked) {
				orderForm.billName = orderForm.name;
				orderForm.billAddressOne = orderForm.addressOne;
				orderForm.billAddressTwo = orderForm.addressTwo;
				orderForm.billCity = orderForm.city;
				orderForm.billState = orderForm.state;
				orderForm.billZip = orderForm.zip;
			}

			var fire = new Firebase(firebaseUrl);
			$scope.orders = $firebaseArray(fire);
			$scope.orders.$add($scope.cart);
			$scope.orders.$add($scope.orderForm);
			cart = [];
			localStorageService.set(cartKey, cart);
			$state.go('confirm');
		};

	})
    .controller('CoffeesController', function($scope, $stateParams, $state, uuid, 
    	$http, cartKey) {
        'use strict';

        $scope.cart = angular.fromJson(localStorage.getItem(cartKey)) || [];
        $scope.total = angular.fromJson(localStorage.getItem('total')) || 0.00;
        $scope.newCoffee = {};
        $http.get('data/products.json')
            .then(function(results) {
                $scope.coffees = results.data;
  			$scope.categories = _.uniq(_.flatten(_.pluck($scope.coffees, 'categories')));
        	$scope.categories.push('');
        });

        if ($scope.cart.length == 0) {
        	$scope.total = 0.00;
        }

        function saveCart() {
        	localStorage.setItem(cartKey, angular.toJson($scope.cart));

        }

        function saveTotal() {
        	localStorage.setItem('total', angular.toJson($scope.total));
        }

        $scope.updateCart = function(coffee) {
        	var newItem = true;
        	$scope.newCoffee.name = coffee.name;
        	$scope.newCoffee.price = coffee.price;
        	$scope.newCoffee.ext = parseInt($scope.newCoffee.qty) * parseFloat($scope.newCoffee.price);

        	angular.forEach($scope.cart, function(cartItem) {
        		if (angular.equals(cartItem.name, $scope.newCoffee.name)) {
        			console.log('boo');
        			newItem = false;
        			if ((parseInt(cartItem.qty) + parseInt($scope.newCoffee.qty)) <= 10 && parseInt(cartItem.qty) < 10) {
        				console.log('boo2');
        				if ($scope.newCoffee.grind != cartItem.grind) {
        					$scope.cart.push($scope.newCoffee);
        				} else {
        					cartItem.qty = parseInt(cartItem.qty) + parseInt($scope.newCoffee.qty);
        					cartItem.ext = parseFloat(cartItem.ext) + parseFloat($scope.newCoffee.ext);
        				}
	        			$scope.total = parseFloat($scope.total) + parseFloat($scope.newCoffee.ext);
	        			saveCart();
	        			saveTotal();
        			}
        		}
        	});

        	if (newItem && $scope.newCoffee.qty <= 10) {
        		$scope.total += $scope.newCoffee.ext;
        		$scope.cart.push($scope.newCoffee);
        		saveCart();
        		saveTotal();
        	}
        	$scope.newCoffee = {};
        };

        $scope.removeOrder = function(item) {
        	$scope.total -= item.ext;
        	$scope.cart.splice($scope.cart.indexOf(item), 1);
        	saveCart();
        	saveTotal();
        }
    });