(function () {
  'use strict';

  var app = {
    templateUrl: 'app/dashboard/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'zdc'
  };

  angular
    .module('zabbix')
    .component('dashboard', app);
})();
