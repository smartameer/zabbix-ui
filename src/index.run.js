(function () {
  'use strict';

  /** @ngInject */
  const runBlock = function ($rootScope, $trace, $state, AuthService) {
    $trace.enable('TRANSITION');
    $rootScope.pageTitle = 'Zabbix';
    $rootScope.pageClass = '';
    AuthService.init();

    const stateStartCall = $rootScope.$on('$stateChangeStart', function (event, state) {
      if ((angular.isDefined(state.data) && state.data.authentication === true) && !AuthService.isLoggedIn()){
        event.preventDefault();
        $state.transitionTo('login', {}, {reload: true});
        return;
      }
    });

    const stateSuccessCall = $rootScope.$on('$stateChangeSuccess', function (event, state) {
      if (angular.isUndefined(state.data)) {
        return;
      }
      $rootScope.pageTitle += (angular.isDefined(state.data.title) ? ' - ' + state.data.title : '');
      $rootScope.pageClass = angular.isDefined(state.data.class) ? state.data.class : '';
    });

    $rootScope.$on('$destroy', stateStartCall);
    $rootScope.$on('$destroy', stateSuccessCall);
  };

  /** @ngInject */
  const configBlock = function ($httpProvider, $uibTooltipProvider, toastrConfig) {
    $httpProvider.interceptors.push('TokenInterceptor');
    $uibTooltipProvider.options({
      appendToBody: true
    });
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-bottom-center';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  };

  const constants = {
    BASE_URI: 'http://localhost/api_jsonrpc.php',
    SECURITY: {
      LOGGED: false,
      TOKEN: ''
    },
    API: {
      LOGIN: {
        method: 'user.login',
        auth: null,
        id: 0
      },
      HOSTGROUPS: {
        method: 'hostgroup.get',
        params: {
          output: 'extend',
          sortfield: 'name'
        }
      }
    }
  };

  angular
    .module('zabbix')
    .run(runBlock)
    .config(configBlock)
    .constant('ZABBIX_CONSTANTS', constants);
})();
