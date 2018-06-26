(function () {
  'use strict';

  /** @ngInject */
  function SLAController($http, $filter, $timeout, ZABBIX_CONSTANTS) {
    var vm = this;
    vm.title = 'SLA Health Status';
    vm.sladetails = [];
    vm.tree = [];
    vm.pushed = [];

    var recursiveSet = function (data, parent) {
      angular.forEach(data, function (dep) {
        var sladetails = $filter('filter')(vm.sladetails, {serviceid: dep.serviceid}, true);
        if (sladetails.length > 0) {
          var service = sladetails[0];
          if (angular.isDefined(service.dependencies) && service.dependencies.length > 0) {
            service.open = false;
            service.children = [];
            recursiveSet(service.dependencies, service.children);
          }
          $timeout(function () {
            vm.pushed.push(service.serviceid);
            parent.push(service);
          }, 0);
        }
      });
    };

    vm.processSla = function (data, parent) {
      angular.forEach(data, function (obj) {
        if (obj.triggerid === '0') {
          if (angular.isDefined(obj.dependencies) && obj.dependencies.length > 0) {
            obj.open = true;
            obj.children = [];
            recursiveSet(obj.dependencies, obj.children);
          }
          $timeout(function () {
            vm.pushed.push(obj.serviceid);
            parent.push(obj);
          }, 0);
        }
      });

      $timeout(function () {
        angular.forEach(data, function (obj) {
          if (vm.pushed.indexOf(obj.serviceid) < 0) {
            parent.push(obj);
          }
        });
      }, 100);
    };

    vm.getServices = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.SERVICES
      }).then(function (response) {
        vm.sladetails = response.data.result;
        vm.processSla(vm.sladetails, vm.tree);
      });
    };

    vm.getServices();
  }

  angular
    .module('zabbix')
    .controller('SLAController', SLAController);
})();
