(function () {
  'use strict';

  const app = {
    templateUrl: 'app/hosts/hosts.html',
    controller: 'HostsController',
    controllerAs: 'zhc'
  };

  angular
    .module('zabbix')
    .component('hosts', app);
})();
