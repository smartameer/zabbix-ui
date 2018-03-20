(function () {
  'use strict';

  const app = {
    templateUrl: 'app/main/main.html',
    controller: 'MainController',
    controllerAs: 'zmc'
  };

  angular
    .module('zabbix')
    .component('main', app);
})();
