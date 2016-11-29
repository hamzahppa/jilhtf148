angular.module('app.controllers', [])
 
.controller('loginCtrl', function ($scope, $stateParams, $state, $ionicModal, $localStorage, Services, $ionicLoading, $ionicHistory) {
	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		var user = firebase.auth().currentUser;
		if (user) {
			console.log('logged in');
			$state.go('tabsController.order');
		}
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log(user.email);
			// get Kurir Detail
			Services.getKurirData(user.email).then(function(kurir) {
				if (kurir) {
					// subsribe to topic kurir on cloud messaging
					window.FirebasePlugin.subscribe(kurir.kurir);
					console.log('subsribe to : '+kurir.kurir);
				} else {
					console.log('no kurir');
				}
			}, function(err) {
				console.log('error get kurir : '+err);
			})
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
  
.controller('orderCtrl', function ($scope, $stateParams, Services, $ionicLoading, $ionicModal, $state, $localStorage, $ionicHistory) {
	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		var user = firebase.auth().currentUser;
		if (user) {
			$scope.getOrder(user.email);
		} else {
			$state.go('login');
		}
	})

	$scope.getOrder = function(email) {
		window.FirebasePlugin.logEvent("View", {page: "List Order"});
		console.log('View List Order');
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
			duration: 5000
		});
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderQueue(kurir.kurir).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						console.log('create orders');
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);
								
								$ionicLoading.hide();
							}, function(err) {
								console.log(err);
							});
						}
					} else {
						$scope.orders = [];
						$ionicLoading.hide();
					}
				}, function(reason) {
					console.log('Error fetch data');
					$ionicLoading.hide();
					$state.go('login');
					// $scope.modalLogin.show();
				});	
			} else {
				// no kurir
			}
		})
	}
})
   
.controller('prosesCtrl', function ($scope, $stateParams, Services, $ionicLoading, $localStorage, $ionicHistory) {
	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		var user = firebase.auth().currentUser;
		if (user) {
			$scope.getProcess(user.email);
		} else {
			$state.go('login');
		}
	})

	// firebase.auth().onAuthStateChanged(function(user) {
	// 	if (user) {
	// 		$scope.getProcess(user.email);
	// 	} else {
	// 		$state.go('login');
	// 	}
	// })

	$scope.getProcess = function(email) {
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
			duration: 5000
		})
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderProcess(kurir.kurir, kurir.index).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);

								$ionicLoading.hide();
							});
						}
					} else {
						$scope.orders = [];
						$ionicLoading.hide();
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
   
.controller('riwayatCtrl', function ($scope, $stateParams, Services, $ionicLoading, $ionicHistory) {
	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		var user = firebase.auth().currentUser;
		if (user) {
			$scope.getHistory(user.email);
		} else {
			$state.go('login');
		}
	});

	// firebase.auth().onAuthStateChanged(function(user) {
	// 	if (user) {
	// 		$scope.getHistory(user.email);
	// 	} else {
	// 		$state.go('login');
	// 	}
	// })

	$scope.getHistory = function(email) {
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
			duration: 5000
		});
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderDone(kurir.kurir, kurir.index).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);

								$ionicLoading.hide();
							});
						}
					} else {
						$scope.orders = [];
						$ionicLoading.hide();
					}
				}, function(reason) {
					console.log('Error fetch data');
					$ionicLoading.hide();
				});
			}
		})	
	}
})

