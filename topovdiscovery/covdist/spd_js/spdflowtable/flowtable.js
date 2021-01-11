var SpdFlowTable = CBMSFLOW.module('spdflowtable');

SpdFlowTable.FlowTable = CBMSFLOW.klass(SpdMap.RevertObject, {

    __init__: function(){
        this.map = undefined;
        this.container = $("#flow-table");
        this.table = $('#flow-table-value');
        this.table_container = $('.flow-table-value-container');
        this.table_tbody = $('#flow-table-value tbody');
        this.foot_table = $('#flow-table-foot');
        this.currentFlowCount = $('#flow-table-foot .flowcount .currentCount');
        this.totalFlowCount = $('#flow-table-foot .flowcount .totalCount');
        this.exportcsv = $('#flow-table-foot .exportcsv a');
        this.controller = $('#flow-table-foot .table-controller');

        this.dataSource = CBMSFLOW.environment('flowlistProxy');
        this.switchController('node');
        this.hc = 0;

        this.gridContainer = $('.flow-table-value-container');
        //this.gridContainer.width(this.container.width());
        this.sortedInfo = null;
        this.prevTableWidth = null;
        var adjwidth = this.gridContainer.width()-50-10-8; // no_index + scroll + scrollpadding;
        var adjwidth5 = parseInt(adjwidth*0.05);
        var adjwidth6 = parseInt(adjwidth*0.06);
        var adjwidth7 = parseInt(adjwidth*0.07);
        var adjwidth8 = parseInt(adjwidth*0.08);
        var adjwidth0 = adjwidth - 8*adjwidth8 - adjwidth7 - 3*adjwidth6 - adjwidth5;
        this.gridColumns = [
            {id: 'no_index', name: gettext('序号'), field: 'no_index', cssClass: 'no_index', headerCssClass: 'no_index', resizable: true, sortable: true, selectable: false, minWidth:50, width: 50},
            {id: 'node_a', name: gettext('节点A'), field: 'node_a', cssClass: '', headerCssClass: 'node', resizable: true, sortable: true, selectable: false, width: adjwidth7, formatter: Slick.Formatters.LongTextTipFormatter},
            {id: 'ip_a', name: gettext('地址A'), field: 'ip_a', cssClass: '', headerCssClass: 'ip', resizable: true, sortable: true, selectable: false, width: adjwidth7},
            {id: 'device_a', name: gettext('设备A'), field: 'device_a', cssClass: '', headerCssClass: 'device', resizable: true, sortable: true, selectable: false, width: adjwidth7, formatter: Slick.Formatters.LongTextTipFormatter},
            {id: 'port_a', name: gettext('端口A'), field: '_port_a', cssClass: '', headerCssClass: 'port_a', resizable: true, sortable: true, selectable: false, formatter: Slick.Formatters.PortWithIcon, width: adjwidth7},
            {id: 'node_b', name: gettext('节点B'), field: 'node_b', cssClass: '', headerCssClass: 'node', resizable: true, sortable: true, selectable: false, width: adjwidth7, formatter: Slick.Formatters.LongTextTipFormatter},
            {id: 'ip_b', name: gettext('地址B'), field: 'ip_b', cssClass: '', headerCssClass: 'ip', resizable: true, sortable: true, selectable: false, width: adjwidth7},
            {id: 'device_b', name: gettext('设备B'), field: 'device_b', cssClass: '', headerCssClass: 'device', resizable: true, sortable: true, selectable: false, width: adjwidth7, formatter: Slick.Formatters.LongTextTipFormatter},
            {id: 'port_b', name: gettext('端口B'), field: '_port_b', cssClass: '', headerCssClass: 'port_b', resizable: true, sortable: true, selectable: false, formatter: Slick.Formatters.PortWithIcon, width: adjwidth7},
            {id: 'bytes_a2b', name: gettext('A-B字节'), field: 'bytes_a2b', cssClass: 'byte', headerCssClass: 'byte', resizable: true, sortable: true, selectable: false, formatter: Slick.Formatters.NumberWithCommas, width:adjwidth6, defaultSortAsc:false},
            {id: 'bytes_b2a', name: gettext('B-A字节'), field: 'bytes_b2a', cssClass: 'byte', headerCssClass: 'byte', resizable: true, sortable: true, selectable: false, formatter: Slick.Formatters.ByteWithSpan, width:adjwidth6, defaultSortAsc:false},
            {id: 'bytes', name: gettext('总字节'), field: 'bytes', cssClass: 'byte', headerCssClass: 'bytes', resizable: true, sortable: true, selectable: false, formatter: Slick.Formatters.ByteWithSpan, width:adjwidth6, defaultSortAsc:false},
            {id: 'availability', name: gettext('可用性'), field: 'availability', cssClass: 'availability', headerCssClass: 'availability', resizable: true, sortable: true, selectable: false, width:adjwidth7},
            {id: 'connection_type', name: gettext('模式'), field: 'connection_type', cssClass: 'conn_type', headerCssClass: 'conn_type', resizable: true, sortable: true, selectable: false, width:adjwidth5},
            {id: 'tcp_tag', name: gettext('标志位'), field: 'tcp_tag', cssClass: 'tcp_tag', headerCssClass: 'tcp_tag', resizable: true, sortable: false, selectable: false, width:adjwidth0},
            {id: 'prot_stack', name: gettext('协议'), field: 'prot_stack', cssClass: 'prot_stack', headerCssClass: 'prot_stack', resizable: true, sortable: false, selectable: false, width:adjwidth8, formatter: function (r, c, v) {return v.join('; ')}}
        ];
        this.gridOptions = {
            editable: false,
            enableAddRow: false,
            enableCellNavigation: true,
            enableColumnReorder: false,
            rowHeight: 20,
            forceFitColumns: true,
        };
        this.dataView = new Slick.Data.DataView();
        this.dataView.getItemMetadata = function(row){
            if(row==undefined){
                return;
            }
            if(this.getItem(row).highlight){
                return {'cssClasses': 'highlight'};
            }
        };
        this.grid = new Slick.Grid(this.gridContainer, this.dataView, this.gridColumns, this.gridOptions);
        
        var self = this;
        var handleCSBScroll = function(){
            var mCSBContainerPos = self.gridContainer.find('.slick-viewport .mCSB_container').position();
            var scrollTop = -1 * mCSBContainerPos.top;
            var scrollLeft = -1 * mCSBContainerPos.left;
            self.grid.handleCSBScroll(scrollTop, scrollLeft);
        }
        this.gridContainer.find('.slick-viewport').addClass('grey-scrollbar').mCustomScrollbar({
            callbacks: {
                onScroll: function(){
                    handleCSBScroll();
                },
                whileScrolling: function(){
                    handleCSBScroll();
                }
            }
        });
        this._bindEvents();
        setTimeout(function () {
            self.updateTableScroll();
        }, 0);
    },

    _bindEvents: function(){
        var self = this;
        this.dataView.onRowCountChanged.subscribe(function (e, args) {
          self.grid.updateRowCount();
          self.grid.render();
        });

        this.dataView.onRowsChanged.subscribe(function (e, args) {
          self.grid.invalidateRows(args.rows);
          self.grid.render();
        });
        this.grid.onSort.subscribe(function(e, args){
            self._sortData(args.sortCol.field, args.sortAsc);
            self._scrollToTop();
        });
        this.gridContainer.bind('resize', $.proxy(this.handleResize, this));
        this.exportcsv.click(function(){
            self.exportCsv($.proxy(self.dataSource.getAllFlows, self.dataSource));
        });
    },

    handleResize: function(){
        this.grid.resizeCanvas();
        this.updateTableScroll();
    },

    _scrollToTop: function(){
        this.gridContainer.find('.slick-viewport').mCustomScrollbar('scrollTo', 'top');
                  
    },

    _sortData: function(field, sortAsc){
        var keyFuncs = {
            'ip_a': SpdMap.utils.ipText2Int,
            'ip_b': SpdMap.utils.ipText2Int
        };
        this.dataView.sort(function(a, b){
            var v1 = a[field];
            var v2 = b[field];
            if(field in keyFuncs){
                v1 = keyFuncs[field](v1);
                v2 = keyFuncs[field](v2);
            }else if(field == '_port_a' || field == '_port_b'){
                v1 = parseInt(v1.port);
                v2 = parseInt(v2.port);
            }
            var result = v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
            return sortAsc ? result : -result;
        });

        // remember last time sort information.
        this.sortedInfo = {
            field: field,
            sortAsc: sortAsc
        };
    },

    updateFlows: function(flows){
        this.dataView.beginUpdate();
        this.dataView.setItems(flows);
        this.dataView.endUpdate();
        this.updateTableScroll();

        if(this.sortedInfo){
            this._sortData(this.sortedInfo.field, this.sortedInfo.sortAsc);
        }
    },

    changeHistoryCode:function(){
        this.hc ++;
    },
    setMap: function(map){
        this.map = map;
    },

    newTableScroll: function(){
    },
    updateTableScroll: function(){
        this.gridContainer.find('.slick-viewport').mCustomScrollbar("update");
    },
    destroyTableScroll: function(){
    },
    getAllFlows: function(){
        this.highlightFlow($.proxy(this.dataSource.getAllFlows, this.dataSource), [], {'exclude' : this.map.getUnvisibleIpPorts()});
    },
    renderTable: function(data) {
        // {currentCount: 25, totalCount: 1015, flows: Array[25]}
        var flows = data['flows'];
        //$.extend(true, flows, data['flows']);
        var currentCount = data['currentCount'];
        var totalCount = data['totalCount'];
        this.clearTable();
        this.padTable(flows, currentCount, totalCount);
        this.updateTableScroll();
        this._scrollToTop();
        this.data = data;
        if(this.isLocked('init')){
            this.changed('render');
        }
        else{
            this.changed('init');
            this.getLock('init');
        }
    },
    getHistoryData:function(){
        /*
        return {
            'data':this.data,
            'controller':this.controller_name
        };
        */
    },
    loadHistoryData:function(data){
        /*
        this.renderTable(data.data);
        this.switchController(data.controller);
         */
    },

    clearTable: function() {
        this.table_tbody.empty();
        this.table.trigger("update");
    },

    padTable: function(flows, currentCount, totalCount){
        var self = this;
        var currentCount = currentCount || flows.length;
        var totalCount = totalCount || flows.length;
        self.addFlowsInfo(flows);
        self.updateFlows(flows);
        self.grid.invalidate();
        self.grid.render();
        self.setFlowCount(currentCount, totalCount);
    },

    addFlowsInfo: function(flows){
        var connection_type_map = {
            "S": gettext("同步"),
            "A": gettext("异步")
        };
        var self = this;
        var nodeCache = {};
        $.each(flows, function(flow_index, flow){
            flow['id'] = flow_index+flow['ip_a']+flow['port_a'];
            flow['no_index'] = flow_index + 1;
            flow['connection_type'] = connection_type_map[flow['conn_type']];

            var nodeA = nodeCache[flow.ip_a];
            if(!nodeA){
                nodeA = self.getNode([flow.ip_a]);
                nodeCache[flow.ip_a] = nodeA;
            }
            var nodeB = nodeCache[flow.ip_b];
            if(!nodeB){
                nodeB = self.getNode([flow.ip_b]);
                nodeCache[flow.ip_b] = nodeB;
            }
            //flow['nodeNameA'] = nodeA.raw ? '' : nodeA.name;
            //flow['nodeNameB'] = nodeB.raw ? '' : nodeB.name;
            flow['node_a'] = nodeA.raw ? '' : nodeA.name;
            flow['node_b'] = nodeB.raw ? '' : nodeB.name;

            flow['addrA'] = {
                'isServer': false,
                'isClient': false
            };
            flow['addrB'] = {
                'isServer': false,
                'isClient': false
            };
            flow['_port_a'] = {
                'port': flow['port_a'],
                'c_or_s': undefined
            };
            flow['_port_b'] = {
                'port': flow['port_b'],
                'c_or_s': undefined
            };
            if(nodeA.isInServers(flow.ip_a, flow.port_a)){
                flow.addrA.isServer = true;
                flow.addrB.isClient = true;
                flow._port_a.c_or_s = 's';
                flow._port_b.c_or_s = 'c';
            }
            if(nodeB.isInServers(flow.ip_b, flow.port_b)){
                flow.addrA.isClient = true;
                flow.addrB.isServer = true;
                flow._port_a.c_or_s = 'c';
                flow._port_b.c_or_s = 's';
            }
        });
        nodeCache = null;
    },

    markFlowCS: function(node) {
        var self = this;
        var flows = this.data.flows;
        for(var i=0, flowCount = flows.length; i < flowCount; i++){
            var flow = flows[i];
            var ip_port_a_server = node.isInServers(flow.ip_a, flow.port_a);
            if(ip_port_a_server){
                flow.addrA.isServer = true;
                flow.addrA.isClient = false;
                flow.addrB.isServer = false;
                flow.addrB.isClient = true;
                flow._port_a.c_or_s = 's';
                flow._port_b.c_or_s = 'c';
            }else if(!flow.addrB.isServer){
                flow.addrA.isServer = false;
                flow.addrA.isClient = false;
                flow.addrB.isServer = false;
                flow.addrB.isClient = false;
                flow._port_a.c_or_s = undefined;
                flow._port_b.c_or_s = undefined;
            }
        }
        self.updateFlows(flows);
        self.grid.invalidate();
        self.grid.render();
    },

    renameNodeA: function(newName) {
        var self = this;
        var flows = this.data.flows;
        for(var i=0, flowCount = flows.length; i < flowCount; i++){
            var flow = flows[i];
            flow.node_a = newName;
        }
        self.updateFlows(flows);
        self.grid.invalidate();
        self.grid.render();
        this.changeHistoryCode();
        this.changed('rename');
    },

    setFlowCount: function(currentCount, allCount) {
        this.currentFlowCount.text(currentCount);
        this.totalFlowCount.text(allCount);
    },

    exportCsv: function(callback) {
        var _export = function(data) {
            var topovmap = CBMSFLOW.environment()['topovmap'];
            var name = '';
            if(topovmap.getSelectNode()){
                var type = 'node';
                name = topovmap.getSelectNode().name;
            }
            else if(topovmap.getSelectEdge()){
                var type = 'edge';
                name = topovmap.getSelectEdge().nodeA.name + '_' + topovmap.getSelectEdge().nodeB.name;
            }
            else{
                var type = 'map';
                name = CBMSFLOW.environment()['map_name'];
            }
            var url = CBMSFLOW.util.format_spd_i18n_url('/exportcsv/');
            var flows = JSON.stringify(data['flows']);
            var taken = $.cookie("csrftoken");
            var form = $('<form method="POST" action="' + url + '">');
            form.append($("<input type='hidden' name='flows' value='" + flows + "'>"));
            form.append($('<input type="hidden" name="name" value="' + name + '">'));
            form.append($('<input type="hidden" name="type" value="' + type + '">'));
            form.append($('<input type="hidden" name="csrfmiddlewaretoken" value="' + taken + '">'));
            $('body').append(form);
            form.submit();
        };
        callback(this.map.match||{}, _export);
    },

    getNode: function(ipport){
        var result = undefined;
        var self = this;
        $.each(this.map.nodes, function(i, node){
            if(node.hasIpport(ipport)){
                result = node;
                return false;
            }
        });
        return result;
    },
    getNodeName: function(ipport){
        var node = this.getNode(ipport);
        if(node){
            return node.name;
        }else{
            return '';
        }
    },
    enableFootTable: function(){
        this.foot_table.find('.foot-action').removeClass('foot-action-disable');
    },
    disableFootTable: function(){
        this.foot_table.find('.foot-action').addClass('foot-action-disable');
    },
    show:function(){
        var args = $.makeArray(arguments);
        if(args.length >= 3){
            this.container.effect(args[0],args[1],args[2],args[3]);
        }
        else{
            this.container.show();
        }
    },
    hide:function(){
        var args = $.makeArray(arguments);
        if(args.length >= 3){
            this.container.hide(args[0],args[1],args[2],args[3]);
        }
        else{
            this.container.hide();
        }

    },
    toggle:function(){
        var args = $.makeArray(arguments);
        if(args.length >= 3){
            this.container.toggle(args[0],args[1],args[2],args[3]);
        }
        else{
            this.container.toggle();
        }
    },

    clearHightlight: function() {
        this.table_tbody.find('.highlight').removeClass('highlight');
        var data = this.data || {};
        $.each(data['flows'] || [], function(i, flow) {
            flow['highlight'] = '';
        });
    },
    clearSearchResult: function(){
        this.clearHightlight();
        this.changed("search.clear");
    },
    highlightFlow: function(callback, match_query, data) {
        var self = this;

        // var match_ipport = function(ip, port, ip_match, port_match) {
        //     return (ip_match == '*' || ip == ip_match) && (port_match == '*' || port == port_match);
        // };

        var is_match = function(flow, query) {
            if(query.length == 3){
                //reuse the match function in flowlist
                // var result = SpdMap.FlowList.prototype.matchWildcardIpportPair(flow, [query[0]['ip'], query[0]['port']], [query[1]['ip'], query[1]['port']]);
                // return result != null;


                return (query[0].ip === null || (query[0].ip && flow.ip_a.indexOf(query[0].ip) > -1)) &&
                (query[1].ip === null || (query[1].ip && flow.ip_b.indexOf(query[1].ip) > -1)) &&
                (query[0].port === null || (query[0].port && flow.port_a === query[0].port)) &&
                (query[1].port === null || (query[1].port && flow.port_b === query[1].port)) &&
                // 支持搜索组件名
                (query[0].device === null || (query[0].device && (flow.node_a.indexOf(query[0].device) > -1 ||
                                                                    flow.device_a.indexOf(query[0].device) > -1) )) &&
                (query[1].device === null || (query[1].device && (flow.node_b.indexOf(query[1].device) > -1 ||
                                                                    flow.device_b.indexOf(query[1].device) > -1) )) &&
                (query[2].prot === null || (query[2].prot &&  (flow.prot_stack.some(function(prot) {return prot.indexOf(query[2].prot) > -1}))));


            }
            return false;
        };

        var _hightlight = function(data) {

            self.clearHightlight();
            $.each(data['flows'], function(i, flow) {
                if (is_match(flow, match_query)) {
                    flow['highlight'] = 'highlight';
                } else {
                    flow['highlight'] = '';
                }
            });
            self.renderTable(data);
        };

        if (callback) {
            data = data||{};
            callback(data, _hightlight);
        }
    },
    switchController:function(name){
        this.controller_name = name;
        this.controller.hide();
        this.controller.filter("[name='"+name+"']").show();
    },
    __bindEvent:function($super,event_name,event_func){
        $super(event_name,event_func);
        var _this = this;
        var event_name_l = event_name.split(".");
        if(event_name_l.length === 3 && event_name_l[2] == 'click'){
            var c_name = event_name_l[0];
            var a_name = event_name_l[1];
            this.controller.filter("[name='"+c_name+"']").find(".flowtable-a-simple[name='"+a_name+"']").click(function(e){
                _this.trigger(event_name, e);
            });
        }
    }
});



