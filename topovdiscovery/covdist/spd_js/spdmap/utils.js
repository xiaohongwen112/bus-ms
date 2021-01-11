var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.utils = {
    logger : CBMSFLOW.getLogger('debug'),
    ipports_fields: ["ip","ports","weight"],
    calcDistance: function(posA, posB){
        return Math.floor(Math.sqrt(Math.pow((posA.x-posB.x), 2) + Math.pow((posA.y-posB.y), 2)));
    },
    extractIpNetSegment: function(ip){
        return ip.substr(0, ip.lastIndexOf('.'));
    },
    isIpValid: function(ip) {
        var regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (regexp.test(ip)) {
            return true;
        } else {
            return false;
        }
    },
    isPortValid: function(port) {
        var regexp = /^\d+$/;
        if (regexp.test(port)) {
            return parseInt(port) >= 0 && parseInt(port) <= 65535;
        } else {
            return false;
        }
    },
    ipText2Int: function(ip) {
        var arr = ip.split('.');
        var x = 1, ret = 0;
        for(var i=arr.length-1; i>=0;i--){
            ret += arr[i] * x;
            x *= 256;
        }
        return ret;
    },
    formatIpPortFields: function(ip_port){
        return _.object(this.ipports_fields, ip_port||[]);
    },
    genIpPortList: function(ip_port_kv){
        ip_port_kv = ip_port_kv || {};
        var default_vals = {
            "flowcount":0,
            "weight":0,
            "ports":[]
        };
        return _.map(this.ipports_fields, function(k){
            var v = ip_port_kv[k];
            if(v == undefined){
                v = default_vals[k];
            }
            return v;
        });
    },
    ipportsWildcardContains: function(ipport, toMatchIpport){
        //ip can be device name, allow partial match  (127.0 will match 127.0.0.1)
        var deviceName = CBMSFLOW.environment('ipDeviceMap')[ipport[0]];
        if((toMatchIpport[0] === null 
              || ipport[0].indexOf(toMatchIpport[0]) != -1 
              || (deviceName != undefined && deviceName.toLowerCase().indexOf(toMatchIpport[0].toLowerCase()) != -1))
            && (toMatchIpport[1] === null || ipport[1] == toMatchIpport[1])){
            return true;
        }
        return false;
    }

};
