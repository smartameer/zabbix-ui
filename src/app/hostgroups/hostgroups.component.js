(function () {
  'use strict';

  var app = {
    templateUrl: 'app/hostgroups/hostgroups.html',
    controller: 'HostGroupsController',
    controllerAs: 'zhgc'
  };

  angular
    .module('zabbix')
    .component('hostgroups', app);
})();