SpdFlowTable.SplitNodeFlowTable = CBMSFLOW.klass(SpdFlowTable.FlowTable, {
    __init__: function($super){
        $super();
        this.selectedNode = null;
        this.dragger = null;
        //this.bindSelectEvents();
        this.splits = [];
    },
    renderTable: function($super, data){
        $super(data);
        this.loadingFlows = false;
        this.splits = [];
    },
    highlightFlow: function($super, callback, match_query, data) {
        this.loadingFlows = true;
        $super(callback, match_query, data);
    },
    setSelectedNode: function(node){
        this.selectedNode = node;
        this.dragger = new SpdMap.NodeSplitDragger(this.map, node, $.proxy(this.getSelectIpPorts, this), $.proxy(this.splitedHandler, this));
    },
    clearSelectedNode: function(){
        this.selectedNode = null;
    },
    bindSelectEvents: function(){
        var self = this;
        this.table_tbody.find('.flow-table-port-a').live('click', function(){
            if(self.selectedNode == null || self.loadingFlows){
                return false;
            }
            self.table_tbody.find('.flow-table-ip-a.mark').removeClass('mark');
            var port_text = $(this).text();
            self.table_tbody.find('.flow-table-port-a').each(function(){
                if($(this).text() == port_text){
                    if($(this).hasClass('mark')){
                        $(this).removeClass('mark');
                        self.dragger.unbindDrag($(this))
                    }else{
                        $(this).addClass('mark');
                        self.dragger.bindDrag($(this))
                    }
                }
            });
        });
        this.table_tbody.find('.flow-table-ip-a').live('click', function(){
            if(self.selectedNode == null || self.loadingFlows){
                return false;
            }
            self.table_tbody.find('.flow-table-port-a.mark').removeClass('mark');
            var ipaddr = $(this).text();
            self.table_tbody.find('.flow-table-ip-a').each(function(){
                if($(this).text() == ipaddr){
                    if($(this).hasClass('mark')){
                        $(this).removeClass('mark');
                        self.dragger.unbindDrag($(this));
                    }else{
                        $(this).addClass('mark');
                        self.dragger.bindDrag($(this));
                    }
                }
            });
        });
    },
    getSelectIpPorts: function(){
        var result = {'ipports': [], 'type': null};

        var allSelectedRows = null;
        var allSelectedIps = this.table_tbody.find('.flow-table-ip-a.mark');
        var allSelectedPorts = this.table_tbody.find('.flow-table-port-a.mark');
        if(allSelectedIps.length > 0){
            result['type'] = 'ip';
            if(this.table_tbody.find('.flow-table-ip-a:not(.mark)').length > 0){
                result['selectedAll'] = false;
            }else{
                result['selectedAll'] = true;
            }
            var allSelectedRows = allSelectedIps.parents('tr');
        }else if(allSelectedPorts.length > 0){
            result['type'] = 'port';
            if(this.table_tbody.find('.flow-table-port-a:not(.mark)').length > 0){
                result['selectedAll'] = false;
            }else{
                result['selectedAll'] = true;
            }
            var allSelectedRows = allSelectedPorts.parents('tr');
        }
        if(allSelectedRows){
            allSelectedRows.each(function(){
                var ip = $(this).find('.flow-table-ip-a').text();
                var port = $(this).find('.flow-table-port-a').text();
                result['ipports'].push([ip, port]);
            });
        }
        return result;
    },
    splitedHandler: function(){
        var _this = this;
        this.table_tbody.find('.flow-table-ip-a.mark').parents('tr').each(function(){
            _this.splits.push($(this).attr('index'));
            $(this).remove();
        });
        this.table_tbody.find('.flow-table-port-a.mark').parents('tr').each(function(){
            _this.splits.push($(this).attr('index'));
            $(this).remove();
        });

        var currentCount = 0;
        this.table_tbody.find('tr').each(function(i){
            currentCount = i + 1;
            $(this).find('.first-td').text(currentCount);
        });
        this.currentFlowCount.text(currentCount);
        this.changed('split');
    }
});


