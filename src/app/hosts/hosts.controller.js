(function () {
  'use strict';

  /** @ngInject */
  function HostsController() {
    const vm = this;
    vm.title = 'Hosts';
  }

  angular
    .module('zabbix')
    .controller('HostsController', HostsController);
})();
