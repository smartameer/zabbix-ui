(function () {
  'use strict';

  /** @ngInject */
  function LoginController($state, $timeout) {
    var vm = this;

    vm.username = '';
    vm.password = '';

    vm.login = function () {
      $timeout(function () {
        $state.go('home', {inherit: false, location: true});
      }, 1000);
    };
  }

  angular
    .module('zabbix')
    .controller('LoginController', LoginController);
})();