.controller('transaksiCtrl', function ($scope, $state, $stateParams, Services, $ionicLoading, $cordovaGeolocation, $ionicHistory, $http, GoogleMaps) {
	$ionicLoading.show({
		template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
		duration: 5000
	})

	// firebase.auth().onAuthStateChanged(function(user) {
	// 	if (user) {
	// 		// $scope.getTransaksi(user.email);
	// 		console.log(user.email);
	// 	} else {
	// 		$state.go('login');
	// 	}
	// })

	// // $scope.getTransaksi = function() {
		var user = firebase.auth().currentUser;
		if (!user) {
			$state.go('login');
		}
		Services.getKurirData(user.email).then(function(kurir) {
			if (kurir) {
				Services.getOrderDetails(kurir.kurir, $stateParams.index).then(function(order) {
					if (order) {
						$scope.order = order;
						// get distance
						var oLat = order.map.lat;
						var oLong = order.map.long;
						var dLat = order.mapUser.lat;
						var dLong = order.mapUser.long;
						var url = 'https://maps.googleapis.com/maps/api/distancematrix/';
						var type = 'json';
						var key = 'AIzaSyDcTH7G919_ydCKS_wvqoCkyH9lFMDvhgQ';
						$http.get(url+type+'?origins='+oLat+','+oLong+'&destinations='+dLat+','+dLong+'&key='+key).success(function(result) {
							console.log('data success');
							$scope.distance = result.rows[0].elements[0].distance.text;
							$scope.distanceInMeter = result.rows[0].elements[0].distance.value;
							$scope.duration = result.rows[0].elements[0].duration.text;
							$scope.durationInSecond = result.rows[0].elements[0].duration.value;
						}).error(function(error) {
							console.log('data error : '+error);
						});

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
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
			duration: 5000
		})
		// some code to change status
		Services.getKurirData(user.email).then(function(kurir) {
			console.log(status);
			if (kurir) {
				Services.getOrderDetails(kurir.kurir, $stateParams.index).then(function(order) {
					if (status == 'process' && order.status == 'queue') {
						Services.changeStatus(status, kurir.kurir, $scope.order.indexTransaksi).then(function() {
							if (status === 'process') {
								Services.newProcess(kurir.kurir, $scope.order.indexTransaksi, kurir.index).then(function() {
									Services.updateFee($scope.order.feedelivery, $scope.order.jumlah+$scope.order.feedelivery, kurir.kurir, $scope.order.indexTransaksi).then(function() {
										Services.deleteQueue(kurir.kurir, $scope.order.indexTransaksi).then(function() {
											$state.go('tabsController.proses');
											$ionicLoading.hide();
										}, function(err) {
											// should be a callback
											console.log('error delete queue : '+err);
										});
									}, function(err) {
										// should be a callback
										console.log('err updateFee : '+err);
									});
								}, function(err) {
									// should be a callback
									console.log('error create new process : '+err);
								});
							}
						}, function(err) {
							console.log('error change status : '+err);
						});
					} else if (status == 'done') {
						Services.changeStatus(status, kurir.kurir, $scope.order.indexTransaksi).then(function() {
							if (status === 'done') {
								Services.newDone(kurir.kurir, $scope.order.indexTransaksi, kurir.index).then(function() {
									Services.deleteProcess(kurir.kurir, $scope.order.indexTransaksi, kurir.index).then(function() {
										$state.go('tabsController.riwayat');
									});
								});
							} 
						}, function(err) {
							console.log('error change status : '+err);
						});
					} else if(status == 'cancel') {
						Services.changeStatus(status, kurir.kurir, $scope.order.indexTransaksi).then(function() {
							if (status === 'cancel') {
								Services.newCancel(kurir.kurir, $scope.order.indexTransaksi, kurir.index).then(function() {
									Services.deleteQueue(kurir.kurir, $scope.order.indexTransaksi).then(function() {
										console.log('order cancel');
										alert('order dicancel');
										$ionicHistory.goBack();
									}, function(err) {
										console.log(err);
									})
								}, function(err) {
									console.log(err);
								});
							}
						}, function(err) {
							console.log('error change status : '+err);
						});
					} else {
						alert('Order diambil kurir lain');
						$state.go('tabsController.order');
					}
				}, function(err) {
					console.log('Error Process Pesanan');
				})
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

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$scope.getDitolak(user.email);
		} else {
			$state.go('login');
		}
	})

	$scope.getDitolak = function(email) {
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>',
			duration: 5000
		})
		Services.getKurirData(email).then(function(kurir) {
			if (kurir) {
				Services.getOrderCancel(kurir.kurir, kurir.index).then(function(orders) {
					if (orders) {
						$scope.orders = [];
						for(var r in orders) {
							Services.getOrderDetails(kurir.kurir, r).then(function(order) {
								$scope.orders.push(order);

								$ionicLoading.hide();
							});
						}
					} else {
						$scope.orders = [];
						$ionicLoading.hide();
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
		console.log(user);
		Services.getKurirData(user.email).then(function(kurir) {
			if (kurir) {
				$scope.kurir = kurir;
			} else {
				console.log("error get data kurir");
			}
		}, function(err) {
			$state.go('login');
		})
	} else {
		console.log('error');
	}

	$scope.signOut = function() {
		window.FirebasePlugin.unsubscribe($scope.kurir.kurir);
		console.log('unsubscribe from '+$scope.kurir.kurir);
		firebase.auth().signOut().then(function() {
			console.log('signed out');
			$state.go('login');
		}, function(error) {
			console.log(error);
		});
	}
})