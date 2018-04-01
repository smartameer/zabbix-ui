(function () {
  'use strict';

  /** @ngInject */
  function HostController($http, $state, $stateParams, $filter, toastr, ZABBIX_CONSTANTS) {
    const vm = this;
    vm.title = 'Host';
    vm.host = {
      memory: 0
    };
    vm.hostItems = [];
    vm.selectedGraphName = '';
    vm.selectedGraphId = 0;

    vm.process = {
      total: 0,
      running: 0
    };

    vm.memory = {
      column: [{id: 'Memory', type: 'gauge'}],
      used: [{Memory: 0}],
      total: 0,
      available: 0
    };

    vm.cpu = {
      column: [{id: 'CPU', type: 'gauge'}],
      used: [{CPU: 0}],
      selected: 1,
      lastmin: 0,
      last5min: 0,
      last15min: 0
    };

    vm.graphTimePeriods = {
      '1h': '1 hour',
      '2h': '2 hour',
      '3h': '3 hour',
      '6h': '6 hour',
      '12h': '12 hour',
      '1d': '1 day',
      '2d': '2 days',
      '7d': '1 week',
      '14d': '2 weeks',
      '1y': '1 year'
    };

    vm.selectedTimePeriod = '1h';

    vm.selectTimePeriod = function (id) {
      vm.selectedTimePeriod = id;
    };

    if (angular.isUndefined($stateParams.id) || isNaN(parseInt($stateParams.id, 10))) {
      toastr.warning('Invalid Host');
      $state.transitionTo('hosts');
    }

    vm.selectGraph = function (graph) {
      vm.selectedGraphName = graph.name;
      vm.selectedGraphId = graph.graphid;
    };

    vm.setHostData = function () {
      const uptime = $filter('filter')(vm.hostItems, {key_: 'system.uptime'}, true)[0];
      vm.host.uptime = uptime.lastclock * 1000;

      // RAM
      const memoryTotal = $filter('filter')(vm.hostItems, {key_: 'vm.memory.size[total]'}, true)[0];
      const totalmemory = parseFloat(memoryTotal.lastvalue);
      const memoryAvailable = $filter('filter')(vm.hostItems, {key_: 'vm.memory.size[available]'}, true)[0];
      const availableMemory = parseFloat(memoryAvailable.lastvalue);
      const used = totalmemory - availableMemory;
      vm.memory.used[0].Memory = ((used / totalmemory) * 100).toFixed(2);
      vm.memory.total = (totalmemory / (1024 * 1024)).toFixed(2);
      vm.memory.available = (availableMemory / (1024 * 1024)).toFixed(2);

      // CPU
      const cpuloadLastMin = $filter('filter')(vm.hostItems, {key_: 'system.cpu.load[percpu,avg1]'}, true)[0];
      const cpuloadLast5Min = $filter('filter')(vm.hostItems, {key_: 'system.cpu.load[percpu,avg5]'}, true)[0];
      const cpuloadLast15Min = $filter('filter')(vm.hostItems, {key_: 'system.cpu.load[percpu,avg15]'}, true)[0];

      vm.cpu.used[0].CPU = parseFloat(cpuloadLastMin.lastvalue).toFixed(2);
      vm.cpu.lastmin = parseFloat(cpuloadLastMin.lastvalue).toFixed(2);
      vm.cpu.last5min = parseFloat(cpuloadLast5Min.lastvalue).toFixed(2);
      vm.cpu.last15min = parseFloat(cpuloadLast15Min.lastvalue).toFixed(2);

      // Process
      const totalProcess = $filter('filter')(vm.hostItems, {key_: 'proc.num[]'}, true)[0];
      const runningProcess = $filter('filter')(vm.hostItems, {key_: 'proc.num[,,run]'}, true)[0];

      vm.process.total = totalProcess.lastvalue;
      vm.process.running = runningProcess.lastvalue;

    };

    vm.getHostItems = function (id) {
      const data = angular.copy(ZABBIX_CONSTANTS.API.HOST_ITEMS);
      data.params.hostids = id;
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: data
      }).then(function (response) {
        if (response.data.result.length > 0) {
          vm.hostItems = response.data.result;
          vm.setHostData();
        } else {
          toastr.warning('Invalid Host');
        }
      }).catch(function () {
        toastr.error('Could not get the host details. Try again.');
      });
    };

    vm.getHost = function (id) {
      const data = angular.copy(ZABBIX_CONSTANTS.API.HOST_DETAILS);
      data.params.hostids = id;
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: data
      }).then(function (response) {
        if (response.data.result.length === 1) {
          vm.host = response.data.result[0];
          vm.title += ' - ' + vm.host.name;
          vm.selectedGraphName = vm.host.graphs[0].name;
          vm.selectedGraphId = vm.host.graphs[0].graphid;
          vm.getHostItems(id);
        } else {
          toastr.warning('Invalid Host');
          $state.transitionTo('hosts');
        }
      }).catch(function () {
        toastr.error('Could not get the host details. Try again.');
      });
    };

    vm.getHost($stateParams.id);
  }

  angular
    .module('zabbix')
    .controller('HostController', HostController);
})();
