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
        views: {'content@': {component: 'login'}},
        data: {
          class: 'login-body'
        }
      })
      .state('loggedin', {
        parent: 'app',
        abstract: true,
        views: {'content@': {component: 'main'}},
        data: {
          class: 'loggedin-body'
        }
      })
      .state('dashboard', {
        url: '/',
        parent: 'loggedin',
        views: {'main@loggedin': {component: 'dashboard'}},
        data: {
          authentication: true,
          title: 'Dashboard'
        }
      })
      .state('hosts', {
        url: '/hosts?hostgroup',
        parent: 'loggedin',
        views: {'main@loggedin': {component: 'hosts'}},
        data: {
          authentication: true,
          title: 'Hosts'
        }
      })
      .state('host', {
        url: '/host/:id',
        parent: 'loggedin',
        views: {'main@loggedin': {component: 'host'}},
        data: {
          authentication: true,
          title: 'Host Details'
        }
      })
      .state('hostgroups', {
        url: '/hostgroups',
        parent: 'loggedin',
        views: {'main@loggedin': {component: 'hostgroups'}},
        data: {
          authentication: true,
          title: 'Host Groups'
        }
      })
      .state('networks', {
        url: '/networks',
        parent: 'loggedin',
        views: {'main@loggedin': {component: 'networks'}},
        data: {
          authentication: true,
          title: 'Networks'
        }
      })
      .state('sla', {
        url: '/sla',
        parent: 'loggedin',
        views: {'main@loggedin': {component: 'sla'}},
        data: {
          authentication: true,
          title: 'SLA Health Status'
        }
      });
  }

  angular
    .module('zabbix')
    .config(routesConfig);
})();
