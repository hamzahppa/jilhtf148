var config = {
	apiKey: "AIzaSyChy-hpkTYFmtOoctGzqriQ8iSApX4r6xc",
	authDomain: "sandbox-mangan.firebaseapp.com",
	databaseURL: "https://sandbox-mangan.firebaseio.com",
	storageBucket: "sandbox-mangan.appspot.com",
};

firebase.initializeApp(config);

var rootRef = firebase.database().ref();
var order = firebase.database().ref('dataOrder');
var status = firebase.database().ref('statusOrder');
var status_queue = firebase.database().ref('statusOrder').child('queue');
var status_process = firebase.database().ref('statusOrder').child('process');
var status_done = firebase.database().ref('statusOrder').child('done');
var status_cancel = firebase.database().ref('statusOrder').child('cancel');
var kurir = firebase.database().ref('dataKurir');

angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('Services', function($q, $localStorage) {
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
	this.getOrderProcess = function(kurir) {
		return promiseValue(
			status_process.child(kurir)
		);
	}

	// get status done
	this.getOrderDone = function(kurir) {
		return promiseValue(
			status_done.child(kurir)
		);
	}

	// get status cancel
	this.getOrderCancel = function(kurir) {
		return promiseValue(
			status_cancel.child(kurir)
		);
	}

	// get order detail
	this.getOrderDetails = function(kurir, index) {
		return promiseAdded(
			order.child(kurir).orderByChild('index').equalTo(index)
		);
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