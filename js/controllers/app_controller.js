/*globals angular, window */
angular.module('insider.controllers', [])
  .controller('AppCtrl', function ($timeout, $ionicLoading, $q, $scope, $ionicModal, $rootScope, AuthService) {
    $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.logout = function () {
      AuthService.doLogout().then(function () {
        $rootScope.$broadcast("authchange");
      });
    };

    $scope.loggedIn = function () {
      return AuthService.loggedIn();
    };

    $scope.doLogin = function () {
      AuthService.doLogin($scope.loginData, $rootScope.deviceToken)
        .then(function () {
          $rootScope.$broadcast('authchange');
          $scope.closeLogin();
        }, function (data) {
          if (data.message) {
            window.alert(data.message);
          } else {
            window.alert("Something went wrong with your login. Try again.");
          }
        });
    };

    $scope.retryWithPromise = function (promise, args, maxTries, context, deferred) {
      deferred = deferred || $q.defer();
      context = context || null;

      $scope.loading = true;
      $ionicLoading.show({
        template: "<i class='ion-loading-d'></i>"
      });

      promise.apply(context, args)
        .then(function (d) {
          $scope.loading = false;
          $ionicLoading.hide();
          return deferred.resolve(d);
        }, function (err) {
          if (maxTries === -1) {
            console.log("giving up...");
            $ionicLoading.hide();
            return deferred.reject(err);
          }
          $timeout(function() {
            $scope.retryWithPromise(promise, args, maxTries - 1, context, deferred);
          }, 2000);
        });
      return deferred.promise;
    };
  });