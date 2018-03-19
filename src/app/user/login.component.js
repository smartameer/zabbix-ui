(function () {
  'use strict';

  const login = {
    templateUrl: 'app/user/login.html',
    controller: 'LoginController',
    controllerAs: 'zlc'
  };

  angular
    .module('zabbix')
    .component('login', login);
})();
