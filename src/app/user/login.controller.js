(function () {
  'use strict';

  /** @ngInject */
  function LoginController($state, $cookies, $http, toastr, AuthService, ZABBIX_CONSTANTS) {
    const zabbixAuth = $cookies.get('zabbix-auth');
    if (ZABBIX_CONSTANTS.SECURITY.LOGGED === true && angular.isDefined(zabbixAuth)) {
      $state.transitionTo('dashboard', {}, {reload: true, inherit: false, notify: true});
      return;
    }
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.server = ZABBIX_CONSTANTS.BASE_URI;

    vm.login = function () {
      if (vm.server.trim() === '') {
        toastr.warning('Invalid Zabbix Endpoint');
        return;
      }

      $http({
        url: vm.server,
        data: ZABBIX_CONSTANTS.API.VERSION
      }).then(function () {
        ZABBIX_CONSTANTS.BASE_URI = vm.server;
        $cookies.put('zabbix-server', vm.server);
        $cookies.put('zabbix-username', btoa(vm.username));
        $cookies.put('zabbix-password', btoa(vm.password));
        $cookies.put('zabbix-server', vm.server);
        AuthService.login(vm.username, vm.password)
          .then(function () {
            let uri = ZABBIX_CONSTANTS.BASE_URI.split('/');
            uri = uri.slice(0, uri.length - 1);
            uri.push('chart2.php');
            ZABBIX_CONSTANTS.CHART_URI = uri.join('/');
            toastr.info('Welcome to Zabbix');
            $state.transitionTo('dashboard', {}, {reload: true, inherit: false, notify: true});
          }, function (error) {
            vm.password = '';
            toastr.error(error.data);
            return false;
          });
      }).catch(function () {
        toastr.warning('Invalid Zabbix Endpoint');
      });
    };
  }

  angular
    .module('zabbix')
    .controller('LoginController', LoginController);
})();
