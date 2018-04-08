(function () {
  'use strict';

  /** @ngInject */
  function TokenInterceptor($q, $cookies, ZABBIX_CONSTANTS) {
    return {
      request: function (config) {
        if (angular.isDefined(config.data)) {
          var data = {
            jsonrpc: '2.0',
            id: new Date().getTime(),
            auth: null
          };
          var zabbixAuth = $cookies.get('zabbix-auth');
          if (angular.isDefined(zabbixAuth) && ZABBIX_CONSTANTS.SECURITY.LOGGED === true) {
            data.auth = zabbixAuth;
          }
          config.headers['Content-Type'] = 'application/json';
          config.headers.Accept = 'application/json';
          config.method = 'POST';
          config.data = angular.extend({}, data, config.data);
        }
        return config;
      },

      response: function (response) {
        if (angular.isDefined(response.data) && angular.isDefined(response.data.error)) {
          return $q.reject(response.data.error);
        }
        return response || $q.when(response);
      },

      requestError: function (rejection) {
        return $q.reject(rejection);
      },

      responseError: function (rejection) {
        if (rejection.status === 401) {
          ZABBIX_CONSTANTS.SECURITY.LOGGED = false;
          ZABBIX_CONSTANTS.SECURITY.USER = {};
          if (angular.isDefined($cookies.get('zabbix-auth'))) {
            $cookies.remove('zabbix-auth');
          }
          return;
        }
        return $q.reject(rejection);
      }
    };
  }

  angular
    .module('zabbix')
    .factory('TokenInterceptor', TokenInterceptor);
})();
