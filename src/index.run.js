(function () {
  'use strict';

  /** @ngInject */
  const runBlock = function ($rootScope, $state, $stateParams, $urlRouter) {
    $rootScope.pageTitle = 'Zabbix';
    const stateSuccessCall = $rootScope.$on('$stateChangeSuccess', function (event, state) {
      $rootScope.pageTitle += (angular.isDefined(state.data.title) ? ' - ' + state.data.title : '');
      $urlRouter.sync();
    });

    $rootScope.$on('$destroy', stateSuccessCall);
  };

  angular
    .module('zabbix')
    .run(runBlock);
})();
