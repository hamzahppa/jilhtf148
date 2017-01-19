// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform, $state, $ionicPopup, Services, $localStorage) {
  $ionicPlatform.ready(function($state) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // listen to firebase push notification
    window.FirebasePlugin.getToken(function(token) {
      console.log('device token : '+token);
    }, function(err) {
      console.log('error get token : '+err);
    })

    window.FirebasePlugin.onTokenRefresh(function(token) {
      console.log('device token refresh : '+token);
    }, function(err) {
      console.log('err get token : '+err);
    })

    // do something if notification tapped
    window.FirebasePlugin.onNotificationOpen(function(notification) {
      console.log('tapped');
      alert("Order Baru");
    }, function(err) {
      console.log(err);
    })

    window.FirebasePlugin.subscribe("mangan");
  });

  // set permission on ios
  if (ionic.Platform.isIOS()) {
    window.FirebasePlugin.grantPermission();
    console.log("permission iOS granted");
  }
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    // $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('center');
}])

// http://justinklemm.com/angularjs-filter-ordering-objects-ngrepeat/
.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      // console.log(field);
      // console.log(items);
      // console.log(reverse);
      // console.log('wwwwww');
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a,b) {
        // console.log(a[field] +"|"+ b[field] + "|"+ a[field]>b[field]);
        return (a[field] > b[field] ? 1: -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
});