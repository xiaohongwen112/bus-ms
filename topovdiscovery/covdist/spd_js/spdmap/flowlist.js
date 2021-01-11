var SpdMap = CBMSFLOW.module('spdmap');

var FLKEY_IP_A = 'ip_a';
var FLKEY_IP_B = 'ip_b';
var FLKEY_DEVICE_A = 'device_a';
var FLKEY_DEVICE_B = 'device_b';
var FLKEY_PORT_A = 'port_a';
var FLKEY_PORT_B = 'port_b';
var FLKEY_NODE_A = 'node_a';
var FLKEY_NODE_B = 'node_b';
var FLKEY_BYTES_A2B = 'bytes_a2b';
var FLKEY_BYTES_B2A = 'bytes_b2a';
var FLKEY_BYTES_TOTAL = 'bytes';

SpdMap.FlowList = CBMSFLOW.klass({

    __init__: function(){
        this.flows = [];
        this.flowsCount = 0;
        this.loaded = false;
    },
    filterAll: function(){
        return this.flows;
    },
    // concat all
    filterIpportsList: function(ipportsList){
        ipportsList = ipportsList || [];
        var ipports = _.reduce(ipportsList, function(x,y){return x.concat(y);}, []);
        return this.filterIpports(ipports);
    },

    //this func is NOT used any more
    filterIpports_old: function(ipports){
        var results = [];
        ipports = ipports || [];
        var self = this;
        $.each(this.flows, function(i, flow){
            $.each(ipports, function(i, ipport){
                var direction = self.matchIp(flow, ipport);
                if(direction){
                    results.push(self.adjustFlow(flow, direction));
                    return false;
                }
            });
        });
        return results;
    },

    filterIpports: function(ipports){
        var results = [];
        ipports = ipports || [];
        var self = this;
        var iplistHash = {};
        _.each(ipports, function(item){ iplistHash[item[0]] = 1;});
        $.each(this.flows, function(i, flow){
            var direction = self.matchIps(flow, iplistHash);
            if(direction){
                results.push(self.adjustFlow(flow, direction));
            }
        });
        return results;
    },

    filterIpportsPairs: function(ipportsPairs){
        ipportsPairs = ipportsPairs || [];
        var results = [];
        var self = this;
        $.each(this.flows, function(i, flow){
            $.each(ipportsPairs, function(i, ipportsPair){
                var direction = self.matchIpPair(flow, ipportsPair['from'], ipportsPair['to']);
                if(direction){
                    results.push(self.adjustFlow(flow, direction));
                    return false;
                }
                return null;
            });
        });
        return results;
    },
    filterWildcardIpportPair: function(ipportA, ipportB){
        var results = [];
        var self = this;
        $.each(this.flows, function(i, flow){
            var direction = self.matchWildcardIpportPair(flow, ipportA, ipportB);
            if(direction){
                results.push(self.adjustFlow(flow, direction));
            }
        });
        return results;
    },

    filterWildcardIpportPair2: function(ipportA, ipportB){
        var results = {
            'flows':[],
            'ipportA':{},
            'ipportB':{}
        };
        var self = this;
        $.each(this.flows, function(i, flow){
            var ippair_result = self.matchWildcardIpportPair2(flow, ipportA, ipportB);
            if(ippair_result && ippair_result.length > 0){
                results['flows'].push(self.adjustFlow(flow, ippair_result[0]['direction']));

                _.each(ippair_result, function(ippair){
                    var ip_a = ippair['ipportA'][0];
                    var port_a = ippair['ipportA'][1];
                    if(!results['ipportA'][ip_a]) results['ipportA'][ip_a] = {'ports':[]};
                    if(!_.contains(results['ipportA'][ip_a]['ports'], port_a)) results['ipportA'][ip_a]['ports'].push(port_a);

                    var ip_b = ippair['ipportB'][0];
                    var port_b = ippair['ipportB'][1];
                    if(!results['ipportB'][ip_b]) results['ipportB'][ip_b] = {'ports':[]};
                    if(!_.contains(results['ipportB'][ip_b]['ports'], port_b)) results['ipportB'][ip_b]['ports'].push(port_b);
                });
            }
        });
        return results;
    },

    filterWildcardIpportPairDevice: function(queryObj) {
        var results = {
            flows: [],
            ipportA: {},
            ipportB: {},
        };
        // Search Fn Body

        var exclude;
        if (CBMSFLOW.environment('topovmap') && CBMSFLOW.environment('topovmap').getUnvisibleIpPorts) {
            exclude = CBMSFLOW.environment('topovmap').getUnvisibleIpPorts().map(function (ipp) {
                return ipp[0];
            });
        }

        var self = this;
        $.each(this.flows, function(i, flow) {

            if (exclude !== undefined) {
                if (exclude.indexOf(flow[FLKEY_IP_A]) > -1 || exclude.indexOf(flow[FLKEY_IP_B]) > -1) return;
            }

            var result1 = (queryObj.ipA === '' || (!!queryObj.ipA.length && flow[FLKEY_IP_A].indexOf(queryObj.ipA) > -1)) &&
                        (queryObj.ipB === '' || (!!queryObj.ipB.length && flow[FLKEY_IP_B].indexOf(queryObj.ipB) > -1)) &&
                        (queryObj.portA === '' || (!!queryObj.portA.length && flow[FLKEY_PORT_A] === queryObj.portA)) &&
                        (queryObj.portB === '' || (!!queryObj.portB.length && flow[FLKEY_PORT_B] === queryObj.portB)) &&
                        // 支持搜索组件名
                        (queryObj.deviceA === '' || (!!queryObj.deviceA.length && (flow[FLKEY_NODE_A].indexOf(queryObj.deviceA) > -1 ||
                                                                                   flow[FLKEY_DEVICE_A].indexOf(queryObj.deviceA) > -1) )) &&
                        (queryObj.deviceB === '' || (!!queryObj.deviceB.length && (flow[FLKEY_NODE_B].indexOf(queryObj.deviceB) > -1 ||
                                                                                  flow[FLKEY_DEVICE_B].indexOf(queryObj.deviceB) > -1) )) &&
                        (queryObj.prot === '' || (!!queryObj.prot.length && (flow.prot_stack.some(function(prot) {return prot.indexOf(queryObj.prot) > -1}))));

            var result2 = (queryObj.ipA === '' || (!!queryObj.ipA.length && flow[FLKEY_IP_B].indexOf(queryObj.ipA) > -1)) &&
                        (queryObj.ipB === '' || (!!queryObj.ipB.length && flow[FLKEY_IP_A].indexOf(queryObj.ipB) > -1)) &&
                        (queryObj.portA === '' || (!!queryObj.portA.length && flow[FLKEY_PORT_B] === queryObj.portA)) &&
                        (queryObj.portB === '' || (!!queryObj.portB.length && flow[FLKEY_PORT_A] === queryObj.portB)) &&
                        (queryObj.deviceA === '' || (!!queryObj.deviceA.length && (flow[FLKEY_NODE_B].indexOf(queryObj.deviceA) > -1 ||
                                                                                   flow[FLKEY_DEVICE_B].indexOf(queryObj.deviceA) > -1) )) &&
                        (queryObj.deviceB === '' || (!!queryObj.deviceB.length && (flow[FLKEY_NODE_A].indexOf(queryObj.deviceB) > -1 ||
                                                                                   flow[FLKEY_DEVICE_A].indexOf(queryObj.deviceB) > -1) ));

            var newFlow = flow; // JSON.parse(JSON.stringify(flow));

            ///* 注释掉下一行则支持输入AB搜索BA
            result2 = false;
            //*/

            if (result2) {
                newFlow = self.adjustFlow(newFlow, 'revert');
            }

            if (result1 || result2) {
                if (!results.ipportA[newFlow[FLKEY_IP_A]]) results.ipportA[newFlow[FLKEY_IP_A]] = {ports: []};
                if (!_.contains(results.ipportA[newFlow[FLKEY_IP_A]].ports, newFlow[FLKEY_PORT_A])) {
                    results.ipportA[newFlow[FLKEY_IP_A]].ports.push(newFlow[FLKEY_PORT_A]);
                }
                if (!results.ipportB[newFlow[FLKEY_IP_B]]) results.ipportB[newFlow[FLKEY_IP_B]] = {ports: []};
                if (!_.contains(results.ipportB[newFlow[FLKEY_IP_B]].ports, newFlow[FLKEY_PORT_B])) {
                    results.ipportB[newFlow[FLKEY_IP_B]].ports.push(newFlow[FLKEY_PORT_B]);
                }
                results.flows.push(newFlow);
            }
        });
        return results;
    },

    matchIps: function(flow, iplistHash){
        if(iplistHash[flow[FLKEY_IP_A]] != undefined){
            return 'order';
        }else if(iplistHash[flow[FLKEY_IP_B]] != undefined){
            return 'revert';
        }else{
            return null;
        }
    },


    matchIp: function(flow, ip){
        if(flow[FLKEY_IP_A] == ip[0]){
            return 'order';
        }else if(flow[FLKEY_IP_B] == ip[0]){
            return 'revert';
        }else{
            return null;
        }
    },

    matchIpPair: function(flow, ipsA, ipsB) {
        if(this.ipMultiEqual(flow[FLKEY_IP_A], ipsA) && this.ipMultiEqual(flow[FLKEY_IP_B], ipsB)){
            return 'order';
        }else if(this.ipMultiEqual(flow[FLKEY_IP_A], ipsB) && this.ipMultiEqual(flow[FLKEY_IP_B], ipsA)){
            return 'revert';
        }else{
            return null;
        }
    },

    matchWildcardIpportPair: function(flow, ipportA, ipportB){
        if(this.ipportsWildcardContains([flow[FLKEY_IP_A], flow[FLKEY_PORT_A]], ipportA) &&
            this.ipportsWildcardContains([flow[FLKEY_IP_B], flow[FLKEY_PORT_B]], ipportB)){
            return 'order';
        }else if(this.ipportsWildcardContains([flow[FLKEY_IP_A], flow[FLKEY_PORT_A]], ipportB) &&
            this.ipportsWildcardContains([flow[FLKEY_IP_B], flow[FLKEY_PORT_B]], ipportA)){
            return 'revert';
        }else{
            return null;
        }
    },

    matchWildcardIpportPair2: function(flow, ipportA, ipportB){
        var result = [];
        if(this.ipportsWildcardContains([flow[FLKEY_IP_A], flow[FLKEY_PORT_A]], ipportA) &&
            this.ipportsWildcardContains([flow[FLKEY_IP_B], flow[FLKEY_PORT_B]], ipportB)){
            result.push({
                'direction':'order',
                'ipportA':[flow[FLKEY_IP_A], flow[FLKEY_PORT_A]],
                'ipportB':[flow[FLKEY_IP_B], flow[FLKEY_PORT_B]]
            });
        }
        if(this.ipportsWildcardContains([flow[FLKEY_IP_A], flow[FLKEY_PORT_A]], ipportB) &&
            this.ipportsWildcardContains([flow[FLKEY_IP_B], flow[FLKEY_PORT_B]], ipportA)){
            result.push({
                'direction':'revert',
                'ipportA':[flow[FLKEY_IP_B], flow[FLKEY_PORT_B]],
                'ipportB':[flow[FLKEY_IP_A], flow[FLKEY_PORT_A]]
            });
        }
        return result;
    },
    ipportsWildcardEqual: function(ipport, toMatchIpport){
        if((toMatchIpport[0] === null || ipport[0] == toMatchIpport[0]) && (toMatchIpport[1] === null || ipport[1] == toMatchIpport[1])){
            return true;
        }
        return false;
    },
    ipportsWildcardContains: function(ipport, toMatchIpport){
        return SpdMap.utils.ipportsWildcardContains(ipport, toMatchIpport);
    },
    ipMultiEqual: function(ip, toMatchIps){
        var result = false;
        var self = this;
        $.each(toMatchIps, function(i, toMatchIp){
            if(ip === toMatchIp[0]) {
                result = true;
                return false;
            }
        });
        return result;
    },
    ipsMultiEqual: function(ips, toMatchIps){
        return _.some(toMatchIps, function(toMatchIp, i){
            return _.contains(ips, toMatchIp[0]);
        });
    },
    getOppositeIpports: function(ipports){
        var results = [];
        var self = this;
        $.each(this.flows, function(i, flow){
            if(self.ipMultiEqual(flow[FLKEY_IP_A], ipports)){
                results.push([flow[FLKEY_IP_B]]);
            }else if(self.ipMultiEqual(flow[FLKEY_IP_B], ipports)){
                results.push([flow[FLKEY_IP_A]]);
            }
        });
        return results;
    },
    getIpports: function(ipports, exclude_ipports){
        var _this = this;
        var ipportsIpMap = new CBMSFLOW.Math.SUArray([]);
        _.each(ipports || [], function(ipport){
            ipportsIpMap.insert(ipport[0]);
        });
        var excludeIpMap = new CBMSFLOW.Math.SUArray([]);
        _.each(exclude_ipports || [], function(ipport){
            excludeIpMap.insert(ipport[0]);
        });
        var results = {};
        var resultsMap = {};
        _.each(this.flows, function(flow){
            if(excludeIpMap.has(flow[FLKEY_IP_A]) || excludeIpMap.has(flow[FLKEY_IP_B])){
                return;
            }
            if(ipportsIpMap.has(flow[FLKEY_IP_A])){
                if(!resultsMap[flow[FLKEY_IP_A]]){
                    resultsMap[flow[FLKEY_IP_A]] = [];
                }
                resultsMap[flow[FLKEY_IP_A]].push(flow[FLKEY_PORT_A]);
            }
            if(ipportsIpMap.has(flow[FLKEY_IP_B])){
                if(!resultsMap[flow[FLKEY_IP_B]]){
                    resultsMap[flow[FLKEY_IP_B]] = [];
                }
                resultsMap[flow[FLKEY_IP_B]].push(flow[FLKEY_PORT_B]);
            }            
        });
        _.each(resultsMap, function(resultMap, key){
            resultMap.sort();
            results[key] = _.uniq(resultMap, true);
        });
        return results;
    },
    adjustFlow: function(flow, direction){
        if(direction == 'order'){
            return flow;
        }else if(direction == 'revert'){
            var temp = flow[FLKEY_IP_A];
            flow[FLKEY_IP_A] = flow[FLKEY_IP_B];
            flow[FLKEY_IP_B] = temp;
            temp = flow[FLKEY_DEVICE_A];
            flow[FLKEY_DEVICE_A] = flow[FLKEY_DEVICE_B];
            flow[FLKEY_DEVICE_B] = temp;
            temp = flow[FLKEY_PORT_A];
            flow[FLKEY_PORT_A] = flow[FLKEY_PORT_B];
            flow[FLKEY_PORT_B] = temp;
            temp = flow[FLKEY_BYTES_A2B];
            flow[FLKEY_BYTES_A2B] = flow[FLKEY_BYTES_B2A];
            flow[FLKEY_BYTES_B2A] = temp;
            return flow;
        }
    },
    update: function(flows){
        this.flows = flows;
        this.flowsCount = flows.length;
        this.loaded = true;
    },
    clear: function(){
        this.flows = null;
        this.flowsCount = 0;
        this.loaded = false;
    }
});


