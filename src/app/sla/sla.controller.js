(function () {
  'use strict';

  /** @ngInject */
  function SLAController($http, ZABBIX_CONSTANTS) {
    var vm = this;
    vm.title = 'SLA';
    vm.services = [];

    vm.getServices = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.SERVICES
      }).then(function (response) {
        vm.services = response.data.result;
      });
    };

    vm.getServices();
  }

  angular
    .module('zabbix')
    .controller('SLAController', SLAController);
})();
