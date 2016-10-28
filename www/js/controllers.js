angular.module('app.controllers', [])
 
.controller('loginGateCtrl', function ($scope, $stateParams, $state, $ionicModal, $localStorage, Services, $ionicLoading) {
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
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>'
		});

		firebase.auth().signInWithEmailAndPassword($scope.login.email, $scope.login.password).then(function(result) {
			// hide modal login
			$scope.modalLogin.hide();
			// hide login
			$ionicLoading.hide();
			// clear login variable
			$scope.login = [];
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
						if ($scope.orders) {
							// not doing cuz data already loaded
							// must refresh data lulz
							console.log('already loaded');
						} else {
							$scope.orders = [];
							for(var r in orders) {
								Services.getOrderDetails(kurir.kurir, r).then(function(order) {
									$scope.orders.push(order);
									
									$ionicLoading.hide();
								}, function(err) {
									console.log(err);
								});
							}
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

.controller('transaksiCtrl', function ($scope, $state, $stateParams, Services, $ionicLoading, $cordovaGeolocation) {
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
				Services.getOrderDetails(kurir.kurir, $stateParams.index).then(function(order) {
					if (order) {
						$scope.order = order;
						// $scope.menus = [];
						// for(var id in order.pesanan) {
						// 	// get detail for each menu
						// 	Services.getMenuDetails(order.indexResto, order.pesanan[id].indexMenu).then(function(menu) {
						// 		$scope.menus.push(menu);
								
						// 		$ionicLoading.hide();
						// 	}, function(err) {
						// 		console.log(err);
						// 	});
						// }
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
				Services.changeStatus(status, kurir.kurir, $scope.order.indexTransaksi);
				if (status === 'process') {
					Services.newProcess(kurir.kurir, $scope.order.indexTransaksi);
					Services.deleteQueue(kurir.kurir, $scope.order.indexTransaksi);
					$state.go('tabsController.proses');
					// add to process
				} else if (status === 'done') {
					Services.newDone(kurir.kurir, $scope.order.indexTransaksi);
					Services.deleteProcess(kurir.kurir, $scope.order.indexTransaksi);
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

	$scope.openMap = function(dlat, dlong) {
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
			duration: 5000
		})
		console.log(dlat, dlong);
		var options = {timeout: 3000, enableHighAccuracy: true};
		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			window.open('http://maps.google.com/maps?saddr=+'+lat+'+,+'+lng+'+&daddr=+'+dlat+'+,+'+dlong+'+&dirflg=d', '_system', 'location=yes');
			// window.open('geo:'+lat+','+lng+'?q='+restoLat+','+restoLng+'('+restoran.namaResto+')', '_system', 'location=yes');
			$ionicLoading.hide();
			return false;
		}, function(error){
			console.log("Could not get location");
			window.open('http://maps.google.com/maps?saddr=Current+Location&daddr=+'+dlat+'+,+'+dlong+'+&dirflg=d', '_system', 'location=yes');
			$ionicLoading.hide();
			// $ionicPopup.alert({
			// 	title: 'Error',
			// 	template: 'Tidak dapat menggunakan GPS, hidupkan setting GPS anda',
			// 	okText: 'OK',
			// 	okType: 'button-balanced'
			// });
		});
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