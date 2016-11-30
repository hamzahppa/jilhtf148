// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function($state) {
    // set permission on ios
    if (device.platform == "iOs") {
      window.FirebasePlugin.grantPermission();
    }
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
      // should save token to firebase
    }, function(err) {
      console.log('error get token : '+err);
    })

    // do something if notification tapped
    window.FirebasePlugin.onNotificationOpen(function(notification) {
      console.log('tapped');
      $state.go('tabsController.order');
    }, function(err) {
      console.log(err);
    })
  });
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    // $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('center');
}])