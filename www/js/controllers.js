angular.module('app.controllers', [])
  
.controller('orderCtrl', function ($scope, $stateParams, Services, $ionicLoading) {
	// some code here
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	});

	Services.getStatusQueue(kurir).then(function(orders) {
		if (orders) {
			$scope.orders = [];
			for(var r in orders) {
				Services.getOrderDetails(r).then(function(order) {
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
   
.controller('prosesCtrl', function ($scope, $stateParams, Services, $ionicLoading) {
	// some code here
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	Services.getStatusProcess(kurir).then(function(orders) {
		if (orders) {
			$scope.orders = [];
			for(var r in orders) {
				Services.getOrderDetails(r).then(function(order) {
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

	Services.getStatusDone(kurir).then(function(orders) {
		if (orders) {
			$scope.orders = [];
			for(var r in orders) {
				Services.getOrderDetails(r).then(function(order) {
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
 
.controller('loginCtrl', function ($scope, $stateParams) {
	// no code here
})