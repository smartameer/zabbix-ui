(function () {
  'use strict';

  const app = {
    templateUrl: 'app/main/hello.html',
    controller: 'AppController',
    controllerAs: 'hello'
  };

  angular
    .module('zabbix')
    .component('hello', app);
})();
