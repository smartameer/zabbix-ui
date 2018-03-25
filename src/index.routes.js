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
      .state('login', {
        url: '/login',
        parent: 'app',
        views: {
          'content@': {
            component: 'login'
          }
        },
        data: {
          class: 'login-body'
        }
      })
      .state('loggedin', {
        parent: 'app',
        abstract: true,
        views: {
          'content@': {
            component: 'main'
          }
        },
        data: {
          class: 'loggedin-body'
        }
      })
      .state('dashboard', {
        url: '/',
        parent: 'loggedin',
        views: {
          'main@loggedin': {
            component: 'dashboard'
          }
        },
        data: {
          authentication: true,
          title: 'Dashboard'
        }
      })
      .state('hosts', {
        url: '/hosts?hostgroup',
        parent: 'loggedin',
        views: {
          'main@loggedin': {
            component: 'hosts'
          }
        },
        data: {
          authentication: true,
          title: 'Hosts'
        }
      })
      .state('hostgroups', {
        url: '/hostgroups',
        parent: 'loggedin',
        views: {
          'main@loggedin': {
            component: 'hostgroups'
          }
        },
        data: {
          authentication: true,
          title: 'Host Groups'
        }
      });
  }

  angular
    .module('zabbix')
    .config(routesConfig);
})();
