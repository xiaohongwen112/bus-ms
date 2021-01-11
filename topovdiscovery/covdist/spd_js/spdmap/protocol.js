var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.ProtocolIdentify = CBMSFLOW.klass({

    __init__: function(nodes, protocolMap) {
        this.nodes = nodes;
        this.protocolMap = protocolMap||{};
    },

    uniqProtocols: function() {
        var protocolMap = this.protocolMap;
        for (var key in protocolMap) {
            var stacks = protocolMap[key];
            protocolMap[key] = _.uniq(stacks.sort(), true);
        }
    },

    filterProtocol: function() {
        var protocolMap = this.protocolMap;
        var protocolConvertMap = [
            {'re':RegExp('.*xml')     , 'replace': 'xml'},
            {'re':RegExp('http data'), 'replace': 'html'}
        ];

        for (var key in protocolMap) {
            var stacks = protocolMap[key];
            for (var s = 0; s < stacks.length; s++) {
                var ps = stacks[s].split(',');
                for (var i = 0; i < ps.length; i++) {
                    for (var j in protocolConvertMap) {
                        var conv = protocolConvertMap[j];
                        if (conv['re'].test(ps[i].toLowerCase())) {
                            ps[i] = conv['replace'];
                        }
                    }
                }
                stacks[s] = ps.join(',');
            }
        }
    },

    isBaseOnTcp: function(protocols) {
        return protocols.indexOf('tcp') == 0;
    },

    isBaseOnTcpHttp: function(protocols) {
        return protocols.indexOf('tcp,http') == 0;
    },

    isBaseOnTcpEnterprise: function(protocols) {
        var protocol_list = [
            't3','cpic','cics','mc','cups','drda','ftp',
            'jips','tds','visa','wtc','wmq','cncc'
        ];
        if (protocol_list.indexOf(protocols.split(',')[1]) != -1){
            return true;
        }
        return false;
    },

    hasXml: function(protocols) {
        return _.contains(protocols.split(','), 'xml');
    },

    isHttpInTmp: function(tmp) {
        return _.contains(tmp, 'http');
    },

    removeDupluxProtocol: function(stacks) {
        var stacks = _.sortBy(stacks, function(s) { return s.length; });
        stacks = _.uniq(stacks, true);

        for(var i=0; i <stacks.length; i++) {

            var protocol = stacks[i];

            for(var j=i+1; j <stacks.length; j++) {
                var protocol2 = stacks[j];
                if (protocol2.indexOf(protocol) == 0 && protocol2 != protocol) {
                    stacks.splice(i, 1);
                    break;
                }
            }
        }

        return stacks;
    },

    mergeProtocols: function() {
        var protocolMap = this.protocolMap;
        this.uniqProtocols(protocolMap);
        this.filterProtocol(protocolMap);
        this.uniqProtocols(protocolMap);

        for (var key in protocolMap) {
            var stacks = protocolMap[key];
            var tmp = [];
            for (var i=0,len=stacks.length;i<len;i++) {
                var protocol = stacks[i];
                if (this.isBaseOnTcpEnterprise(protocol)) {
                    tmp = tmp.concat(protocol.split(','));
                } else {
                    if (this.isBaseOnTcpHttp(protocol)) {
                       // tcp,http
                       tmp = tmp.concat(protocol.split(','));
                    } else {
                        // tcp,xml
                        if (this.hasXml(protocol)) {
                            if (this.isHttpInTmp(tmp)) {
                                tmp.splice(tmp.indexOf('http')+1, 0, 'xml');
                            } else {
                                tmp = tmp.concat(protocol.split(','));
                            }
                        } else {
                            // tcp,....
                            tmp = tmp.concat(protocol.split(','));
                        }
                    }
                }
            }
            stacks = [];
            for (var i=0,len=tmp.length; i< len; i++) {
                if (tmp[i] == 'tcp') {
                    stacks.push(tmp[i]);
                } else {
                    stacks[stacks.length-1] = stacks[stacks.length-1]+'+'+tmp[i];
                }
            }
            protocolMap[key] = this.removeDupluxProtocol(stacks);
        }

        this.protocolMap = protocolMap;
    },

    addProtocolToNode: function() {
        var self = this;
        for (var i=0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            var nodeName = node.name;
            var servers = node.servers;
            var protocols = {};
            for (var j=0,len=servers.length; j < len; j++) {
                var server = servers[j];
                var group = server.group;
                var ports = server.ipports.ports||[];
                _.each(_.map(ports, function(p) { return nodeName + '_' + group + '_' + p; }), function(name) {
                    protocols[name] = self.protocolMap[name];
                });
            }
            this.nodes[i]['protocolMap'] = protocols;
        }
    },

    getNodeByName: function(name) {
        var result = null;
        $.each(this.nodes, function(i, node){
            if(node.name == name){
                result = node;
                return false;
            }
        });
        return result;
    },


});
