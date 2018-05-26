(function () {
  'use strict';

  var constants = {
    BASE_URI: 'http://localhost/api_jsonrpc.php',
    SECURITY: {
      LOGGED: false,
      TOKEN: ''
    },
    API: {
      VERSION: {
        method: 'apiinfo.version',
        auth: null,
        params: {}
      },
      LOGIN: {
        method: 'user.login',
        auth: null
      },
      LOGOUT: {
        method: 'user.logout',
        params: {}
      },
      TRIGGERS: {
        method: 'trigger.get',
        params: {
          extendoutput: true,
          limit: '10000',
          output: ['description', 'priority', 'value', 'lastchange'],
          monitored: true,
          skipDependent: true,
          expandDescription: true,
          selectGroups: ['name'],
          selectHosts: ['host', 'maintenance_status'],
          selectItems: ['itemid'],
          sortfield: 'lastchange',
          sortorder: 'DESC',
          only_true: true,
          selectLastEvent: 'true'
        }
      },
      HOSTGROUPS: {
        method: 'hostgroup.get',
        params: {
          output: 'extend',
          sortfield: 'groupid',
          with_monitored_items: true
        }
      },
      HOSTS: {
        method: 'host.get',
        params: {
          output: ['name', 'status'],
          selectGroups: ['groupid', 'name'],
          selectInterfaces: ['ip', 'port'],
          preservekeys: true
        }
      },
      HOST_DETAILS: {
        method: 'host.get',
        params: {
          output: ['name', 'status', 'available', 'host'],
          hostid: null,
          selectGroups: ['name'],
          selectInterfaces: ['ip', 'port'],
          selectGraphs: ['graphid', 'name']
        }
      },
      HOST_ITEMS: {
        method: 'item.get',
        params: {
          output: ['status', 'name', 'key_', 'lastvalue', 'description', 'state', 'error', 'lastclock', 'units'],
          hostids: null
        }
      },
      APPLICATIONS: {
        method: 'application.get',
        params: {
          output: ['name'],
          hostids: null,
          selectItems: ['status', 'name', 'key_', 'lastvalue', 'state', 'error', 'lastclock', 'units']
        }
      },
      MAPS: {
        method: 'map.get',
        params: {
          output: ['sysmapid', 'name', 'private']
        }
      },
      SERVICES: {
        method: 'service.get',
        params: {
          output: 'extend',
          selectTrigger: ['triggerid'],
          selectDependencies: 'extend'
        }
      }
    }
  };

  angular
    .module('zabbix')
    .constant('ZABBIX_CONSTANTS', constants);
})();
