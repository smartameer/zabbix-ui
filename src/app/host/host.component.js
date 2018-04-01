(function () {
  'use strict';

  const app = {
    templateUrl: 'app/host/host.html',
    controller: 'HostController',
    controllerAs: 'zhc'
  };

  angular
    .module('zabbix')
    .component('host', app);
})();
