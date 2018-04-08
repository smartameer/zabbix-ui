(function () {
  'use strict';

  /** @ngInject */
  function MainController() {
    var vm = this;
    vm.hello = 'Hello World!';
  }

  angular
    .module('zabbix')
    .controller('MainController', MainController);
})();
