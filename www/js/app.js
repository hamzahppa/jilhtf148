// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services', 'ngStorage', 'ngCordova', 'ionic-native-transitions'])

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
      $localStorage.token = token;

      var user = firebase.auth().currentUser;
      if (user) {
        Services.getKurirData(user.email).then(function(kurir) {
          if (kurir) {
            Services.setToken(kurir.index, token);
          }
        });
      }
      console.log('device token : '+token);
    }, function(err) {
      console.log('error get token : '+err);
    })

    window.FirebasePlugin.onTokenRefresh(function(token) {
      $localStorage.token = token;
      var user = firebase.auth().currentUser;
      if (user) {
        Services.getKurirData(user.email).then(function(kurir) {
          if (kurir) {
            Services.setToken(kurir.index, token);            
          }
        });
      }
      console.log('device token refresh : '+token);
    }, function(err) {
      console.log('err get token : '+err);
    })

    // do something if notification tapped
    window.FirebasePlugin.onNotificationOpen(function(notification) {
      // if notification received in background, on tap, it didn't open the app! how frustating

      // Check notification Body (notification from us)
      // From us, there is body attribute
      if (notification.body) {
        // Foreground, tap = false
        if (notification.tap == false) {
          $ionicPopup.alert({
            title: notification.title,
            template: notification.body,
            okText: 'OK',
            okType: 'button-balanced'
          });
        }
        // Background
        else if(notification.tap == true) {
          $ionicPopup.alert({
            title: notification.title,
            template: notification.body,
            okText: 'OK',
            okType: 'button-balanced'
          });
        }
      } else {
        // do nothing, not from us
        console.log('wild notification content :'+JSON.stringify(notification));
      }
    }, function(err) {
      console.log(err);
    })


    window.FirebasePlugin.subscribe("mangan");
  });

  $ionicPlatform.on('offline', function(){
    alert("Tidak ada internet");
  });

  // set permission on ios
  if (ionic.Platform.isIOS()) {
    window.FirebasePlugin.grantPermission();
    console.log("permission iOS granted");
  }
})

.config(function($ionicConfigProvider, $ionicNativeTransitionsProvider) {
    // $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(false);

    $ionicNativeTransitionsProvider.setDefaultOptions({
      duration: 500, // in milliseconds (ms), default 400, 
      slowdownfactor: 5, // overlap views (higher number is more) or no overlap (1), default 4 
      iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1 
      androiddelay: -1, // same as above but for Android, default -1 
      winphonedelay: -1, // same as above but for Windows Phone, default -1, 
      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android) 
      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android) 
      triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option 
      backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back 
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });
})

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