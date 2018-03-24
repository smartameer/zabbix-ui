(function () {
  'use strict';

  angular
    .module('zabbix', [
      'ui.router',
      'ui.router.state.events',
      'ui.bootstrap',
      'toastr',
      'ngMessages',
      'ngAria',
      'ngSanitize',
      'ngCookies'
    ]);
})();
