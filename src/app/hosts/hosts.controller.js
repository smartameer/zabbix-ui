(function () {
  'use strict';

  /** @ngInject */
  function HostsController($http, $state, $stateParams, $filter, toastr, ZABBIX_CONSTANTS) {
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
      vm.filterHosts();
    };

    vm.filterHosts = function () {
      vm.hosts = [];
      if (vm.selectedGroupId) {
        angular.forEach(vm.masterResponse, function (host) {
          angular.forEach(host.groups, function (group) {
            if (group.groupid === vm.selectedGroupId) {
              vm.hosts.push(host);
            }
          });
        });
      } else {
        vm.hosts = angular.copy(Object.values(vm.masterResponse));
      }
    };

    vm.getGroups = function (callback) {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: angular.extend({}, ZABBIX_CONSTANTS.API.HOSTGROUPS, {params: {output: ['groupid', 'name']}})
      }).then(function (response) {
        vm.groups = response.data.result;
        if (angular.isDefined($stateParams.hostgroup)) {
          const group = $filter('filter')(vm.groups, {groupid: $stateParams.hostgroup}, true);
          if (group.length <= 0 ) {
            toastr.warning('Hostgroup does not exists');
            $state.transitionTo('hostgroups', {}, {inherit: false, location: true});
            return;
          }
          vm.selectGroup(group[0]);
        }
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
        vm.filterHosts();
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