SpdFlowTable.Table = CBMSFLOW.klass({
    fields:[],
    __init__:function(container){
        if(typeof container == 'string'){
            container = $(container);
        }
        this.container = container;
        this._build();
    },
    _build:function(){
        this.table = $("<table></table>").appendTo(this.container);
        this.thead = $("<thead></thead>").appendTo(this.table);
        this.tbody = $("<tbody></tbody>").appendTo(this.table);
        this.controller = this.container.find('.table-controller');
        this.newTableScroll();
    },
    empty:function(){
        this.tbody.empty();
    },
    addRow:function(data){
        var row = $("<tr></tr>").appendTo(this.tbody);
        for(var i in this.fields){
            var field = this.fields[i];
            var value = data[field];
            row.append("<td>"+value+"</td>");
        }
        return row;
    },
    render:function(datas){
        datas = datas || [];
        for(var i in datas){
            var data = datas[i];
            this.addRow(data);
        }
        this.updateTableScroll();
    },
    show:function(){
        var args = $.makeArray(arguments);
        if(args.length >= 3){
            this.container.show(args[0],args[1],args[2],args[3]);
        }
        else{
            this.container.show();
        }
    },
    hide:function(){
        var args = $.makeArray(arguments);
        if(args.length >= 3){
            this.container.hide(args[0],args[1],args[2],args[3]);
        }
        else{
            this.container.hide();
        }
    },
    toggle:function(){
        var args = $.makeArray(arguments);
        if(args.length >= 3){
            this.container.toggle(args[0],args[1],args[2],args[3]);
        }
        else{
            this.container.toggle();
        }
    },
    newTableScroll: function(){
        this.table.parent().mCustomScrollbar({});
    },
    updateTableScroll: function(){
        this.table.parent().mCustomScrollbar("update");
    },
    __bindEvent:function($super,event_name,event_func){
        $super(event_name,event_func);
        var _this = this;
        var event_name_l = event_name.split(".");
        if(event_name_l.length === 3 && event_name_l[2] == 'click'){
            var c_name = event_name_l[0];
            var a_name = event_name_l[1];
            this.controller.filter("[name='"+c_name+"']").find(".flowtable-a-simple[name='"+a_name+"']").click(function(e){
                _this.trigger(event_name, e);
            });
        }
    }
});



