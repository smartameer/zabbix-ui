(function () {
  'use strict';

  /** @ngInject */
  function LoginController($state, $timeout, $cookies) {
    var vm = this;

    vm.username = '';
    vm.password = '';

    vm.login = function () {
      $cookies.putObject('session', {username: vm.username, password: vm.password});
      $timeout(function () {
        $state.go('dashboard', {inherit: false, location: true});
      }, 1000);
    };

    const session = $cookies.getObject('session');
    if (angular.isObject(session)) {
      $state.go('dashboard', {inherit: false, location: true});
    }
  }

  angular
    .module('zabbix')
    .controller('LoginController', LoginController);
})();
