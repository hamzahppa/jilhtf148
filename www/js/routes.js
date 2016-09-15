angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController.order', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/order.html',
        controller: 'orderCtrl'
      }
    }
  })

  .state('tabsController.proses', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/proses.html',
        controller: 'prosesCtrl'
      }
    }
  })

  .state('tabsController.riwayat', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/riwayat.html',
        controller: 'riwayatCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.transaksi'
      2) Using $state.go programatically:
        $state.go('tabsController.transaksi');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab1/page6
      /page1/tab2/page6
      /page1/tab3/page6
  */
  .state('tabsController.transaksi', {
    url: '/page6',
    views: {
      'tab1': {
        templateUrl: 'templates/transaksi.html',
        controller: 'transaksiCtrl'
      },
      'tab2': {
        templateUrl: 'templates/transaksi.html',
        controller: 'transaksiCtrl'
      },
      'tab3': {
        templateUrl: 'templates/transaksi.html',
        controller: 'transaksiCtrl'
      }
    }
  })

  .state('ditolak', {
    url: '/page7',
    templateUrl: 'templates/ditolak.html',
    controller: 'ditolakCtrl'
  })

$urlRouterProvider.otherwise('/page5')

  

});