(function () {
  'use strict';

  /** @ngInject */
  const runBlock = function ($rootScope, $trace) {
    $trace.enable('TRANSITION');
    $rootScope.pageTitle = 'Zabbix';
    $rootScope.pageClass = '';

    const stateSuccessCall = $rootScope.$on('$stateChangeSuccess', function (event, state) {
      if (angular.isUndefined(state.data)) {
        return;
      }
      $rootScope.pageTitle += (angular.isDefined(state.data.title) ? ' - ' + state.data.title : '');
      $rootScope.pageClass = angular.isDefined(state.data.class) ? state.data.class : '';
    });

    $rootScope.$on('$destroy', stateSuccessCall);
  };

  /** @ngInject */
  const configBlock = function ($uibTooltipProvider) {
    $uibTooltipProvider.options({
      appendToBody: true
    });
  };

  angular
    .module('zabbix')
    .run(runBlock)
    .config(configBlock);
})();