SpdFlowTable.NodeTable = CBMSFLOW.klass(SpdFlowTable.Table, {
    fields:['seqn','name'],
    nodeCenterOffset: {'left': 15, 'top': 15},

    NODE_ROWS_TEMPLATES :
        "<% _.each(data, function(row, seq) { %> "
        +"<tr class='hidebox-node-row <%=row.extra_class%>' node_name=<%=row.name%>>"
        +"    <td class='cell-seqn'><span class='node-table-value'><%=seq+1%></span></td>"
        +"    <td class='cell-name'><span class='node-table-value'><%=row.name%></span></td>"
        +"    <td></td>"
        +"</tr>"
        +" <% }); %>",

    __init__:function($super, container){
        $super(container);
        this._enable_drags = {};
        this.hide();
    },
    _build:function(){
        this.table_title = this.container.find('.table-title');
        this.table_value = this.container.find('.table-value');

        this.newTableScroll();
        this._enableTableSort();
    },

    newTableScroll: function(){
        this.table_value.parent().mCustomScrollbar({});
    },
    updateTableScroll: function(){
        this.table_value.parent().mCustomScrollbar("update");
    },

    render:function(datas){
        var datas = datas || [];
        var html = _.template(this.NODE_ROWS_TEMPLATES, {data: datas});
        this.table_value.find('tbody').html(html);
        this.table_value.trigger('update');
        this._bindEvents();
        this.updateTableScroll();
        $(window).trigger('resize');
    },

    loads:function(nodes){
        var datas = [];
        var seq = 0;
        for(var i in nodes){
            var node = nodes[i];
            datas.push({
                'name':node.name,
                'extra_class':node.isHighlight ? 'yellow' : ''
            });
        }
        this.empty();
        this.render(datas);
    },

    empty:function($super){
        this.table_value.find('tbody tr td:eq(1) span').draggable("destroy");
        this.table_value.find('tbody').empty();
    },

    getDragHelper: function(event){
        var helperElem = $(''+
            '<div class="node-spliter">'+
                '<div class="node" style="width:30px;height:30px;"></div>'+
            '</div>'
        );
        return helperElem;
    },

    _bindEvents:function(){
        var self = this;

        this.table_value.find('tbody tr td.cell-name span').each(function(index, item){
            $(item).addClass('td-draggable').draggable({
                zIndex: 1000,
                appendTo: "body",
                cursor: "pointer",
                cursorAt: self.nodeCenterOffset,
                helper: $.proxy(self.getDragHelper, self),
                containment:'window',
                revert:function(){
                    var node_name = $(this).parents('tr').attr('node_name');
                    return self._enable_drags[node_name] === false;

                },
                start: function(event, ui){
                    var node_name = $(this).parents('tr').attr('node_name');
                    self._enable_drags[node_name] = self.trigger('dragnode.start', event, ui, node_name);

                },
                drag: function(event, ui){
                    var node_name = $(this).parents('tr').attr('node_name');
                    self.trigger('dragnode.move', event, ui, node_name);
                    self._enable_drags[node_name] = self.trigger('dragnode.confirm', event, ui, node_name);
                    if(self._enable_drags[node_name] !== false){
                        $(ui.helper).find('.node').removeClass('invalid-pos');
                    }else{
                        $(ui.helper).find('.node').addClass('invalid-pos');
                    }

                },
                stop: function(event, ui) {
                    var node_name = $(this).parents('tr').attr('node_name');
                    if(self._enable_drags[node_name] !== false){
                        var trigger_result = self.trigger('dragnode.submit', event, ui, node_name);
                        if(trigger_result !== false){
                            $(this).draggable("destroy");
                            $(this).parents('tr').remove();
                        }
                    }
                    else{
                        self.trigger('dragnode.cancel', event, ui, node_name);
                    }
                    self.trigger('dragnode.stop', event, ui, node_name);
                }
            });
        });
    },

    _enableTableSort : function(){
        var table_title = this.container.find('.table-title');
        var table_value = this.container.find('.table-value');

        table_value.tablesorter({
            headers:{
                0:{sorter: "digit"},
                1:{sorter: "text"}
            }
        });

        table_title.delegate('.sort-icon', 'click', function(){
            var self = $(this);
            var sort_field = _.find(self.parent().attr("class").split(/\s+/), function(item){ return item.indexOf('cell-') == 0;});
            sort_field = sort_field.slice(sort_field.indexOf('cell-') +5);
            var sort_index = self.parents('tr').find('td').index(self.parent());
            if(self.hasClass('sort-auto')){
                sort_by = 'sort-up';
            }
            else if(self.hasClass('sort-down')){
                sort_by = 'sort-up';
            }
            else if(self.hasClass('sort-up')){
                sort_by = 'sort-down';
            }
            table_title.find('.sort-down').removeClass('sort-down').addClass('sort-auto');
            table_title.find('.sort-up').removeClass('sort-up').addClass('sort-auto');
            self.addClass(sort_by).removeClass('sort-auto');
            var sort_order = sort_by == 'sort-up' ? 0 : 1;
            table_value.trigger("sorton",[[[sort_index, sort_order]]]); 
        });
    },

    _clearSort : function(){
        var table_title = this.$container.find('.table-title');
        table_title.find('.sort-icon').removeClass('sort-up').removeClass('sort-donw').addClass('sort-auto');
    }

});


