(function () {
  'use strict';

  const app = {
    templateUrl: 'app/hosts/hosts.html',
    controller: 'HostsController',
    controllerAs: 'zhsc'
  };

  angular
    .module('zabbix')
    .component('hosts', app);
})();
