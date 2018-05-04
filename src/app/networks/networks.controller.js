(function () {
  'use strict';

  /** @ngInject */
  function NetworksController($http, ZABBIX_CONSTANTS) {
    var vm = this;
    vm.title = 'Networks';
    vm.networks = [];
    vm.chartUri = '';
    vm.selectedNetwork = null;

    vm.showMap = function (index) {
      vm.selectedNetwork = vm.networks[index];
      vm.chartUri = ZABBIX_CONSTANTS.MAP_CHART_URI + '?sysmapid=' + vm.selectedNetwork.sysmapid + '&t=' + new Date().getTime();
    };

    vm.getNetworks = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.MAPS
      }).then(function (response) {
        vm.networks = response.data.result;
        vm.showMap(0);
      });
    };

    vm.getNetworks();
  }

  angular
    .module('zabbix')
    .controller('NetworksController', NetworksController);
})();
