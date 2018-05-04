(function () {
  'use strict';

  /** @ngInject */
  function NetworksController($http, $state, $stateParams, $filter, toastr, ZABBIX_CONSTANTS) {
    var vm = this;
    vm.title = 'Networks';
    vm.networks = [];

    vm.getNetworks = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.HOSTS
      }).then(function (response) {
        vm.networks = response.data.result;
      });
    };

    vm.getNetworks();
  }

  angular
    .module('zabbix')
    .controller('NetworksController', NetworksController);
})();