/* Manage Which Tab should show in different situation */

SpdFlowTable.TablePanel = CBMSFLOW.klass(SpdMap.RevertObject, {
    MODES : {
        'default' : ['flow-table'],
        'node' : ['flow-table', 'node-definition', 'interface-definition'],
        'hideBox' : ['flow-table', 'node-table'],
        'combined': ['flow-table', 'combing-table'],
    },

    __init__:function(container){
        this.container = container;
        this._bindEvents();
        this.switchMode('default');
        this.mode = 'default';
        this.tab = null;
        this.render();
    },

    switchMode : function(mode){
        this.mode = mode;
        this.tab = null;
        this.render();
        this.changed('mode');
    },

    switchToTab: function(tab) {
        var _this = this;
        var target = $('#' + tab);
        var ele = _this.container.find('li[target=' + tab + ']');
        target.show().siblings(':not(.flow-table-nav,.ui-resizable-handle)').hide();
        target.trigger('show');
        ele.addClass('active').siblings().removeClass('active');
        
        if ( tab === "flow-table" && CBMSFLOW.environment('topovmap')) {
            var map = CBMSFLOW.environment('topovmap');
            map.flowTable.updateFlows([]);
            setTimeout(function () {
                map.flowTable.updateFlows(map.flowTable.data.flows);
            }, 66);
        }
    },

    render : function(){
        var mode = this.mode;
        var tab = this.tab;
        var showTabs = this.MODES[mode];
        var _this = this;
        _this.container.find('li').hide().removeClass('active');
        _.each(showTabs, function(item){
            _this.container.find('li[target=' + item + ']').show();
        });

        if(tab == null){
            tab = showTabs[0];
        }

        this.switchToTab(tab);
    },

    _bindEvents : function(){
        var self = this;
        this.container.find('li').click(function(e) {
            var tab = $(this).attr('target');
            self.switchToTab(tab);
            self.changed('tab');
        });
    },

    getHistoryData:function(){
        var data =  {
            'mode':this.mode,
            'tab':this.container.find('li.active').attr('target')
        };
        return data;
    },

    loadHistoryData:function(data){
        this.mode = data.mode;
        this.tab = data.tab;
        this.render();
    }
});
