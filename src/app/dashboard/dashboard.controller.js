(function () {
  'use strict';

  /** @ngInject */
  function DashboardController($http, $filter, $window, ZABBIX_CONSTANTS) {
    var vm = this;
    vm.title = 'Dashboard';
    vm.problems = [];
    vm.unknowns = [];
    vm.processes = {};
    vm.informations = [];
    vm.problemCount = 0;
    vm.unknownCount = 0;
    vm.informationCount = 0;
    vm.triggers = [];
    vm.masterTriggers = [];
    vm.activeType = '';

    vm.selectActiveType = function (type) {
      vm.activeType = type || '';
      if (type === 'alert') {
        vm.triggers = angular.copy(vm.problems);
      } else if (type === 'warning') {
        vm.triggers = angular.copy(vm.unknowns);
      } else if (type === 'info') {
        vm.triggers = angular.copy(vm.informations);
      } else {
        vm.triggers = angular.copy(vm.masterTriggers);
      }
    };

    vm.convDate = function (timestamp) {
      var d = new Date(timestamp * 1000);
      return $filter('date')(d, 'MM/dd/yy hh:mm');
    };

    vm.agoFormat = function (lastchange) {
      var SECOND_MILLISECOND = 1000;
      var MINUTE_MILLISECOND = 60 * SECOND_MILLISECOND;
      var HOUR_MILLISECOND = 60 * MINUTE_MILLISECOND;
      var DAY_MILLISECOND = 24 * HOUR_MILLISECOND;

      var nowUtime = new Date().getTime();
      var diffTime = nowUtime - (lastchange * 1000);
      var deltaDay = Math.floor(diffTime / DAY_MILLISECOND);
      var diffDay = diffTime - (deltaDay * DAY_MILLISECOND);
      var deltaHour = Math.floor(diffDay / HOUR_MILLISECOND);
      var diffHour = diffDay - (deltaHour * HOUR_MILLISECOND);
      var deltaMin = Math.floor(diffHour / MINUTE_MILLISECOND);
      var diffMin = diffHour - (deltaMin * MINUTE_MILLISECOND);
      var deltaSec = Math.floor(diffMin / SECOND_MILLISECOND);

      var deltaDate = '';
      if (deltaDay !== 0) {
        deltaDate += deltaDay + 'd ';
      }
      if (deltaHour !== 0) {
        deltaDate += deltaHour + 'h ';
      }
      if (deltaMin !== 0) {
        deltaDate += deltaMin + 'm ';
      }
      if (deltaSec !== 0 && deltaDay === 0) {
        deltaDate += deltaSec + 's ';
      }

      return deltaDate + 'ago';
    };

    vm.getTriggersList = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.TRIGGERS
      }).then(function (response) {
        vm.masterTriggers = response.data.result;
        angular.forEach(vm.masterTriggers, function (trigger) {
          if (parseInt(trigger.priority, 10) === 4 || parseInt(trigger.priority, 10) === 5) {
            vm.problems.push(trigger);
            if (parseInt(trigger.lastEvent.acknowledged, 10) === 0) {
              vm.problemCount += 1;
            }
          }
          if (parseInt(trigger.priority, 10) === 2 || parseInt(trigger.priority, 10) === 3) {
            vm.unknowns.push(trigger);
            if (parseInt(trigger.lastEvent.acknowledged, 10) === 0) {
              vm.unknownCount += 1;
            }
          }
          if (parseInt(trigger.priority, 10) === 0 || parseInt(trigger.priority, 10) === 1) {
            vm.informations.push(trigger);
            if (parseInt(trigger.lastEvent.acknowledged, 10) === 0) {
              vm.informationCount += 1;
            }
          }
        });
        vm.selectActiveType();
      });
    };

    vm.getProcessesList = function() {
      angular.forEach($window.localStorage, function(value, key) {
        if (key.match('zabbix-processes-') !== null) {
          var hostid = key.split('zabbix-processes-')[1];
          if (angular.isUndefined(vm.processes[hostid])) {
            vm.processes[hostid] = {};
          }
          vm.processes[hostid].processes = angular.fromJson(value);
        }
        if (key.match('zabbix-processid-') !== null) {
          var hostid = key.split('zabbix-processid-')[1];
          if (angular.isUndefined(vm.processes[hostid])) {
            vm.processes[hostid] = {};
          }
          vm.processes[hostid].details = angular.fromJson(value);
        }
      });
    };

    vm.getProcessesList();
    vm.getTriggersList();
  }

  angular
    .module('zabbix')
    .controller('DashboardController', DashboardController);
})();
