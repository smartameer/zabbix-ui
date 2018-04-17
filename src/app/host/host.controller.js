(function () {
  'use strict';

  /** @ngInject */
  function HostController($http, $state, $stateParams, $filter, $timeout, $interval, toastr, ZABBIX_CONSTANTS) {
    var vm = this;
    vm.keys = Object.keys;
    vm.title = 'Host';
    vm.host = {
      memory: 0
    };
    vm.hostItems = [];
    vm.selectedGraphName = '';
    vm.selectedGraphId = 0;
    vm.selectedTimePeriod = 1 * 60 * 60;
    vm.refreshType = 0;
    vm.graphData = '';
    vm.interval = 0;

    vm.selectedItemGraphId = 0;
    vm.selectedItemGraphName = '';
    vm.selectedItemTimePeriod = 1 * 60 * 60;
    vm.itemRefreshType = 0;
    vm.itemGraphData = '';
    vm.itemInterval = 0;

    vm.activeApplication = 0;
    vm.applications = [];
    vm.disks = {};

    vm.process = {
      running: 0
    };

    vm.memory = {
      column: [{id: 'Memory', type: 'gauge'}],
      used: [{Memory: 0}],
      total: 0,
      free: 0
    };

    vm.cpu = {
      column: [{id: 'CPU', type: 'gauge'}],
      used: [{CPU: 0}],
      selected: 1,
      lastmin: 0,
      last5min: 0,
      last15min: 0
    };

    vm.getGraph = function () {
      var params = 'period=' + vm.selectedTimePeriod + '&height=200&graphid=' + vm.selectedGraphId + '&t=' + new Date().getTime();
      vm.graphData = ZABBIX_CONSTANTS.CHART_URI + '?' + params;
    };

    var bytesToSize = function (bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) {
        return '0 Byte';
      }
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    vm.changeRefresh = function () {
      $timeout(function () {
        if (vm.refreshType === 1) {
          vm.interval = $interval(function () {
            vm.getGraph();
          }, 10000);
        } else {
          $interval.cancel(vm.interval);
        }
      }, 10);
    };

    vm.graphTimePeriods = [
      {label: '1 hour', value: 1 * 60 * 60},
      {label: '2 hours', value: 2 * 60 * 60},
      {label: '3 hours', value: 3 * 60 * 60},
      {label: '6 hours', value: 6 * 60 * 60},
      {label: '12 hours', value: 12 * 60 * 60},
      {label: '1 day', value: 24 * 60 * 60},
      {label: '2 days', value: 2 * 24 * 60 * 60},
      {label: '1 week', value: 7 * 24 * 60 * 60},
      {label: '2 weeks', value: 14 * 24 * 60 * 60},
      {label: '1 month', value: 30 * 24 * 60 * 60},
      {label: '3 months', value: 3 * 30 * 24 * 60 * 60},
      {label: '6 months', value: 6 * 30 * 24 * 60 * 60}
    ];

    vm.selectTimePeriod = function (item) {
      vm.selectedTimePeriod = item.value;
      vm.getGraph();
    };

    if (angular.isUndefined($stateParams.id) || isNaN(parseInt($stateParams.id, 10))) {
      toastr.warning('Invalid Host');
      $state.transitionTo('hosts');
    }

    vm.selectGraph = function (graph) {
      vm.selectedGraphName = graph.name;
      vm.selectedGraphId = graph.graphid;
      vm.getGraph();
    };

    vm.changeItemRefresh = function () {
      $timeout(function () {
        if (vm.itemRefreshType === 1) {
          vm.itemInterval = $interval(function () {
            vm.refreshItemGraph();
          }, 10000);
        } else {
          $interval.cancel(vm.itemInterval);
        }
      }, 10);
    };

    vm.selectItemGraph = function (item) {
      vm.unselectItemGraph();
      vm.selectedItemGraphId = item.itemid;
      vm.selectedItemGraphName = item.name;
      vm.refreshItemGraph();
      $timeout(function () {
        angular.element(document).find('body')[0].scrollTop = angular.element(document).find('body')[0].scrollHeight;
      }, 300);
    };

    vm.unselectItemGraph = function () {
      vm.selectedItemGraphId = 0;
      vm.selectedItemGraphName = '';
      vm.itemGraphData = '';
      vm.itemRefreshType = 0;
      vm.selectedItemTimePeriod = 1 * 60 * 60;
      $interval.cancel(vm.itemInterval);
    };

    vm.selectItemTimePeriod = function (item) {
      vm.selectedItemTimePeriod = item.value;
      vm.refreshItemGraph();
    };

    vm.refreshItemGraph = function () {
      var params = 'period=' + vm.selectedItemTimePeriod + '&height=200&itemids=' + vm.selectedItemGraphId + '&t=' + new Date().getTime();
      vm.itemGraphData = ZABBIX_CONSTANTS.ITEM_CHART_URI + '?' + params;
    };

    vm.setHostData = function () {
      // RAM
      var memoryTotal = $filter('filter')(vm.hostItems, {key_: 'vm.memory.size[total]'}, true)[0];
      var totalmemory = parseFloat(memoryTotal.lastvalue);
      var memoryFree = $filter('filter')(vm.hostItems, {key_: 'vm.memory.size[free]'}, true);
      if (memoryFree.length <= 0) {
        memoryFree = $filter('filter')(vm.hostItems, {key_: 'vm.memory.size[available]'}, true);
        if (memoryFree.length <= 0) {
          memoryFree = $filter('filter')(vm.hostItems, {key_: 'vm.memory.size[pavailable]'}, true);
        }
      }
      var freeMemory = parseFloat(memoryFree[0].lastvalue);
      var used = totalmemory - freeMemory;
      vm.memory.used[0].Memory = ((used / totalmemory) * 100).toFixed(2);
      vm.memory.total = (totalmemory / (1024 * 1024)).toFixed(2);
      vm.memory.free = (freeMemory / (1024 * 1024)).toFixed(2);

      angular.forEach(vm.hostItems, function (item) {
        // UP time
        if (item.key_ === 'system.uptime') {
          vm.host.uptime = item.lastclock * 1000;
        }

        // CPU
        if (item.key_ === 'system.cpu.load[percpu,avg1]') {
          vm.cpu.used[0].CPU = parseFloat(item.lastvalue).toFixed(2);
          vm.cpu.lastmin = parseFloat(item.lastvalue).toFixed(2);
        }
        if (item.key_ === 'system.cpu.load[percpu,avg5]') {
          vm.cpu.last5min = parseFloat(item.lastvalue).toFixed(2);
        }
        if (item.key_ === 'system.cpu.load[percpu,avg15]') {
          vm.cpu.last15min = parseFloat(item.lastvalue).toFixed(2);
        }

        // Process
        if (item.key_ === 'proc.num[]') {
          vm.process.running = item.lastvalue;
        }

        // Disks
        if (/vfs.fs.size\[.*,.*\]/.test(item.key_)) {
          var match = item.key_.match(/vfs.fs.size\[(.*),(.*)\]/);
          if (match.length > 1 && angular.isUndefined(vm.disks[match[1]])) {
            vm.disks[match[1]] = {
              total: 0,
              used: 0
            };
          }
          if (match.length > 2 && match[2] === 'total') {
            vm.disks[match[1]].total = item.lastvalue;
          }
          if (match.length > 2 && match[2] === 'used') {
            vm.disks[match[1]].used = bytesToSize(item.lastvalue);
            vm.disks[match[1]].usedPercent = Math.ceil((item.lastvalue * 100) / vm.disks[match[1]].total);
            vm.disks[match[1]].total = bytesToSize(vm.disks[match[1]].total);
          }
          if (match.length > 2 && match[2] === 'free') {
            vm.disks[match[1]].free = bytesToSize(item.lastvalue);
          }
        }
      });
    };

    vm.getHostItems = function (id) {
      var data = angular.copy(ZABBIX_CONSTANTS.API.HOST_ITEMS);
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

    vm.getApplications = function (id) {
      var data = angular.copy(ZABBIX_CONSTANTS.API.APPLICATIONS);
      data.params.hostids = id;
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: data
      }).then(function (response) {
        if (response.data.result.length > 0) {
          vm.applications = response.data.result;
        } else {
          toastr.warning('Invalid Host');
        }
      }).catch(function () {
        toastr.error('Could not get the application details. Try again.');
      });
    };

    vm.getHost = function (id) {
      var data = angular.copy(ZABBIX_CONSTANTS.API.HOST_DETAILS);
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
          vm.getApplications(id);
          vm.getGraph();
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
