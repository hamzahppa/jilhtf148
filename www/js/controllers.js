angular.module('app.controllers', [])
 
.controller('loginGateCtrl', function ($scope, $stateParams, $state, $ionicModal, $localStorage, Services) {
	// MODAL Login //
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope,
		animation: 'slide-in-up' ,
		hardwareBackButtonClose: false
	}).then(function(modal) { $scope.modalLogin = modal; });

	$scope.$on('$ionicView.enter', function() {
		Services.connectFirebase().then(function(result) {
			if (result) {
				// logged in, can access firebase
				console.log('logged in');
				$state.go('tabsController.order');
			}
		}, function(error) {
			// cant access firebase, no access
			$scope.modalLogin.show();
		})
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$state.go('tabsController.order');
		} else {
			$scope.modalLogin.show();
		}
	})

	// define login variable
	$scope.login = [];
	
	$scope.signIn = function() {
		firebase.auth().signInWithEmailAndPassword($scope.login.email, $scope.login.password).then(function(result) {
			// should save email and username on localstorage
			// clear login variable
			$scope.login = [];

			// go to order
			$state.go('tabsController.order');

			// hide modal login
			$scope.modalLogin.hide()
		}).catch(function(error) {
			// Handle Errors here.
  			var errorCode = error.code;
  			var errorMessage = error.message;
  			console.log(errorCode);
  			console.log(errorMessage);
  		});
	}
})
  
.controller('orderCtrl', function ($scope, $stateParams, Services, $ionicLoading, $ionicModal, $state, $localStorage) {
	// some code here
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$scope.getOrder(user.email);
		} else {
			$state.go('loginGate');
		}
	})

	// $scope.$on('$ionicView.enter', function() {
	// 	var user = firebase.auth().currentUser;
	// 	if (user) {
	// 		$scope.getOrder(user.email);
	// 	} else {
	// 		$state.go('loginGate');
	// 	}
	// })

	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	});

	$scope.getOrder = function(email) {
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderQueue(kurir.kurir).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails($scope.kurir.kurir, r).then(function(order) {
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
					$state.go('loginGate');
					// $scope.modalLogin.show();
				});	
			} else {
				// no kurir
			}
		})
	}
})
   
.controller('prosesCtrl', function ($scope, $stateParams, Services, $ionicLoading, $localStorage) {
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$scope.getProcess(user.email);
		} else {
			$state.go('loginGate');
		}
	})

	$scope.getProcess = function(email) {
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderProcess(kurir.kurir).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);

								$ionicLoading.hide();
							});
						}
					}
				}, function(reason) {
					console.log('Error fetch data');
					$ionicLoading.hide();
				});
			} else {
				// no kurir
			}
		})
	}
})
   
.controller('riwayatCtrl', function ($scope, $stateParams, Services, $ionicLoading) {
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$scope.getHistory(user.email);
		} else {
			$state.go('loginGate');
		}
	})

	$scope.getHistory = function(email) {
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderDone(kurir.kurir).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);

								$ionicLoading.hide();
							});
						}
					}
				}, function(reason) {
					console.log('Error fetch data');
					$ionicLoading.hide();
				});
			}
		})	
	}
})

.controller('transaksiCtrl', function ($scope, $state, $stateParams, Services, $ionicLoading) {
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	// firebase.auth().onAuthStateChanged(function(user) {
	// 	if (user) {
	// 		// $scope.getTransaksi(user.email);
	// 		console.log(user.email);
	// 	} else {
	// 		$state.go('loginGate');
	// 	}
	// })

	// // $scope.getTransaksi = function() {
		var user = firebase.auth().currentUser;
		if (!user) {
			$state.go('loginGate');
		}
		Services.getKurirData(user.email).then(function(kurir) {
			if (kurir) {
				console.log($stateParams.index);
				Services.getOrderDetails(kurir.kurir, $stateParams.index).then(function(order) {
					if (order) {
						$scope.order = order;
						$ionicLoading.hide();
					} else {
						// no order
						console.log('cant get transaksi, no order');
					}
				}, function(error) {
					// error
					console.log('cant get transaksi, error');
				})
			} else {
				// nokurir
				console.log('cant get transaksi, no kurir');
			}
		}, function(error) {
			// error
			console.log('cant get transaksi, error kurir');
		})		
	// // }

	$scope.changeStatus = function(status) {
		// some code to change status
		Services.getKurirData(user.email).then(function(kurir) {
			if (kurir) {
				Services.changeStatus(status, kurir.kurir, $scope.order.index);
				if (status === 'process') {
					Services.newProcess(kurir.kurir, $scope.order.index);
					Services.deleteQueue(kurir.kurir, $scope.order.index);
					$state.go('tabsController.proses');
					// add to process
				} else if (status === 'done') {
					Services.newDone(kurir.kurir, $scope.order.index);
					Services.deleteProcess(kurir.kurir, $scope.order.index);
					$state.go('tabsController.riwayat');
					// add to done
				} else if (status === 'cancel') {
					// add to cancel
				}
			} else {
				console.log('error no kurir');
			}
		})
	}
})
   
.controller('ditolakCtrl', function ($scope, $stateParams, Services, $ionicLoading) {
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$scope.getDitolak(user.email);
		} else {
			$state.go('loginGate');
		}
	})

	$scope.getDitolak = function(email) {
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderCancel(kurir.kurir).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);

								$ionicLoading.hide();
							});
						}
					}
				}, function(reason) {
					console.log('Error fetch data');
					$ionicLoading.hide();
				});
			}
		})	
	}
})

.controller('sideCtrl', function($scope, $stateParams, $state, Services, $localStorage) {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			Services.getKurirData(user.email).then(function(kurir) {
				if (kurir) {
					$scope.kurir = kurir;
				} else {
					console.log("error get data kurir");
				}
			})
		} else {
			console.log('no user');
		}
	})
})

.controller('profilCtrl', function($scope, $state, Services, $localStorage, $ionicModal) {
	// profile code
	var user = firebase.auth().currentUser;
	if (user) {
		Services.getKurirData(user.email).then(function(kurir) {
			if (kurir) {
				$scope.kurir = kurir;
			} else {
				console.log("error get data kurir");
			}
		}, function(err) {
			$state.go('loginGate');
		})
	}

	$scope.signOut = function() {
		firebase.auth().signOut().then(function() {
			console.log('signed out');
			$state.go('loginGate');
		}, function(error) {
			console.log(error);
		});
	}
})