/*globals angular, window */
angular.module('insider.controllers')
  .controller('InsiderCtrl', function ($state, $scope, $stateParams, InsiderService) {
    $scope.refresh = function () {
      $scope.retryWithPromise(InsiderService.findById, [$stateParams.id], 3, this)
        .then(function (insiderData) {
          $scope.insider = insiderData;
        }, function () {
          console.log("sad face");
        });
    };

    $scope.refresh();

    $scope.goToForm4 = function (form4) {
      $state.go('app.form4', {
        id: form4.id
      });
    };
 });