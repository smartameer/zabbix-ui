(function () {
  'use strict';

  /** @ngInject */
  function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('app', {
        abstract: true
      })
      .state('home', {
        url: '/dashboard',
        parent: 'app',
        views: {
          'content@': {
            component: 'hello'
          }
        },
        data: {
          title: 'Dashboard',
          class: 'dashboard-body'
        }
      })
      .state('login', {
        url: '/login',
        parent: 'app',
        views: {
          'content@': {
            component: 'login'
          }
        },
        data: { }
      });
  }

  angular
    .module('zabbix')
    .config(routesConfig);
})();
