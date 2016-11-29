var config = {
    apiKey: "AIzaSyCQz7kgKgqjOo6ptPdvEGJLxOCBKUPZEoY",
    authDomain: "project-1449647215698534337.firebaseapp.com",
    databaseURL: "https://project-1449647215698534337.firebaseio.com",
    storageBucket: "project-1449647215698534337.appspot.com"
};

firebase.initializeApp(config);

var rootRef = firebase.database().ref();
var order = firebase.database().ref('transaksi');
var status = firebase.database().ref('status');
var status_queue = firebase.database().ref('status').child('queue');
var status_process = firebase.database().ref('status').child('process');
var status_done = firebase.database().ref('status').child('done');
var status_cancel = firebase.database().ref('status').child('cancel');
var kurir = firebase.database().ref('kurir');
var menu = firebase.database().ref('dataMenu');
var user = firebase.database().ref('user');

angular.module('app.services', [])

.factory('GoogleMaps', function($http){
	var url = "https://maps.googleapis.com/maps/api/distancematrix/";
	var type = "json";
	var key = 'AIzaSyDcTH7G919_ydCKS_wvqoCkyH9lFMDvhgQ';
	return {
		distance: function() {
			console.log('call get');
			return $http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=-7.5582992,110.8570153&destinations=-7.555757,110.847021&key=AIzaSyDcTH7G919_ydCKS_wvqoCkyH9lFMDvhgQ', {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json; charset=UTF-8;'
				}
			})
		}
	}
})

.service('Services', function($q, $localStorage, $http) {
	localStorage
	$localStorage = $localStorage.$default({
		email : null,
		kurir : null
	})

	this.connectFirebase = function() {
		return promiseAdded(
			firebase.database().ref('check')
		);
	}

	this.checkLogin = function() {
		var user = firebase.auth().currentUser;
		if (user) {
			return true;
		} return false;
	}

	// get Kurir Data
	this.getKurirData = function(email) {
		return promiseAdded(
			kurir.orderByChild('email').equalTo(email)
		);
	}

	// get All order of Kurir
	this.getOrders = function(kurir) {
		return promiseValue(
			order.child(kurir)
		);
	}

	// get status queue
	this.getOrderQueue = function(kurir) {
		return promiseValue(
			status_queue.child(kurir)
		);
	}

	// get status process
	this.getOrderProcess = function(kurir, akunkurir) {
		return promiseValue(
			status_process.child(kurir +'/'+ akunkurir)
		);
	}

	// get status done
	this.getOrderDone = function(kurir, akunkurir) {
		return promiseValue(
			status_done.child(kurir +'/'+ akunkurir)
		);
	}

	// get status cancel
	this.getOrderCancel = function(kurir, akunkurir) {
		return promiseValue(
			status_cancel.child(kurir +'/'+ akunkurir)
		);
	}

	// get order detail
	this.getOrderDetails = function(kurir, index) {
		return promiseAdded(
			order.child(kurir).orderByChild('indexTransaksi').equalTo(index)
		);
	}

	// get Menu detail
	this.getMenuDetails = function(idResto, idMenu) {
		return promiseAdded(
			menu.child(idResto).orderByChild('indexmenu').equalTo(idMenu)
		);
	}

	this.getUserDetails = function(username) {
		return promiseAdded(
			user.orderByChild('username').equalTo(username)
		);
	}

	this.checkOrderQueue = function(kurir, index) {
		return promiseAdded(
			order.child(kurir +'/'+ index +'/'+ akunkurir)
		);
	}

	// change status
	this.changeStatus = function(status, kurir, index) {
		var promise = $q.defer();

		order.child(kurir +'/'+ index +'/status').set(status).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// update feedelivery and total
	this.updateFee = function(feedelivery, total, kurir, index) {
		var promise = $q.defer();

		order.child(kurir +'/'+ index).update({
			'feedelivery': feedelivery,
			'totalHarga': total
		}).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// update ongkir only
	this.setNewOngkir = function(feedelivery, kurir, index) {
		var promise = $q.defer();

		order.child(kurir +'/'+ index +'/feedelivery').set(feedelivery).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// update totalHarga only
	this.setNewTotal = function(total, kurir, index) {
		var promise = $q.defer();

		order.child(kurir +'/'+ index +'/totalHarga').set(total).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// add new entri in proses list
	this.newProcess = function(kurir, index, akunkurir) {
		var promise = $q.defer();

		status_process.child(kurir +'/'+ akunkurir +'/'+ index).set({
			'index': index
		}).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// add new entri di riwayat list
	this.newDone = function(kurir, index, akunkurir) {
		var promise = $q.defer();

		status_done.child(kurir +'/'+ akunkurir +'/'+ index).set({
			'index': index
		}).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// add new entri di list ditolak
	this.newCancel = function(kurir, index, akunkurir) {
		var promise = $q.defer();

		status_cancel.child(kurir +'/'+ akunkurir +'/'+ index).set({
			'index': index
		}).then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// delete entri in queue list
	this.deleteQueue = function(kurir, index) {
		var promise = $q.defer();

		status_queue.child(kurir +'/'+ index).remove().then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	// delete entri in process list
	this.deleteProcess = function(kurir, index, akunkurir) {
		var promise = $q.defer();

		status_process.child(kurir +'/'+ akunkurir +'/'+ index).remove().then(function() {
			promise.resolve(true);
		});

		return promise.promise;
	}

	function promiseAdded(obj) {
		var promise = $q.defer();

		obj.on('child_added', function(data) {
			promise.resolve(data.val());
		}, function(err) {
			promise.reject(null);
			console.log("Serv Error fetch data");
		});

		return promise.promise;
	}

	function promiseValue(obj) {
		var promise = $q.defer();

		obj.on('value', function(data) {
			promise.resolve(data.val());
		}, function(err) {
			promise.reject(null);
			console.log("Serv Error fetch data");
		});

		return promise.promise;
	}
})

.service('BlankService', [function(){

}]);