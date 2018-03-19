(function () {
  'use strict';

  /** @ngInject */
  function AppController() {
    var vm = this;
    vm.hello = 'Hello World!';
  }

  angular
    .module('zabbix')
    .controller('AppController', AppController);
})();
