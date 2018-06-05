(function () {
  'use strict';

  /** @ngInject */
  function SLAController($http, $filter, $timeout, ZABBIX_CONSTANTS) {
    var vm = this;
    var SLA_DATA = {jsonrpc: '2.0', result: [{serviceid: '100100000000004', name: 'Radon', status: '0', algorithm: '0', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [{linkid: '100100000000005', serviceupid: '100100000000004', servicedownid: '100100000000007', soft: '0', sortorder: '0', serviceid: '100100000000007'}, {linkid: '100100000000009', serviceupid: '100100000000004', servicedownid: '100100000000010', soft: '0', sortorder: '0', serviceid: '100100000000010'}, {linkid: '100100000000011', serviceupid: '100100000000004', servicedownid: '100100000000012', soft: '0', sortorder: '0', serviceid: '100100000000012'}, {linkid: '100100000000025', serviceupid: '100100000000004', servicedownid: '100100000000016', soft: '0', sortorder: '0', serviceid: '100100000000016'}], trigger: []}, {serviceid: '100100000000007', name: 'ERP', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [{linkid: '100100000000013', serviceupid: '100100000000007', servicedownid: '100100000000008', soft: '0', sortorder: '0', serviceid: '100100000000008'}, {linkid: '100100000000014', serviceupid: '100100000000007', servicedownid: '100100000000009', soft: '0', sortorder: '0', serviceid: '100100000000009'}], trigger: []}, {serviceid: '100100000000008', name: 'AIX_P1', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [], trigger: []}, {serviceid: '100100000000009', name: 'AS400', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [], trigger: []}, {serviceid: '100100000000010', name: 'Domain', status: '5', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [{linkid: '100100000000015', serviceupid: '100100000000010', servicedownid: '100100000000011', soft: '0', sortorder: '0', serviceid: '100100000000011'}], trigger: []}, {serviceid: '100100000000011', name: 'SerRadon', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: []}, {serviceid: '100100000000012', name: 'FTP Punti Vendita', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [], trigger: []}, {serviceid: '100100000000016', name: 'Posta Elettronica', status: '5', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.9000', sortorder: '0', dependencies: [{linkid: '100100000000026', serviceupid: '100100000000016', servicedownid: '100100000000018', soft: '0', sortorder: '0', serviceid: '100100000000018'}, {linkid: '100100000000027', serviceupid: '100100000000016', servicedownid: '100100000000023', soft: '0', sortorder: '0', serviceid: '100100000000023'}, {linkid: '100100000000031', serviceupid: '100100000000016', servicedownid: '100100000000027', soft: '0', sortorder: '0', serviceid: '100100000000027'}], trigger: []}, {serviceid: '100100000000018', name: 'Zimbra', status: '0', algorithm: '1', triggerid: '0', showsla: '1', goodsla: '99.0500', sortorder: '0', dependencies: [{linkid: '100100000000021', serviceupid: '100100000000018', servicedownid: '100100000000019', soft: '0', sortorder: '0', serviceid: '100100000000019'}, {linkid: '100100000000022', serviceupid: '100100000000018', servicedownid: '100100000000020', soft: '0', sortorder: '0', serviceid: '100100000000020'}, {linkid: '100100000000023', serviceupid: '100100000000018', servicedownid: '100100000000021', soft: '0', sortorder: '0', serviceid: '100100000000021'}, {linkid: '100100000000024', serviceupid: '100100000000018', servicedownid: '100100000000022', soft: '0', sortorder: '0', serviceid: '100100000000022'}], trigger: []}, {serviceid: '100100000000019', name: 'Ping', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: []}, {serviceid: '100100000000020', name: 'SMTP Service', status: '0', algorithm: '1', triggerid: '100100000121329', showsla: '1', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: {triggerid: '100100000121329'}}, {serviceid: '100100000000021', name: 'Http Service', status: '0', algorithm: '1', triggerid: '100100000121327', showsla: '1', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: {triggerid: '100100000121327'}}, {serviceid: '100100000000022', name: 'IMAP Service', status: '0', algorithm: '1', triggerid: '100100000121328', showsla: '1', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: {triggerid: '100100000121328'}}, {serviceid: '100100000000023', name: 'Exchange', status: '5', algorithm: '1', triggerid: '0', showsla: '1', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: []}, {serviceid: '100100000000027', name: 'Mail 243', status: '0', algorithm: '1', triggerid: '0', showsla: '1', goodsla: '99.0500', sortorder: '0', dependencies: [{linkid: '100100000000032', serviceupid: '100100000000027', servicedownid: '100100000000028', soft: '0', sortorder: '0', serviceid: '100100000000028'}], trigger: []}, {serviceid: '100100000000028', name: 'Ping', status: '0', algorithm: '1', triggerid: '0', showsla: '0', goodsla: '99.0500', sortorder: '0', dependencies: [], trigger: []}], id: 1};
    vm.title = 'SLA Health Status';
    vm.sladetails = [];
    vm.tree = [];

    var recursiveSet = function (data, parent) {
      angular.forEach(data, function (dep) {
        var sladetails = $filter('filter')(vm.sladetails, {serviceid: dep.serviceid}, true);
        if (sladetails.length > 0) {
          var service = sladetails[0];
          if (angular.isDefined(service.dependencies) && service.dependencies.length > 0) {
            service.open = false;
            service.children = [];
            recursiveSet(service.dependencies, service.children);
          }
          $timeout(function () {
            parent.push(service);
          }, 0);
        }
      });
    };

    vm.processSla = function (data, parent) {
      angular.forEach(data, function (obj) {
        if (obj.algorithm === '0') {
          if (angular.isDefined(obj.dependencies) && obj.dependencies.length > 0) {
            obj.open = true;
            obj.children = [];
            recursiveSet(obj.dependencies, obj.children);
          }
          $timeout(function () {
            parent.push(obj);
          }, 0);
        }
      });
    };

    vm.getServices = function () {
      $http({
        url: ZABBIX_CONSTANTS.BASE_URI,
        data: ZABBIX_CONSTANTS.API.SERVICES
      }).then(function () {
        // vm.sladetails = response.data.result;
        vm.sladetails = SLA_DATA.result;
        vm.processSla(vm.sladetails, vm.tree);
      });
    };

    vm.getServices();
  }

  angular
    .module('zabbix')
    .controller('SLAController', SLAController);
})();
