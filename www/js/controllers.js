angular.module('app.controllers', [])
  
.controller('orderCtrl', function ($scope, $stateParams, Services, $ionicLoading, $ionicModal, $state) {
	// some code here
	var kurma = false;

	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope,
		animation: 'slide-in-up' 
	}).then(function(modal) { $scope.modalLogin = modal; });

	$scope.openModalLogin = function() {
		$scope.modalLogin.show();
	};

	$scope.closeModalLogin = function() {
		$scope.modalLogin.hide();
	};

	$scope.login = [];

	$scope.signIn = function() {
		console.log($scope.login.email);
		console.log($scope.login.password);
		firebase.auth().signInWithEmailAndPassword($scope.login.email, $scope.login.password).catch(function(error) {
			// Handle Errors here.
  			var errorCode = error.code;
  			var errorMessage = error.message;
  			console.log(errorCode);
  			// ...
  		});
	  	$scope.modalLogin.hide()
	  	$state.go('tabsController.order');
	}

	$scope.logout = function() {
		firebase.auth().signOut().then(function() {
			console.log('signed out');
			$scope.modalLogin.show();
		}, function(error) {
			console.log(error);
		});
	}

	// if (kurma === false) {
	// 	$scope.modalLogin.show();
	// };

	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	});

	var kurir = "kurma";

	Services.getOrderQueue(kurir).then(function(orders) {
		if (orders) {
			$scope.orders = [];
			for(var r in orders) {
				Services.getOrderDetails(kurir, r).then(function(order) {
					$scope.orders.push(order);

					$ionicLoading.hide();
				}, function(err) {
					console.log(err);
				});
			}
		}
	}, function(reason) {
		console.log('Error fetch data');
		$ionicLoading.hide();
	});
})
   
.controller('prosesCtrl', function ($scope, $stateParams, Services, $ionicLoading) {
	// some code here
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	var kurir = "kurma";

	Services.getOrderProcess(kurir).then(function(orders) {
		if (orders) {
			$scope.orders = [];
			for(var r in orders) {
				Services.getOrderDetails(kurir, r).then(function(order) {
					$scope.orders.push(order);

					$ionicLoading.hide();
				});
			}
		}
	}, function(reason) {
		console.log('Error fetch data');
		$ionicLoading.hide();
	});
})
   
.controller('riwayatCtrl', function ($scope, $stateParams, Services, $ionicLoading) {
	// some code here
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	var kurir = "kurma";

	Services.getOrderDone(kurir).then(function(orders) {
		if (orders) {
			$scope.orders = [];
			for(var r in orders) {
				Services.getOrderDetails(kurir, r).then(function(order) {
					$scope.orders.push(order);

					$ionicLoading.hide();
				});
			}
		}
	}, function(reason) {
		console.log('Error fetch data');
		$ionicLoading.hide();
	});
})

.controller('transaksiCtrl', function ($scope, $stateParams) {
	// some code here
})
   
.controller('ditolakCtrl', function ($scope, $stateParams) {
	// some code here
})
 
.controller('loginCtrl', function ($scope, $stateParams, $state) {
	// no code here
	$scope.login = function() {
		$state.go('tabsController.order');
	}
})

.controller('sideCtrl', function($scope, $stateParams, $state) {
	$scope.logout = function() {
		var login = false;
	}
})