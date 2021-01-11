var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.SearchCtrl = CBMSFLOW.klass(SpdMap.RevertObject, {

    __init__: function(ele){
        this.ele = ele;
        this.lastQuery = null;
        this.dataSource = CBMSFLOW.environment('flowlistProxy');
        this._setupUI();
    },

    _parseQuery : function(query){
        var cond =  [{'ip' : null, 'port' : null}, {'ip' : null, 'port' : null}];
        var reg = new RegExp('\"([^\"\']*)\"', "gi");
        var query = query.trim();
        var quoted = query.match(reg);
        var quoteCount = 0;
        var quoteSigns = query.match(/\"/gi);
        if(quoteSigns){
            quoteCount = quoteSigns.length;
        }
        if(quoteCount % 2 == 1){
            throw ("unpaired quote");
        }
        var quoteMap = {};
        _.each(quoted, function(item, index){
            var key = '"$' + index + '"';
            query = query.replace(item, key);
            quoteMap[key] = item.substring(1, item.length-1);
        });

        function fixQuote(v){
            if(v.indexOf('"$') == 0){
                v = quoteMap[v];
            }
            return v;
        }

        var ipList = query.split(/\s+/);
        if(ipList.length > 2){
            throw("Invalid");
        }
        ipList.forEach(function(ipp, i){
            var parts = ipp.split(':');
            parts = _.map(parts, fixQuote);
            if(parts.length > 2){
                throw("Invalid");
            }
            else if(parts.length == 1){
                if(SpdMap.utils.isPortValid(parts[0])){
                    cond[i]['port'] = parts[0];
                }
                else{
                    cond[i]['ip'] = parts[0];
                }
            }
            else{
                if(SpdMap.utils.isPortValid(parts[1])){
                    cond[i]['ip'] = parts[0];
                    cond[i]['port'] = parts[1];
                }
                else{
                    throw("Invalid port:" + parts[1]);
                }
            }
        });
        return cond;
    },

    _clearMsg: function(elem) {
        if (elem.val().trim().length > 0 ) {
            elem.messagepop('hide');
            elem.removeClass('error');
        }
    },

    _setupUI : function(){
        var _this = this;
        var $ipaInput = $(_this.ele).find('#ipa');
        var $portaInput = $(_this.ele).find('#porta');
        var $ipbInput = $(_this.ele).find('#ipb');
        var $portbInput = $(_this.ele).find('#portb');
        $ipaInput.messagepop({'trigger': 'manual', 'zindex': null});
        $portaInput.messagepop({'trigger': 'manual', 'zindex': null});
        $ipbInput.messagepop({'trigger': 'manual', 'zindex': null});
        $portbInput.messagepop({'trigger': 'manual', 'zindex': null});

        $(_this.ele).find('input[name=query]').bind('input', function(e){
            var minWidth = 177; //20 char
            var maxWidth = 298; //43 char
            var value = $(this).val();
            var width = Math.ceil(value.length * (minWidth / 20));
            width = Math.max(width, minWidth);
            width = Math.min(width, maxWidth);
            $(this).width(width);
        });



        $(_this.ele).find('input[name=query]').unbind('keyup').keyup(function(e){
            if (e.keyCode == 13) {
                $(_this.ele).find('input[name=simple-search]').trigger('click');
            }
        });

        $.each([$ipaInput, $ipbInput, $portaInput, $portbInput], function() {
            $(this).keyup(function(e){
                _this._clearMsg($(this));
            });
        });

        $(_this.ele).find('input[name=query]').messagepop({'trigger': 'manual', 'zindex': null});

        $(this.ele).find('div.simple-search-box').click(function(){
            _this.showAdvancedSearch();
            /*
            var query = $(_this.ele).find('input[name=query]').val().trim();

            $(_this.ele).find('.search-result-summary').hide();

            if(query.length == 0){
                $(_this.ele).find('input[name=query]').messagepop('show', gettext('请输入搜索关键字'));
                $(_this.ele).find('input[name=query]').addClass('error');
                return false;
            }
            try {
                _this._parseQuery(query);
            }
            catch (err){
                $(_this.ele).find('input[name=query]').messagepop('show', gettext('格式错误'));
                $(_this.ele).find('input[name=query]').addClass('error');
                return false;
            }
            $(_this.ele).find('.search-validate-info').html('');
            $(_this.ele).find('input[name=query]').removeClass('error');
            _this.doSearch(query);
            */
        });

        $(this.ele).find('.search-result-clear').click(function(){
            _this.queryObj = {};
            _this.clearSearch();
            $(_this.ele).find('input[name=query]').val('').trigger('input');
        });
        $(this.ele).find('.search-advanced-icon').click(function(){
            _this.showAdvancedSearch();
        });
        $(this.ele).find('.icon-close').click(function(){
            _this.hideAdvancedSearch();
        });
        $(this.ele).find('button[name=as-cancel]').click(function(){
            _this.hideAdvancedSearch();
        });

        function checkAdvancedForm(){
            var invalid_elements = [];
            var isEmpty = true;
            ['a','b'].forEach(function(suffix){
                var ip = $(_this.ele).find('input[name=ip' + suffix + ']').val().trim();
                var port = $(_this.ele).find('input[name=port' + suffix + ']').val().trim();
                if(ip.length >0){
                    if(ip.indexOf('"') != -1){
                        invalid_elements.push('ip' + suffix);
                    }
                    isEmpty = false;
                }
                if(port.length >0){
                    if(!SpdMap.utils.isPortValid(port)){
                        invalid_elements.push('port' + suffix);
                    }
                    isEmpty = false;
                }
            });

            $.each($(_this.ele).find('.advanced-search-box input[type=text]'), function(i, item) {
                $(item).removeClass('error').messagepop('hide');
            });

            _this._clearAllMsg();

            if(invalid_elements.length > 0){
                invalid_elements.forEach(function(name){
                    $(_this.ele).find('input[name=' + name + ']').addClass('error');
                });
                $(_this.ele).find('input[name=' + invalid_elements[0] + ']').messagepop('show', gettext('格式错误'));
            }
            else if(isEmpty){
                $(_this.ele).find('.advanced-search-box input[type=text]:first').addClass('error').messagepop('show', gettext('请输入搜索关键字'));
            }
            else{
                $(_this.ele).find('.as-validate-info').html('');
            }
            return !isEmpty && invalid_elements.length == 0;
        }

        function checkAdvancedFormNew(){
            var invalid_elements = [];
            var isEmpty = true;
            ['a','b'].forEach(function(suffix){
                var ip = $(_this.ele).find('input[name=ip' + suffix + ']').val().trim();
                var port = $(_this.ele).find('input[name=port' + suffix + ']').val().trim();
                var device = $(_this.ele).find('input[name=device' + suffix + ']').val().trim();
                if(ip.length >0){
                    if(ip.indexOf('"') != -1){
                        invalid_elements.push('ip' + suffix);
                    }
                    isEmpty = false;
                }
                if(port.length >0){
                    if(!SpdMap.utils.isPortValid(port)){
                        invalid_elements.push('port' + suffix);
                    }
                    isEmpty = false;
                }
                if(device.length >0){
                    isEmpty = false;
                }
            });

            var prot = $(_this.ele).find('input[name=prot]').val().trim();
            if (prot.length > 0) {
                isEmpty = false;
            }

            $.each($(_this.ele).find('.advanced-search-box input[type=text]'), function(i, item) {
                $(item).removeClass('error').messagepop('hide');
            });

            _this._clearAllMsg();

            if(invalid_elements.length > 0){
                invalid_elements.forEach(function(name){
                    $(_this.ele).find('input[name=' + name + ']').addClass('error');
                });
                $(_this.ele).find('input[name=' + invalid_elements[0] + ']').messagepop('show', gettext('格式错误'));
            }
            else if(isEmpty){
                $(_this.ele).find('.advanced-search-box input[type=text]:first').addClass('error').messagepop('show', gettext('请输入搜索关键字'));
            }
            else{
                $(_this.ele).find('.as-validate-info').html('');
            }
            return !isEmpty && invalid_elements.length == 0;
        }

        var queryObj;

        _this.queryObj = queryObj;

        // 高级搜索
        $(this.ele).find('button[name=as-submit]').click(function(){
            if(!checkAdvancedFormNew()){
                $(_this.ele).find('input[name=query]').val('')
                _this.queryObj = {};
                return false;
            }

            $(_this.ele).find('.search-result-summary').hide();

            _this._clearAllMsg();
            // var query =  '';
            // ['a','b'].forEach(function(suffix){
            //     var ip = $(_this.ele).find('input[name=ip' + suffix + ']').val().trim();
            //     var port = $(_this.ele).find('input[name=port' + suffix + ']').val().trim();
            //     if(ip.indexOf(' ') != -1 || ip.indexOf(':') != '-1'){
            //         ip = '"' + ip + '"';
            //     }
            //     if(ip.length > 0 && port.length > 0){
            //         query += ip + ':' + port + '  ';
            //     }
            //     else{
            //         query += ip+port + ' ';
            //     }
            // });

            var thisEle = $(_this.ele);
            var ipA = thisEle.find('input[name=ipa]').val().trim();
            var ipB = thisEle.find('input[name=ipb]').val().trim();
            var portA = thisEle.find('input[name=porta]').val().trim();
            var portB = thisEle.find('input[name=portb]').val().trim();
            var deviceA = thisEle.find('input[name=devicea]').val().trim();
            var deviceB = thisEle.find('input[name=deviceb]').val().trim();
            var prot = thisEle.find('input[name=prot]').val().trim();

            var queryTxt =  _this.buildQueryTxt(ipA, portA, deviceA) + ' ' + _this.buildQueryTxt(ipB, portB, deviceB) + ' ' + prot;
            
            $(_this.ele).find('.search-validate-info').html('');
            $(_this.ele).find('input[name=query]').removeClass('error');
            $(_this.ele).find('input[name=query]').val(queryTxt.trim()).trigger('input');

            // query = query.trim();
            _this.queryObj = {
                ipA: ipA,
                ipB: ipB,
                portA: portA,
                portB: portB,
                deviceA: deviceA,
                deviceB: deviceB,
                prot: prot,
            };

            _this.doSearchNew(_this.queryObj);
            _this.hideAdvancedSearch();
        });

        function hideResetSearch() {

            var thisEle = $(_this.ele);
            _this.queryObj.ipA && thisEle.find('input[name=ipa]').val(_this.queryObj.ipA);
            _this.queryObj.ipB && thisEle.find('input[name=ipb]').val(_this.queryObj.ipB);
            _this.queryObj.portA && thisEle.find('input[name=porta]').val(_this.queryObj.portA);
            _this.queryObj.portB && thisEle.find('input[name=portb]').val(_this.queryObj.portB);
            _this.queryObj.deviceA && thisEle.find('input[name=devicea]').val(_this.queryObj.deviceA);
            _this.queryObj.deviceB && thisEle.find('input[name=deviceb]').val(_this.queryObj.deviceB);
            _this.queryObj.prot && thisEle.find('input[name=prot]').val(_this.queryObj.prot);

            $.each([$ipaInput, $ipbInput, $portaInput, $portbInput], function() {
                $(this).messagepop('hide');
                $(this).removeClass('error');
            });
        }

        $(this.ele).find('.icon-close.close-panel').click(hideResetSearch);

        $(this.ele).find('button[name=as-cancel]').click(hideResetSearch);
    },

    buildQueryTxt: function (ip, port, device) {
        var queryTxt = ip + ':' + port + ',' + device;
        return queryTxt.replace(/^[:,]+/, '').replace(/[:,]+$/, '');
    },

    _clearAllMsg: function() {
        $.each($(this.ele).find('.advanced-search-box input[type=text]'), function(i, item) {
            $(item).removeClass('error').messagepop('hide');
        });
    },

    showAdvancedSearch : function(){
        $(this.ele).find('input[name=query]').removeClass('error').messagepop('hide');
        $(this.ele).find('.advanced-search-box').show();
        $(this.ele).find('.advanced-search-box input[name=ipa]')[0].focus();
    },
    hideAdvancedSearch : function(){
        $.each($(this.ele).find('.advanced-search-box input[type=text]'), function(i, item) {
            $(item).removeClass('error').messagepop('hide');
        });
        $(this.ele).find('.advanced-search-box').hide();
        $(this.ele).find('input[name=query]')[0].focus();
    },

    displayResult : function(query, records, ipports){
        var resultCount = records.length;
        var desc = '';
        if(resultCount > 0){
            desc = interpolate(gettext('找到%(count)s个符合条件的会话，存在于 %(mark)s 标记中。'), {
                count:resultCount,
                mark:'<i class="search-color-indicator"></i>'
            }, true);
        }
        else{
            desc = gettext('没有找到符合条件的结果。');
        }
        this._desc = desc;
        $(this.ele).find('span.search-result-desc').html(desc);
        $(this.ele).find('.search-result-summary').show().css('display', 'inline-block');
        this.changed('done');

        this.trigger('search.done', {'query' : query, 'ipports':ipports, 'flows': records});
    },
    _clear: function(){
        this._desc = null;
        $(this.ele).find('.search-result-summary').hide();
        $(this.ele).find('input[name=query]').val('');
        $(this.ele).find('.advanced-search-box input[type=text]').val('');
        this.queryObj = {};
    },
    clearSearch : function(){
        this._clear();
        this.changed('clear');
        this.trigger('search.clear', {'query' : null, 'result' : []});
    },
    emptySearch: function(){
        this._clear();
        this.changed('empty');
    },
    doSearch : function(query){
        var _this = this;
        var cond = this._parseQuery(query);
        var ipport_pair = [[cond[0]['ip'], cond[0]['port']], [cond[1]['ip'], cond[1]['port']]];
        // search 
        this.dataSource.searchFlows({'ipport_pair' : JSON.stringify(ipport_pair)}, function(data){
            var match_mode = _.reduce(query || [], function(num, item){
                item = item || {};
                var i = (item['ip'] === null || item['ip'] === undefined)  && (item['port'] === null || item['port'] === undefined) ? 0 : 1;
                return i + num;
            }, 0);
            var ipports = data['ipportA'];
            if(match_mode == 2){
                _.each(data['ipportB'], function(v, ip){
                    if(ipports[ip] == undefined){
                        ipports[ip] = v;
                    }
                    else{
                        ipports[ip]['ports'] = _.uniq(ipports[ip]['ports'].concat(v['ports']).sort(), true);
                    }
                });
            }
            _this.displayResult(cond, data['flows'], ipports);
        });
    },
    doSearchNew : function(queryObj){
        var _this = this;
        var cond = [{ip: null, port: null, device: null}, {ip: null, port: null, device: null}, {prot: null}];

        queryObj.ipA.length && (cond[0].ip = queryObj.ipA);
        queryObj.portA.length && (cond[0].port = queryObj.portA);
        queryObj.deviceA.length && (cond[0].device = queryObj.deviceA);
        queryObj.ipB.length && (cond[1].ip = queryObj.ipB);
        queryObj.portB.length && (cond[1].port = queryObj.portB);
        queryObj.deviceB.length && (cond[1].device = queryObj.deviceB);
        queryObj.prot.length && (cond[2].prot = queryObj.prot);
        
        this.dataSource.searchFlowsNew(queryObj, function (data) {
            var match_mode = _.reduce(query || [], function(num, item){
                item = item || {};
                var i = (item['ip'] === null || item['ip'] === undefined)  && (item['port'] === null || item['port'] === undefined) ? 0 : 1;
                return i + num;
            }, 0);
            var ipports = data['ipportA'];
            if(match_mode == 2){
                _.each(data['ipportB'], function(v, ip){
                    if(ipports[ip] == undefined){
                        ipports[ip] = v;
                    }
                    else{
                        ipports[ip]['ports'] = _.uniq(ipports[ip]['ports'].concat(v['ports']).sort(), true);
                    }
                });
            }
            console.log('SearchResult => ', data);
            _this.displayResult(cond, data['flows'], ipports);
        });
    },
    getHistoryData:function(){
        var advanced_query = [];
        $(this.ele).find('.advanced-search-box input[type=text]').each(function(){
            advanced_query.push($(this).val());
        });
        return {
            'desc':this._desc,
            'query':$(this.ele).find('input[name=query]').val(),
            'advanced_query':advanced_query
        };
    },
    loadHistoryData:function(data){
        if(data.desc){
            $(this.ele).find('span.search-result-desc').html(data.desc);
            $(this.ele).find('.search-result-summary').show().css('display', 'inline-block');
            $(this.ele).find('input[name=query]').val(data.query);
            $(this.ele).find('.advanced-search-box input[type=text]').each(function(i){
                $(this).val(data.advanced_query[i]);
            });
        }
        else{
            $(this.ele).find('.search-result-summary').hide();
            $(this.ele).find('input[name=query]').val('');
            $(this.ele).find('.advanced-search-box input[type=text]').val('');
        }
        return;
    }
});
