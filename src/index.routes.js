(function () {
  'use strict';

  /** @ngInject */
  function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('app', {
        abstract: true
      })
      .state('home', {
        url: '/',
        parent: 'app',
        views: {
          'content@': {
            component: 'hello'
          }
        },
        data: {
          title: 'Dashboard'
        }
      });
  }

  angular
    .module('zabbix')
    .config(routesConfig);
})();
