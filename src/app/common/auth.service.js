(function () {
  'use strict';

  /** @ngInject */
  function AuthService($cookies, $q, $http, ZABBIX_CONSTANTS) {
    var auth = {};

    var profile = function (data) {
      return $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: angular.extend({}, ZABBIX_CONSTANTS.API.LOGIN, {
          params: {
            user: data.username,
            password: data.password
          }
        })
      });
    };

    auth.init = function () {
      if (auth.isLoggedIn()) {
        ZABBIX_CONSTANTS.SECURITY.LOGGED = true;
        ZABBIX_CONSTANTS.SECURITY.TOKEN = $cookies.get('zabbix-auth');
      }
    };

    auth.login = function (username, password) {
      return $q(function (resolve, reject) {
        profile({
          username: username,
          password: password
        }).then(function (response) {
          var data = response.data;
          $cookies.put('zabbix-auth', data.result);
          ZABBIX_CONSTANTS.SECURITY.LOGGED = true;
          ZABBIX_CONSTANTS.SECURITY.TOKEN = data.result;
          resolve(true);
        }, function (response) {
          reject(response);
        });
      });
    };

    auth.logout = function (callback) {
      $cookies.remove('zabbix-auth');
      ZABBIX_CONSTANTS.SECURITY = {
        LOGGED: false,
        TOKEN: null
      };
      if (angular.isFunction(callback)) {
        callback();
      }
    };

    auth.isLoggedIn = function () {
      return angular.isDefined($cookies.get('zabbix-auth'));
    };

    return auth;
  }

  angular
    .module('zabbix')
    .factory('AuthService', AuthService);
})();