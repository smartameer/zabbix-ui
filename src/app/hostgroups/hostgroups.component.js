(function () {
  'use strict';

  const app = {
    templateUrl: 'app/hostgroups/hostgroups.html',
    controller: 'HostGroupsController',
    controllerAs: 'zhgc'
  };

  angular
    .module('zabbix')
    .component('hostgroups', app);
})();
