(function () {
  'use strict';

  /** @ngInject */
  function DashboardController($http, $filter, ZABBIX_CONSTANTS) {
    const vm = this;
    vm.title = 'Dashboard';
    vm.problems = [];
    vm.unknowns = [];
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
      } else if (type === 'information') {
        vm.triggers = angular.copy(vm.informations);
      } else {
        vm.triggers = angular.copy(vm.masterTriggers);
      }
    };

    vm.convDate = function (timestamp) {
      const d = new Date(timestamp * 1000);
      return $filter('date')(d, 'MM/dd/yy hh:mm');
    };

    vm.agoFormat = function (lastchange) {
      const SECOND_MILLISECOND = 1000;
      const MINUTE_MILLISECOND = 60 * SECOND_MILLISECOND;
      const HOUR_MILLISECOND = 60 * MINUTE_MILLISECOND;
      const DAY_MILLISECOND = 24 * HOUR_MILLISECOND;

      const nowUtime = new Date().getTime();
      const diffTime = nowUtime - (lastchange * 1000);
      const deltaDay = Math.floor(diffTime / DAY_MILLISECOND);
      const diffDay = diffTime - (deltaDay * DAY_MILLISECOND);
      const deltaHour = Math.floor(diffDay / HOUR_MILLISECOND);
      const diffHour = diffDay - (deltaHour * HOUR_MILLISECOND);
      const deltaMin = Math.floor(diffHour / MINUTE_MILLISECOND);
      const diffMin = diffHour - (deltaMin * MINUTE_MILLISECOND);
      const deltaSec = Math.floor(diffMin / SECOND_MILLISECOND);

      let deltaDate = '';
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

    vm.getTriggersList();
  }

  angular
    .module('zabbix')
    .controller('DashboardController', DashboardController);
})();
