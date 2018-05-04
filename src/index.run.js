(function () {
  'use strict';

  /** @ngInject */
  var runBlock = function ($rootScope, $trace, $state, $cookies, toastr, AuthService, SERVER_CONSTANTS, ZABBIX_CONSTANTS) {
    var url = $cookies.get('zabbix-server');
    ZABBIX_CONSTANTS.BASE_URI = (angular.isDefined(url) && decodeURIComponent(url)) || SERVER_CONSTANTS.BASE_URI;

    var uri = ZABBIX_CONSTANTS.BASE_URI.split('/');
    uri = uri.slice(0, uri.length - 1);
    uri.push('chart2.php');
    ZABBIX_CONSTANTS.CHART_URI = uri.join('/');
    uri.pop();
    uri.push('chart.php');
    ZABBIX_CONSTANTS.ITEM_CHART_URI = uri.join('/');
    uri.pop();
    uri.push('map.php');
    ZABBIX_CONSTANTS.MAP_CHART_URI = uri.join('/');

    $trace.enable('TRANSITION');

    $rootScope.pageClass = '';
    var stateStartCall = $rootScope.$on('$stateChangeStart', function (event, state) {
      if ((angular.isDefined(state.data) && state.data.authentication === true) && !AuthService.isLoggedIn()) {
        event.preventDefault();
        $state.transitionTo('login', {}, {reload: true});
        return;
      }
    });

    var stateSuccessCall = $rootScope.$on('$stateChangeSuccess', function (event, state) {
      $rootScope.pageTitle = 'Radon';
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
  var configBlock = function ($httpProvider, $uibTooltipProvider, toastrConfig) {
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
