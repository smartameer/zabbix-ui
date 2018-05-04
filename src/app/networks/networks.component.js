(function () {
  'use strict';

  var app = {
    templateUrl: 'app/networks/networks.html',
    controller: 'NetworksController',
    controllerAs: 'znc'
  };

  angular
    .module('zabbix')
    .component('networks', app);
})();
