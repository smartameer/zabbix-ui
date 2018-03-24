(function () {
  'use strict';

  /** @ngInject */
  function HostGroupsController($http, ZABBIX_CONSTANTS) {
    const vm = this;
    vm.title = 'Host Groups';
    vm.hostgroups = [];

    vm.getHostGroups = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.HOSTGROUPS
      }).then(function (response) {
        vm.hostgroups = response.data.result;
      });
    };

    vm.getHostGroups();
  }

  angular
    .module('zabbix')
    .controller('HostGroupsController', HostGroupsController);
})();
