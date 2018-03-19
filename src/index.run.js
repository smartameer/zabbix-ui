(function () {
  'use strict';

  /** @ngInject */
  const runBlock = function ($rootScope, $trace) {
    $trace.enable('TRANSITION');
    $rootScope.pageTitle = 'Zabbix';
    $rootScope.pageClass = 'login-body';

    const stateSuccessCall = $rootScope.$on('$stateChangeSuccess', function (event, state) {
      $rootScope.pageTitle += (angular.isDefined(state.data.title) ? ' - ' + state.data.title : '');
      $rootScope.pageClass += angular.isDefined(state.data.class) ? state.data.class : '';
    });

    $rootScope.$on('$destroy', stateSuccessCall);
  };

  angular
    .module('zabbix')
    .run(runBlock);
})();
