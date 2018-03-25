(function () {
  'use strict';

  /** @ngInject */
  function SideBar() {
    const directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/common/sidebar/sidebar.html',
      controller: SidebarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  /** @ngInject */
  function SidebarController($cookies, $state, toastr, AuthService) {
    const vm = this;
    vm.isCollapsed = $cookies.get('sidebar-toggled') === '1' || false;

    vm.toggleSidebar = function () {
      vm.isCollapsed = !vm.isCollapsed;
      $cookies.put('sidebar-toggled', vm.isCollapsed ? 1 : 0);
    };

    vm.logout = function () {
      AuthService.logout(function () {
        $cookies.remove('zabbix-auth');
        toastr.info('You have been logged out successfully.');
        $state.go('login', {inherit: false, location: true});
      });
    };
  }

  angular
    .module('zabbix')
    .directive('sidebarNav', SideBar)
    .controller('SidebarController', SidebarController);
})();
