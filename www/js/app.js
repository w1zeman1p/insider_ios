/*global window, cordova, angular */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('insider', ['ionic', 'insider.controllers', 'ngCordova']);
app.run(function ($ionicPlatform, $cordovaPush, $rootScope) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var iosConfig = {
      "badge":"true",
      "sound":"true",
      "alert":"true",
      "ecb":"onNotificationAPN"
    };

    $cordovaPush.register(iosConfig).then(function(result) {
      $rootScope.deviceToken = result;
    }, function(err) {
      console.log("not able to send push");
    });
  });
});
//app.config.apiBase = 'http://localhost:3000';
app.config.apiBase = 'https://insiderai.com';
app.service('ideasService', function ($http, $q) {
  function handleError(response) {
    if (!angular.isObject(response.data) || !response.data.message) {
      return $q.reject("An unknown error occurred.");
    }
    return $q.reject(response.data.message);
  }

  function handleSuccess(response) {
    return response.data;
  }

  function getIdeas() {

    var request = $http({
      method: 'GET',
      url: app.config.apiBase + '/api/v1/buys.json',
      params: {
        action: 'GET'
      }
    });
    return request.then(handleSuccess, handleError);
  }

  return {
    getIdeas: getIdeas
  };
});
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.buys', {
      url: '/buys',
      views: {
        'menuContent': {
          templateUrl: 'templates/buys.html',
          controller: 'BuysCtrl'
        }
      }
    })
    .state('app.today', {
      url: '/today',
      views: {
        'menuContent': {
          templateUrl: 'templates/today.html',
          controller: 'TodaysBuysCtrl'
        }
      }
    })
    .state('app.trade', {
      url: '/trades/:tradeId',
      views: {
        'menuContent': {
          templateUrl: 'templates/trade.html',
          controller: 'TradeCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/buys');
});
