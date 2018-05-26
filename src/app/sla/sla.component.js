(function () {
  'use strict';

  var app = {
    templateUrl: 'app/sla/sla.html',
    controller: 'SLAController',
    controllerAs: 'zhsc'
  };

  angular
    .module('zabbix')
    .component('sla', app);
})();
