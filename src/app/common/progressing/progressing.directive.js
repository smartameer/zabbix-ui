(function () {
  'use strict';

  /* @ngInject */
  function Progressing($http, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="affix css-content-progress" data-ng-show="progressStatus" style="width: {{width}}%"><uib-progressbar class="active" type="primary" animate="true" percent="100"></uib-progressbar></div>',
      link: function ($scope) {
        $scope.loaderStatus = function () {
          return $http.pendingRequests.length > 0;
        };
        $scope.timer = null;
        $scope.$watch($scope.loaderStatus, function (loaderStatus) {
          if (loaderStatus === false) {
            $scope.width = 100;
            $timeout(function () {
              $timeout.cancel($scope.timer);
              $scope.progressStatus = loaderStatus;
              $scope.width = 0;
            }, 1200);
          } else {
            var i = 1;
            $scope.timer = $timeout(function inc() {
              if (i < 90) {
                i++;
                $scope.width = i + 1;
                $scope.timer = $timeout(inc, 20);
              } else {
                $timeout.cancel($scope.timer);
              }
            }, 100);
            $scope.progressStatus = loaderStatus;
          }
        });
      }
    };
  }

  angular
    .module('zabbix')
    .directive('progressing', Progressing);
})();
