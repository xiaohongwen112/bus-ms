var SpdMap = CBMSFLOW.module('spdmap');

/*
 * this class use for getting data from remote server
 */
SpdMap.RemoteDataSource = CBMSFLOW.klass({
    __init__: function() {
        this.mapName = CBMSFLOW.environment('map_name');
    },

    getAllFlows: function(data, callback) {
        this.getFlowsByIpports(data||{}, callback);
    },

    getFlowsByIpports: function(data, callback) {
        var url = CBMSFLOW.util.make_spd_i18n_url(this.mapName + '/flowlist/');

        if (this.xhr) {
            this.xhr.abort();
        }

        data = this._appendDatasourceInfo(data);
        this.trigger("ajax.start");
        var _this = this;
        this.xhr = $.ajax({
            url: url,
            type: 'POST',
            data: appendCsrfToken(data),
            success: function(result) {
                _this.trigger("ajax.success");
                if (result) {
                    callback(result);
                }
            },
            error: function(err) {
                _this.trigger("ajax.error");
            }
        });
    },

    searchFlows: function(data, callback) {
        var url = CBMSFLOW.util.make_spd_i18n_url(this.mapName + '/search/');

        if (this.searchXhr) {
            this.searchXhr.abort();
        }

        data = this._appendDatasourceInfo(data);
        this.searchXhr = $.ajax({
            url: url,
            type: 'POST',
            data: appendCsrfToken(data),
            success: function(result) {
                if (result) {
                    callback(result);
                }
            },
            error: function(err) {
            }
        });
    },

    getOppositeIpports: function(data, callback) {
        var url = CBMSFLOW.util.make_spd_i18n_url(this.mapName + '/ipports/');

        data = this._appendDatasourceInfo(data);
        $.ajax({
            url: url,
            type: 'POST',
            data: appendCsrfToken(data),
            success: function(result){
                if(result){
                    callback(result['ipports']);
                }
            }
        });
    },

    _appendDatasourceInfo: function(data) {
        var datasourceName = CBMSFLOW.environment('datasource_name');
        if (datasourceName){
            data['datasource'] = datasourceName;
        }
        return data;
    },
    clear: function(){
        
    }

});


SpdMap.LocalDataSource = CBMSFLOW.klass({
    __init__:function(flowlist){
        this.flowlist = flowlist || [];
    },
    getAllFlows:function(data, callback){
        this.trigger("ajax.start");
        callback({'flows':this.flowlist});
        this.trigger("ajax.success");
    },
    clear:function(){
        this.flowlist = null;
    }
});

SpdMap.FlowListProxy = CBMSFLOW.klass(SpdMap.RevertObject, {

    __init__: function(datasource){
        this.flowlist = new SpdMap.FlowList();
        this.dataSource = datasource;
        this._id = 0;
    },
    clear: function(){
        this.flowlist.clear();
        this.flowlist = null;
        this.dataSource = null;
    },
    reset: function(datasource){
        this.flowlist = new SpdMap.FlowList();
        this.dataSource = datasource;
        this._id ++;
        this.changed();
    },
    getHistoryData: function(){
        return {
            '_id':this._id,
            'flowlist': this.flowlist,
            'datasource': this.dataSource
        };
    },
    loadHistoryData: function(data){
        this.dataSource = data.datasource;
        this.flowlist = data.flowlist;
    },
    getAllFlows: function(data, callback){
        if(this.flowlist.loaded){
            this.getFlowsByIpports(data, callback);
        }else{
            var self = this;
            var wrapperCallback = function(result){
                self.flowlist.update(result['flows']);
                self.getFlowsByIpports(data, callback);
            };
            this.dataSource.getAllFlows(data, wrapperCallback);
        }
    },
    getFlowsByIpports: function(data, callback){

        var results = [];
        //console.time('getFlowsByIpports.step1');
        if(data['type'] == 'nodes'){
            results = this.flowlist.filterIpportsList(JSON.parse(data['ipports_list']));
        }else if(data['type'] == 'links'){
            results = this.flowlist.filterIpportsPairs(JSON.parse(data['ipports_pairs']));
        }else{
            results = this.flowlist.filterAll();
        }
        //console.timeEnd('getFlowsByIpports.step1');
        //console.time('getFlowsByIpports.step2');
        if(data['exclude'] != undefined && data['exclude'].length > 0){

            //this one has better performance
            var exclude_ips = {};
            _.each(data['exclude'], function(item){ exclude_ips[item[0]]=1; });
            results =  _.filter(results, function(flow){
                return exclude_ips[flow[FLKEY_IP_A]] == undefined && exclude_ips[flow[FLKEY_IP_B]] == undefined;
            });

            /*
            var exclude_ips = _.map(data['exclude'], function(item){ return item[0]});
            results =  _.filter(results, function(flow){
                return !(_.contains(exclude_ips, flow[FLKEY_IP_A]) ||_.contains(exclude_ips, flow[FLKEY_IP_B]));
            });
            */
        }
        //console.timeEnd('getFlowsByIpports.step2');
        if(callback){
            callback({
                'flows': results,
                'totalCount': this.flowlist.flowsCount,
                'currentCount': results.length
            });
        }
    },
    // search
    searchFlows: function(data, callback){
        var ipportPair = JSON.parse(data['ipport_pair']);
        var results = this.flowlist.filterWildcardIpportPair2(ipportPair[0], ipportPair[1]);
        if(callback){
            callback({
                'flows': results['flows'],
                'count': results['flows'].length,
                'ipportA':results['ipportA'],
                'ipportB':results['ipportB']
            });
        }
    },
    searchFlowsNew: function(queryObj, callback){
        var results = this.flowlist.filterWildcardIpportPairDevice(queryObj);
        if(callback){
            callback({
                'flows': results['flows'],
                'count': results['flows'].length,
                'ipportA':results['ipportA'],
                'ipportB':results['ipportB']
            });
        }
    }, 
    getOppositeIpports: function(data, callback){
        var results = this.flowlist.getOppositeIpports(JSON.parse(data['ipports']));
        if(callback){
            callback(results);
        }
    },
    getIpports: function(data, callback){
        var results = this.flowlist.getIpports(JSON.parse(data['ipports']), JSON.parse(data['exclude']));
        if(callback){
            callback(results);
        }
    }
});
