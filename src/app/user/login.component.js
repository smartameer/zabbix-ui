(function () {
  'use strict';

  var login = {
    templateUrl: 'app/user/login.html',
    controller: 'LoginController',
    controllerAs: 'zlc'
  };

  angular
    .module('zabbix')
    .component('login', login);
})();
