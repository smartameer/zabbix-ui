(function () {
  'use strict';

  /** @ngInject */
  const runBlock = function ($rootScope, $trace, $state, $cookies, toastr, AuthService, SERVER_CONSTANTS, ZABBIX_CONSTANTS) {
    const url = $cookies.get('zabbix-server');
    ZABBIX_CONSTANTS.BASE_URI = decodeURIComponent(url) || SERVER_CONSTANTS.BASE_URI;
    $trace.enable('TRANSITION');

    $rootScope.pageClass = '';
    const stateStartCall = $rootScope.$on('$stateChangeStart', function (event, state) {
      if ((angular.isDefined(state.data) && state.data.authentication === true) && !AuthService.isLoggedIn()) {
        event.preventDefault();
        $state.transitionTo('login', {}, {reload: true});
        return;
      }
    });

    const stateSuccessCall = $rootScope.$on('$stateChangeSuccess', function (event, state) {
      $rootScope.pageTitle = 'Zabbix';
      if (angular.isUndefined(state.data)) {
        return;
      }
      $rootScope.pageTitle += (angular.isDefined(state.data.title) ? ' - ' + state.data.title : '');
      $rootScope.pageClass = angular.isDefined(state.data.class) ? state.data.class : '';
    });

    $rootScope.$on('$destroy', stateStartCall);
    $rootScope.$on('$destroy', stateSuccessCall);
    if (!url) {
      $cookies.remove('zabbix-auth');
      $state.transitionTo('login', {}, {inherit: false, location: true});
      return;
    }
    AuthService.init();
  };

  /** @ngInject */
  const configBlock = function ($httpProvider, $uibTooltipProvider, toastrConfig) {
    $httpProvider.interceptors.push('TokenInterceptor');
    $uibTooltipProvider.options({
      appendToBody: true
    });
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 60000;
    toastrConfig.positionClass = 'toast-bottom-center';
    toastrConfig.autoDismiss = false;
    toastrConfig.tapToDismiss = false;
    toastrConfig.closeButton = true;
    toastrConfig.closeHtml = '<button class="btn btn-inverse btn-sm text-uppercase">Close</button>';
  };

  angular
    .module('zabbix')
    .run(runBlock)
    .config(configBlock);
})();
