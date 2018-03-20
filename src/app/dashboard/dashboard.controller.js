(function () {
  'use strict';

  /** @ngInject */
  function DashboardController() {
    const vm = this;
    vm.title = 'Dashboard';
  }

  angular
    .module('zabbix')
    .controller('DashboardController', DashboardController);
})();
