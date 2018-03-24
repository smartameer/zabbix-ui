(function () {
  'use strict';

  /** @ngInject */
  function HostsController($http, $filter, ZABBIX_CONSTANTS) {
    const vm = this;
    vm.title = 'Hosts';
    vm.hosts = {};
    vm.selectedGroupId = false;
    vm.selectedGroupName = 'All';
    vm.groups = [];
    vm.masterResponse = [];

    vm.selectGroup = function (group) {
      if (angular.isUndefined(group)) {
        vm.selectedGroupId = false;
        vm.selectedGroupName = 'All';
        vm.hosts = angular.copy(Object.values(vm.masterResponse));
        return;
      }

      vm.selectedGroupId = group.groupid;
      vm.selectedGroupName = group.name;
      vm.hosts = [];
      angular.forEach(vm.masterResponse, function (host) {
        angular.forEach(host.groups, function (group) {
          if (group.groupid === vm.selectedGroupId) {
            vm.hosts.push(host);
          }
        });
      });
    };

    vm.getGroups = function (callback) {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: angular.extend({}, ZABBIX_CONSTANTS.API.HOSTGROUPS, {params: {output: ['groupid', 'name']}})
      }).then(function (response) {
        vm.groups = response.data.result;
        if (angular.isDefined(callback)) {
          callback();
        }
      });
    };

    vm.getHosts = function (callback) {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.HOSTS
      }).then(function (response) {
        vm.masterResponse = response.data.result;
        vm.hosts = angular.copy(Object.values(vm.masterResponse));
        if (angular.isDefined(callback)) {
          callback();
        }
      });
    };

    vm.getGroups(vm.getHosts);
  }

  angular
    .module('zabbix')
    .controller('HostsController', HostsController);
})();
