angular.module('insider.services', [])
  .factory('authHttpResponseInterceptor', ['$q', '$location',
    function ($q, $location) {
      return {
        responseError: function (rejection) {
          if (rejection.status === 401) {
            $location.path('/login');
            return $q.reject(rejection);
          }
          if (rejection.status === 403) {
            $location.path('/subscribe');
            return $q.reject(rejection);
          }
          return $q.reject(rejection);
        }
      };
    }
  ]);
