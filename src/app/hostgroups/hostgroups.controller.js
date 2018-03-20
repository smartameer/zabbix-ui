(function () {
  'use strict';

  /** @ngInject */
  function HostGroupsController() {
    const vm = this;
    vm.title = 'HostGroups';
  }

  angular
    .module('zabbix')
    .controller('HostGroupsController', HostGroupsController);
})();
