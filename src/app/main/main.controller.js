(function () {
  'use strict';

  /** @ngInject */
  function MainController() {
    const vm = this;
    vm.hello = 'Hello World!';
  }

  angular
    .module('zabbix')
    .controller('MainController', MainController);
})();
