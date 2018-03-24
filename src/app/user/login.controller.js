(function () {
  'use strict';

  /** @ngInject */
  function LoginController($state, $cookies, toastr, AuthService, ZABBIX_CONSTANTS) {
    const zabbixAuth = $cookies.get('zabbix-auth');
    if (ZABBIX_CONSTANTS.SECURITY.LOGGED === true && angular.isDefined(zabbixAuth)) {
      $state.transitionTo('dashboard', {}, {reload: true, inherit: false, notify: true});
      return;
    }
    var vm = this;
    vm.username = '';
    vm.password = '';

    vm.login = function () {
      AuthService.login(vm.username, vm.password)
        .then(function () {
          $state.transitionTo('dashboard', {}, {reload: true, inherit: false, notify: true});
        }, function (error) {
          vm.password = '';
          toastr.error(error.data);
          return false;
        });
    };
  }

  angular
    .module('zabbix')
    .controller('LoginController', LoginController);
})();
