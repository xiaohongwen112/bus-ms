var SpdMap = CBMSFLOW.module('spdmap');
var KEYBOARD_ENTER = 13;

var SessionRowTemplate =
    "<% _.each(flows, function(flow) { %> "
    +"<tr class='session-row'>"
    +"    <td class='ip'><span><%=flow.ip_a%></span></td>"
    +"    <td class='device'><span><%=flow.device_a%></span></td>"
    +"    <td class='port'><span><%=flow.port_a%></span></td>"
    +"    <td class='flowcount'><span><%=flow.flowcount%></span></td>"
    +"    <td class='bytecount'><span><%=flow.bytes_a2b%></span></td>"
    +"</tr>"
    +" <% }); %>";

var ServerGroupTemplate =
    "<div class='server-group'>"
    +"    <div class='group-title'>"
    +"        <div class='line'>"
    +"            <span class='group-name'><%=group%></span>"
    +"            <input type='text' class='hide' id='group-name' name='group-name' value='<%=group%>'/>"
    +"            <span class='spd-icon spd-icon-trash delete right'></span>"
    +"            <span class='spd-icon spd-icon-rename rename right'></span>"
    +"        </div>"
    +"    </div>"
    +"    <div class='group-body'>"
    +"        <table>"
    +"            <tbody>"
    +"                <tr>"
    +"                   <td class='ip-device'>"
    +"                      <ul>"
    +"                          <% _.each(servers.ips, function(ip) { %> "
    +"                          <li>"
    +"                              <span class='ip <%=ip.extra_class%>'><%=ip.ip%></span>"
    +"                              <span class='device'><%=ip.device%></span>"
    +"                              <span class='delete spd-icon spd-icon-delete hide'></span>"
    +"                          </li>"
    +"                          <% }); %>"
    +"                      </ul>"
    +"                   </td>"
    +"                   <td class='ports'>"
    +"                      <ul>"
    +"                      <% _.each(servers.ports, function(port) { %> "
    +"                          <li>"
    +"                              <span class='port <%=port.extra_class%>'><%=port.port%></span>"
    +"                              <span class='delete spd-icon spd-icon-delete hide'></span>"
    +"                          </li>"
    +"                      <% }); %>"
    +"                      </ul>"
    +"                   </td>"
    +"                </tr>"
    +"            </tbody>"
    +"        </table>"
    +"    </div>"
    +"</div>";

var ClientRowTemplate =
    "<% _.each(clients, function(client) { %>"
    +"<tr>"
    +"    <td class='ip <%=client.extra_class%>'><%=client.ip%></td>"
    +"    <td class='device'><%=client.device%></td>"
    +"</tr>"
    +"<% }); %>";


var SessionsTable = CBMSFLOW.klass({

    __init__: function(intfConfig) {
        this.$table = intfConfig.$sessionTable;
        this.$tableBody = this.$table.find('.body');
        this.intfConfig = intfConfig;

        this.needRefresh = true;
        this.sortedInfo = null;

        this.prevTableWidth = null;
        this.tablePaddingWidth = 15;
        this.sessionTitleHeight = 30;
        this.scrollbarWidth = 15;

        this.columns = [
            {id: 'ip_a', name: gettext('地址A'), field: 'ip_a', cssClass: 'ip', headerCssClass: 'ip', resizable: false, sortable: true, selectable: false, minWidth:100, width: 100},
            {id: 'device_a', name: gettext('设备A'), field: 'device_a', cssClass: 'device', headerCssClass: 'device', resizable: false, sortable: true, selectable: false, formatter: Slick.Formatters.LongTextTipFormatter},
            {id: 'port_a', name: gettext('端口A'), field: 'port_a', cssClass: 'port', headerCssClass: 'port', resizable: false, sortable: true, selectable: false, minWidth: 50, width: 50},
            {id: 'flowcount', name: gettext('会话数'), field: 'flowcount', cssClass: 'flowcount', headerCssClass: 'flowcount', resizable: false, sortable: true, selectable: false, formatter: Slick.Formatters.NumberWithCommas, defaultSortAsc: false},
            {id: 'bytecount', name: gettext('总字节'), field: 'bytes_a2b', cssClass: 'bytecount', headerCssClass: 'bytecount', resizable: false, sortable: true, selectable: false, formatter: Slick.Formatters.NumberWithCommas, defaultSortAsc: false}
        ];
        this.options = {
            editable: false,
            enableAddRow: false,
            enableCellNavigation: true,
            enableColumnReorder: false,
            rowHeight: 20
        };

        this.dataView = new Slick.Data.DataView();
        this.grid = new Slick.Grid(this.$tableBody, this.dataView, this.columns, this.options);

        var self = this;
        var handleCSBScroll = function(){
            var mCSBContainerPos = self.$table.find('.slick-viewport .mCSB_container').position();
            var scrollTop = -1 * mCSBContainerPos.top;
            var scrollLeft = -1 * mCSBContainerPos.left;
            self.grid.handleCSBScroll(scrollTop, scrollLeft);
        }
        this.$table.find('.slick-viewport').addClass('grey-scrollbar').mCustomScrollbar({
            callbacks: {
                onScroll: function(){
                    handleCSBScroll();
                },
                whileScrolling: function(){
                    handleCSBScroll();
                }
            }
        });

        this._init();
    },

    _init: function() {
        this._bindEvents();
        this.updateFlows();
    },

    updateFlows: function(needRefresh){
        this.needRefresh = needRefresh === undefined ? true : false;

        var flows = this.intfConfig.getUnClassifyFlows();

        this.dataView.beginUpdate();
        this.dataView.setItems(flows);
        this.dataView.endUpdate();
        this.grid.resizeCanvas();
        if(this.needRefresh){
            if(this.sortedInfo && this.sortedInfo.field == 'flowcount' && this.sortedInfo.sortAsc == false){
                this._sortData(this.sortedInfo.field, this.sortedInfo.sortAsc);
            }else{
                this.$table.find('.slick-header .slick-header-column.flowcount .slick-sort-indicator').trigger('click');
            }
        }else if(this.sortedInfo){
            this._sortData(this.sortedInfo.field, this.sortedInfo.sortAsc);
        }
        this.$table.find('.mCustomScrollbar').mCustomScrollbar("update");
    },

    _sortData: function(field, sortAsc){
        var keyFuncs = {
            'ip_a': SpdMap.utils.ipText2Int,
            'port_a': parseInt
        };
        this.dataView.sort(function(a, b){
            var v1 = a[field];
            var v2 = b[field];
            if(field in keyFuncs){
                v1 = keyFuncs[field](v1);
                v2 = keyFuncs[field](v2);
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

    _bindEvents: function() {
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
            self.$table.find('.mCustomScrollbar').mCustomScrollbar('scrollTo', 'top');
        });

        this.$tableBody.find('.slick-row').die('mouseover').live('mouseover', function(){
            if(!$(this).data('initDrag')){
                $(this).draggable({
                    containment: "#flow-table-block",
                    appendTo: self.$table,
                    helper: function(){
                        var h =  $("<div class='drag-helper' style='z-index:200;width:415px;'><table><tbody></tbody></table></div>");
                        var row = _.template(SessionRowTemplate , {'flows': [{
                            'ip_a': $(this).find('.ip').text(),
                            'device_a': $(this).find('.device').text(),
                            'port_a': $(this).find('.port').text(),
                            'flowcount': $(this).find('.flowcount').text(),
                            'bytes_a2b': $(this).find('.bytecount').text()
                        }]});
                        h.find('tbody').append(row);
                        return h;
                    },
                    revert: "invalid",
                    cursor: "move",
                    destory: function(e, ui){
                        $(this).removeClass('dragging');
                    },
                    start: function(e, ui){
                        self.intfConfig.$serverTable.find('input[name=group-name]:visible').trigger('blur');
                        $(this).addClass("dragging");
                    },
                    drag: function(e, ui){
                        $(this).trigger('dragging.for.drop', [ui]);
                    },
                    stop: function(e, ui){
                        $(this).removeClass('dragging');
                    }
                });
                $(this).data('initDrag', true);
            }
        });
    },

    resizeContent: function(){
        this.grid.resizeCanvas();
        this.updateColumnsWidth();
        this.$table.find('.mCustomScrollbar').mCustomScrollbar("update");
    },

    resize: function(newWidth){
        var sessionHeight = $('#interface-definition').height();

        this.$table.width(newWidth);
        this.$tableBody.width(newWidth - this.tablePaddingWidth);
        this.$tableBody.height(sessionHeight - this.sessionTitleHeight);
    },

    show: function(){
        if(this.needRefresh){
            this.grid.resizeCanvas();
            //this.grid.scrollRowIntoView(0);
            this.$table.find('.mCustomScrollbar').mCustomScrollbar("update");
            this.$table.find('.mCustomScrollbar').mCustomScrollbar("scrollTo","top");

            this.needRefresh = false;
        }
        this.updateColumnsWidth();
    },

    updateColumnsWidth: function(){
        var tableWidth = this.$table.width();
        if(this.prevTableWidth == null || this.prevTableWidth != tableWidth){
            var widthExcludeIpPort = tableWidth-this.tablePaddingWidth-this.scrollbarWidth-100-50;
            var deviceWidth = parseInt(widthExcludeIpPort * 0.4);
            var flowcountWidth = parseInt(widthExcludeIpPort * 0.25);
            var bytecountWidth = parseInt(widthExcludeIpPort * 0.3);
            var columns = this.grid.getColumns();
            for(var i=0, len=columns.length; i < len; i++){
                var column = columns[i];
                var field = column.field;
                if(field == 'device_a'){
                    column.width = deviceWidth;
                }else if(field == 'flowcount'){
                    column.width = flowcountWidth;
                }else if(field == 'bytes_a2b'){
                    column.width = bytecountWidth;
                }
            }
            this.grid.setColumns(columns);
            this.prevTableWidth = tableWidth;
        }
    },

    clear: function() {
    }

});

var ServerTable = CBMSFLOW.klass({
    __init__: function(groupTable, server) {
        this.groupTable = groupTable;
        this.intfConfig = groupTable.intfConfig;
        this.server = server;
        this._init();
    },

    _init: function() {
        this._loadServers();
        this._bindEvents();
    },
    _loadServers: function() {
        var ips = _.sortBy(this.server.ipports.ips, SpdMap.utils.ipText2Int);
        var ports = _.sortBy(this.server.ipports.ports, function(port){
            return parseInt(port, 10);
        });
        var ipDeviceMap = this.intfConfig.ipDeviceMap || {};
        var flows = this.intfConfig.flows || [];
        var flow_pairs = _.pairs(this.intfConfig.flows);
        var search_ipports = this.intfConfig.getSearchResultIpports();
        var match_ports = [];

        var newIps = _.map(ips, function(ip) {
            var extra_class = [];
            if(!_.some(flow_pairs, function(flow_pair){
                if(flow_pair[1]['ip_a'] == ip && _.contains(ports, flow_pair[1]['port_a'])){
                    return flow_pair[1]['flowcount'] > 0;
                }
                return false;
            })) extra_class.push('red');

            /*
            if(_.some(ports, function(port){
               if(!search_ipports[ip]) return false;
               if(_.contains(search_ipports[ip]['ports'], port)){
                   match_ports.push(port);
                   return true;
               }
               return false;
            })) extra_class.push('yellow');
            */

            if (ip in ipDeviceMap) {
                return {'ip': ip, 'device': ipDeviceMap[ip], 'extra_class':extra_class.join(' ')};
            } else {
                return {'ip': ip, 'extra_class':extra_class.join(' ')};
            }}
        );
        var newPorts = _.map(ports, function(port){
            var extra_class = [];
            if(!_.some(flow_pairs, function(flow_pair){
                if(flow_pair[1]['port_a'] == port && _.contains(ips, flow_pair[1]['ip_a'])){
                    return flow_pair[1]['flowcount'] > 0;
                }
                return false;
            })) extra_class.push('red');
            //if(_.contains(match_ports, port)) extra_class.push('yellow');
            return {'port': port, 'extra_class': extra_class.join(' ')};
        });
        this._serverHtml = $(_.template(ServerGroupTemplate, {'group': this.server.group, 'servers': {'ips': newIps, 'ports': newPorts}}));
        this._serverHtml.find('input[name=group-name]').attr('id', Math.round((Math.random()*10000))).messagepop({'trigger':'manual', 'container': '#interface-definition .server', 'zindex':null});
    },

    _bindEvents: function() {
        var $groupDelete = this._serverHtml.find('.group-title .delete');
        var $groupRename = this._serverHtml.find('.group-title .rename');
        var $ipTd = this._serverHtml.find('.group-body .ip-device');
        var $portTd = this._serverHtml.find('.group-body .ports');
        var $ipDelete = $ipTd.find('.delete');
        var $portDelete =  $portTd.find('.delete');
        var $nameInput = this._serverHtml.find('input[name=group-name]');

        $groupDelete.unbind('click').click($.proxy(this._deleteGroup, this));
        $groupRename.unbind('click').click($.proxy(this._renameGroup, this));
        $nameInput.unbind('blur').blur($.proxy(this._renameGroupBlur, this));
        $nameInput.unbind('keypress').keypress($.proxy(this._renameGroupKeypress, this));
        $ipDelete.unbind('click').click($.proxy(this._deleteIp, this));
        $portDelete.unbind('click').click($.proxy(this._deletePort, this));

        var $groupBody = this._serverHtml.find('.group-body');
        var self = this;
        var groupBodyItemHeight = 20;
        var serverTitleHeight = 30;
        var groupTitleHeight = 34;
        this._serverHtml.droppable({
            tolerance: "pointer",
            accept: '.slick-row',
            over: function(e, ui){
                // cleanup siblings server-groups
                var $otherServers = $(this).siblings('.draggable-over');
                $otherServers.find('.ip-device li.dragging').remove();
                $otherServers.find('.ports li.dragging').remove();
                $otherServers.removeClass('draggable-over');

                $(this).addClass('draggable-over');
                ui.draggable.unbind('dragging.for.drop').bind('dragging.for.drop', function(e, ui){
                    var draggable = $(this);
                    var sessionIp = draggable.find('.ip').text();
                    var sessionDevice = draggable.find('.device').text();
                    var sessionPort = draggable.find('.port').text();
                    var $ipdevices = $groupBody.find('.ip-device li:not(".dragging")');
                    var $ports = $groupBody.find('.ports li:not(".dragging")');

                    var needAddIp = true;
                    $ipdevices.each(function(){
                        if($(this).find('.ip').text() == sessionIp){
                            needAddIp = false;
                            return false;
                        }
                    });
                    var needAddPort = true;
                    $ports.each(function(){
                        if($(this).find('.port').text() == sessionPort){
                            needAddPort = false;
                            return false;
                        }
                    });


                    var sTop = self.groupTable.$table.find('.mCSB_container').position().top;
                    var middle = ui.position.top - sTop - serverTitleHeight + groupBodyItemHeight/2;
                    var ipdeviceInsertIndex = $ipdevices.length;
                    $.each($ipdevices, function(index, ele){
                        var rmiddle = $(ele).position().top + $(ele).outerHeight()/2;
                        if(middle < rmiddle){
                            ipdeviceInsertIndex = index;
                            return false;
                        }
                    });
                    var portInsertIndex = $ports.length;
                    $.each($ports, function(index, ele){
                        var rmiddle = $(ele).position().top + $(ele).outerHeight()/2;
                        if(middle < rmiddle){
                            portInsertIndex = index;
                            return false;
                        }
                    });
                    ipdeviceInsertIndex = portInsertIndex = Math.max(ipdeviceInsertIndex, portInsertIndex);

                    var serverIpHtml = $groupBody.find('.ip-device li.dragging');
                    if(serverIpHtml.length == 0){
                        serverIpHtml = $(_.template(""
                            +"<li class='dragging'>"
                            +"    <span class='ip'><%=ip%></span>"
                            +"    <span class='device'><%=device%></span>"
                            +"    <span class='delete spd-icon spd-icon-delete hide'></span>"
                            +"</li>",
                            {'ip': sessionIp, 'device': sessionDevice}));
                    }
                    if(ipdeviceInsertIndex < $ipdevices.length){
                        $ipdevices.eq(ipdeviceInsertIndex).before(serverIpHtml);
                    }else{
                        var margintop = (ipdeviceInsertIndex - $ipdevices.length) * groupBodyItemHeight;
                        $groupBody.find('.ip-device ul').append(serverIpHtml.css('margin-top', margintop + 'px'));
                    }
                    if(needAddIp){
                        serverIpHtml.removeClass('temp');
                    }else{
                        serverIpHtml.addClass('temp');
                    }

                    var serverPortHtml = $groupBody.find('.ports li.dragging');
                    if(serverPortHtml.length == 0){
                        serverPortHtml = $(_.template(""
                            +"<li class='dragging'>"
                            +"    <span class='port'><%=port%></span>"
                            +"    <span class='delete spd-icon spd-icon-delete hide'></span>"
                            +"</li>",
                            {'port': sessionPort}));
                    }

                    if(portInsertIndex < $ports.length){
                        $ports.eq(portInsertIndex).before(serverPortHtml);
                    }else{
                        var margintop = (portInsertIndex - $ports.length) * groupBodyItemHeight;
                        $groupBody.find('.ports ul').append(serverPortHtml.css('margin-top', margintop + 'px'));
                    }
                    if(needAddPort){
                        serverPortHtml.removeClass('temp');
                    }else{
                        serverPortHtml.addClass('temp');
                    }
                    self.moveErrorTip();
                });
            },
            out : function(e, ui){
                $groupBody.find('.ip-device li.dragging').remove();
                $groupBody.find('.ports li.dragging').remove();
                $(this).removeClass('draggable-over');
                if($(this).siblings('.draggable-over').length == 0){
                    ui.draggable.unbind('dragging.for.drop');
                }
                self.moveErrorTip();
            },
            deactivate: function(e, ui){
                $groupBody.find('.ip-device li.dragging').remove();
                $groupBody.find('.ports li.dragging').remove();
                $(this).removeClass('draggable-over');
                if($(this).siblings('.draggable-over').length == 0){
                    ui.draggable.unbind('dragging.for.drop');
                }
            },
            drop: function(e, ui) {
                var sessionIp = ui.draggable.find('.ip').text();
                var sessionDevice = ui.draggable.find('.device').text();
                var sessionPort = ui.draggable.find('.port').text();

                self.intfConfig.addServer(self.server.group, sessionIp, sessionPort);

                $groupBody.find('.ip-device li.dragging.temp').remove();
                $groupBody.find('.ports li.dragging.temp').remove();

                $groupBody.find('.ip-device li.dragging .delete').unbind('click').click($.proxy(self._deleteIp, self));
                $groupBody.find('.ports li.dragging .delete').unbind('click').click($.proxy(self._deletePort, self));

                $groupBody.find('.ip-device li.dragging').removeClass('dragging').removeClass('temp').css('margin-top', '0px');
                $groupBody.find('.ports li.dragging').removeClass('dragging').removeClass('temp').css('margin-top', '0px');

                ui.draggable.remove();
                document.body.style.cursor = 'default';
                self.updateRedIpPortStyle();
                self.moveErrorTip();
            }
        });
    },

    _changeToEditMode: function() {
        var groupNameDisp = this._serverHtml.find('.group-name');
        var groupNameEdit = this._serverHtml.find('input[name=group-name]');
        groupNameDisp.hide();
        groupNameEdit.show();
        groupNameEdit.focus();
        groupNameEdit.select();
    },

    _changeToReadonlyMode: function() {
        var groupNameDisp = this._serverHtml.find('.group-name');
        var groupNameEdit = this._serverHtml.find('input[name=group-name]');
        groupNameDisp.show();
        groupNameEdit.hide();
    },

    _deleteGroup: function(e) {
        var groups = this.groupTable.groups;
        var i = groups.indexOf(this);
        this.groupTable.groups.splice(i, 1);
        var otherGroups = $(e.target).parents('.server').find('.server-group').not($(e.target).parents('.server-group'));

        var groupname = $(e.target).parent('.line').find('.group-name').text();
        this.intfConfig.removeGroup(groupname);

        $(e.target).parents('.server-group').find('input.error').each(function(){
            $(this).messagepop('destroy');
        });

        $(e.target).parents('.server-group').remove();

        this.groupTable.updateScroll();


        if (otherGroups.length == 1) {
            otherGroups.find('.group-title .spd-icon-trash').css('visibility', 'hidden');
        }

        this.moveErrorTip();
    },

    moveErrorTip: function(){
        this.groupTable.moveErrorTip();
    },

    _renameGroup: function(e) {
        var groupname = $(e.target).parent('.line').find('.group-name').text();
        this.oldGroupName = groupname;
        this._changeToEditMode();
        this.intfConfig.$serverTable.find('.mCustomScrollbar').mCustomScrollbar("update");
    },

    _renameGroupBlur: function(e) {
        var input = $(e.target);
        var groupname = input.val().trim();

        if (groupname === '') {
            input.addClass('error');
            input.messagepop('show', gettext('分组名称不能为空'));
            return false;
        } else {
            if (this.oldGroupName != groupname) {
                var msg = this.intfConfig.renameGroup(this.oldGroupName, groupname);
                if (msg && msg.length > 0) {
                    input.addClass('error');
                    input.messagepop('show', msg);
                    return false;
                } else {
                    input.removeClass('error');
                }
            }
            var groupNameDisp = this._serverHtml.find('.group-name');
            groupNameDisp.text(groupname);
            this._changeToReadonlyMode();
        }
        input.messagepop('hide');
    },

    _renameGroupKeypress: function(e) {
        if (e.keyCode == KEYBOARD_ENTER) {
            $(e.target).trigger('blur');
        }
    },

    _deleteIp: function(e) {
        var groupname = this._serverHtml.find('.group-name').text();
        var ip = $(e.target).parent().find('.ip').text().trim();
        var ipCount = $(e.target).parents('.ip-device').find('.ip').length;
        var ports = $(e.target).parents('.ip-device').siblings('.ports').find('li');
        $(e.target).parent().remove();
        if (ipCount == 1) {
            this.intfConfig.removeIpFromGroup(groupname, ip, ports);
        }else{
            this.intfConfig.removeIpFromGroup(groupname, ip);

            var $groupBody = this._serverHtml.find('.group-body');
            var $ips = $groupBody.find('.ip-device li .ip').parent();
            this.updatePortStyle($ips, ports);
        }
        this.intfConfig.updateNodeHalfraw();
        this.moveErrorTip();
    },

    _deletePort: function(e) {
        var groupname = this._serverHtml.find('.group-name').text();
        var port = $(e.target).parent().find('.port').text().trim();
        var portCount = $(e.target).parents('.ports').find('.port').length;
        var ips = $(e.target).parents('.ports').siblings('.ip-device').find('li');

        $(e.target).parent().remove();
        if (portCount == 1) {
            this.intfConfig.removePortFromGroup(groupname, port, ips);
        }else{
            this.intfConfig.removePortFromGroup(groupname, port);

            var $groupBody = this._serverHtml.find('.group-body');
            var $ports = $groupBody.find('.ports li .port').parent();
            this.updateIpStyle(ips, $ports);

        }
        this.intfConfig.updateNodeHalfraw();
        this.moveErrorTip();
    },

    updateIpStyle: function(ips, ports){
        var port_vals = ports.map(function(){
            return $(this).find(".port").text();
        });
        var ipport_map = this.intfConfig.getIpportsMap();
        ips.each(function(){
            var ip_elem = $(this).find(".ip");
            var ip = ip_elem.text();
            var ipport = ipport_map[ip] || {};
            var ports_val = ipport["ports"] || [];

            if(!_.some(port_vals, function(port){
                return _.contains(ports_val, port);
            })){
                ip_elem.addClass("red");
            }else{
                ip_elem.removeClass("red");
            }

        });
    },

    updatePortStyle: function(ips, ports){
        var ip_vals = ips.map(function(){
            return $(this).find(".ip").text();
        });
        var ipport_map = this.intfConfig.getIpportsMap();
        var port_vals = [];
        _.each(ip_vals, function(ip){
            var ipport = ipport_map[ip];
            if(ipport){
                var p_s = ipport["ports"] || [];
                port_vals = port_vals.concat(p_s);
            }
        });

        ports.each(function(){
            var port_elem = $(this).find(".port");
            var port = port_elem.text();
            if(!_.contains(port_vals, port)){
                port_elem.addClass("red");
            }else{
                port_elem.removeClass("red");
            }
        });
    },

    updateRedIpPortStyle: function(){
        var $groupBody = this._serverHtml.find('.group-body');
        var $red_ips = $groupBody.find('.ip-device li .ip').parent();
        if($red_ips.length > 0){
            var $ports = $groupBody.find('.ports li');
            this.updateIpStyle($red_ips, $ports);
        }
        var $red_ports = $groupBody.find('.ports li .port').parent();
        if($red_ports.length > 0){
            var $ipdevices = $groupBody.find('.ip-device li');
            this.updatePortStyle($ipdevices, $red_ports);
        }
        if($red_ips.length > 0 || $red_ports.length > 0){
            this.intfConfig.updateNodeHalfraw();
        }

    },

    getJqObj: function() {
        if (this._serverHtml && this._serverHtml.length == 1) {
            return this._serverHtml;
        } else {
            return null;
        }
    },

    getName: function() {
        if (this._serverHtml && this._serverHtml.length == 1) {
            return this._serverHtml.find('.group-name').text();
        } else {
            return "";
        }
    }

});

var ServerGroupTable = CBMSFLOW.klass({
    __init__: function(intfConfig){
        this.intfConfig = intfConfig;
        this.$table = intfConfig.$serverTable;
        this.$body = this.$table.find('.body');
        this.$addNew = this.$table.find('.add-new');
        this.servers = intfConfig.servers;
        this.groups = [];

        this._init();
    },

    _init: function() {
        this._empty();
        this._loadGroupUnits();
        this._bindEvents();
    },

    _loadGroupUnits: function() {
        var self = this;
        if (this.servers.length == 0) {
            this.servers.push(this._createServerObj());
        }
        $.each(this.servers, function(index, server) {
            self._createServer(server);
        });

        if (this.servers.length == 1) {
            this.$table.find('.server-group .group-title .spd-icon-trash').css('visibility', 'hidden');
        }

        this._updateScrollbar();
    },

    _createServer: function(server) {
        var server = new ServerTable(this, server);
        var jqObj = server.getJqObj();
        this.groups.push(server);
        if (jqObj) {
            jqObj.insertBefore(this.$addNew);
        }
        return jqObj;
    },

    _updateScrollbar: function() {
        this.$table.find('.body-content').mCustomScrollbar('update');
    },

    _empty: function() {
        this.$body.find('.server-group').remove();
        this.$table.find('.message-pop').remove();
    },

    _bindEvents: function() {
        this.$addNew.unbind('click').click($.proxy(this._addNewServerGroup, this));
    },

    _addNewServerGroup: function() {
        var group = this._createServerObj();
        var jqObj = this._createServer(group);
        this.intfConfig.createGroup(group);
        this._updateScrollbar();

        if (this.servers.length == 1) {
            this.$table.find('.server-group .group-title .spd-icon-trash').css('visibility', 'hidden');
        } else {
            this.$table.find('.server-group .group-title .spd-icon-trash').css('visibility', 'visible');
        }
        jqObj.find('.rename').trigger('click');
    },

    _makeNewName: function() {
        var names = _.map(this.groups, function(g){ if (g.getName()) {return g.getName();} });
        var maxN = 0;

        $.each(names, function(i, name) {
            if (name && name.indexOf(gettext('服务接口')+'-') == 0) {
                if (name.lastIndexOf('-') > 0) {
                    var num = name.slice(name.lastIndexOf('-')+1, name.length);
                    if ($.isNumeric(num)) {
                        maxN = Math.max(parseInt(num, 10), maxN);
                    }
                }
            }
        });

        maxN += 1;
        return gettext('服务接口') + '-' + (maxN < 10 ? '0'+maxN : maxN);
    },

    _createServerObj: function() {
        return {'group': this._makeNewName(), 'ipports': {'ips': [], 'ports': []}};
    },

    clear: function() {
        this._empty();
    },

    updateScroll: function() {
        this._updateScrollbar();
    },
    moveErrorTip: function(){
        this.$table.find('input.error').each(function(){
            $(this).messagepop('updatePos');
        });
    }
});

var ClientTable = CBMSFLOW.klass({
    __init__: function(intfConfig){
        this.intfConfig = intfConfig;
        this.clients = intfConfig.clients;
        this.$table = intfConfig.$clientTable;
        this.$tableBody = this.$table.find('.body-content table');

        this._init();
    },

    _init: function() {
        this._empty();
        this._loadClients();
    },

    _empty: function() {
        this.$tableBody.empty();
    },

    _loadClients: function() {
        var ips = _.uniq(_.pluck(_.flatten(_.pluck(this.clients || [], 'ipports')), 'ip'));
        var ipDeviceMap = this.intfConfig.ipDeviceMap || {};
        var flows = this.intfConfig.flows || [];
        var flow_pairs = _.pairs(flows);
        var clients = _.map(ips, function(ip) {
            var extra_class = '';
            if (ip in ipDeviceMap) {
                return {'ip': ip, 'device': ipDeviceMap[ip], 'extra_class': extra_class};
            } else {
                return {'ip': ip, 'extra_class': extra_class};
            }
        });

        var clientHtml = _.template(ClientRowTemplate, {'clients': clients});
        this.$tableBody.append($(clientHtml));

        this._updateScrollbar();
    },

    _updateScrollbar: function() {
        this.$table.find('.body-content').mCustomScrollbar('update');
    },

    clear: function() {
        this._empty();
    }
});

SpdMap.IntfConfig = CBMSFLOW.klass(SpdMap.RevertObject, {
    /*
     * flows: [{}, {}]
     * node
     * {
     *   servers: [{group: groupname01, ipports: {ips: [], ports: []}}]
     *   clients: [{server: {ip:'1.1.1.1', port: 4350}, ipports: [{ip: '2.2.2.2', port:8979}]}]
     * }
     */
    __init__: function() {
        this.$intfConfig = $('#interface-definition');
        this.$sessionTable = this.$intfConfig.find('.sessions');
        this.$serverTable = this.$intfConfig.find('.server');
        this.$clientTable = this.$intfConfig.find('.client');
        this.tables = [];

        this.sessionTable = new SessionsTable(this);

        var updateServersFuncs = ['addServer', 'removeGroup', 'removeIpFromGroup', 'removePortFromGroup', 'removeIp'];
        for(var i=0; i<updateServersFuncs.length; i++){
            var funcName = updateServersFuncs[i];
            this[funcName] = this._updateServersDecorator(funcName, this[funcName]);
        }
    },

    _init: function() {
        this.tables = [];
        this.sessionTable.updateFlows();
        this.serverTable = new ServerGroupTable(this);
        this.clientTable = new ClientTable(this);
        this.tables.push(this.sessionTable);
        this.tables.push(this.serverTable);
        this.tables.push(this.clientTable);
        this._resize();
        this._bindEvents();
    },

    _aggregate: function(flows) {
        var newFlows = {};
        var self = this;
        var toAggregateFlows = flows;
        var search_ipports = this.getSearchResultIpports();
        for(var i=0;i<toAggregateFlows.length;i++){
            var flow = toAggregateFlows[i];
            var key = flow.ip_a + ':' + flow.port_a;
            if (key in newFlows) {
                newFlows[key]['bytes_a2b'] += flow['bytes_a2b'];
                newFlows[key]['flowcount'] += 1;
            } else {
                newFlows[key] = {
                    'id': flow.ip_a + flow.port_a,
                    'ip_a': flow.ip_a,
                    'device_a': flow.device_a,
                    'port_a': flow.port_a,
                    'bytes_a2b': flow.bytes_a2b||0,
                    'flowcount': 1
                };
            }

        }
        return _.values(newFlows);
    },

    load: function(flows, node, ipDeviceMap) {
        this.node = node;
        this.node_id = node.id;
        this.servers = node['servers'] || [];
        this.clients = node['clients'] || [];
        node['servers'] = this.servers;
        node['clients'] = this.clients;
        this.rawFlows = flows;
        this.flows = this._aggregate(flows) || [];
        this.ipDeviceMap = ipDeviceMap;
        this._init();
        this.changed('load');
    },

    _bindEvents: function() {
        var self = this;
        this.bind('resize', $.proxy(this.handleResize, this));
        $(window).unbind('resize').resize($.proxy(this.handleResize, this));
        this.$intfConfig.unbind('show').bind('show', function(){
            self.sessionTable.show();
        });
    },

    handleResize: function() {
        this._resize();
        this.sessionTable.resizeContent();
    },

    _resize: function(){
        var space = 81 + 10*2 + 10;
        var minWidth = space + 392.0 + 450.0 + 299.0;
        var serverFactor = 392.0 / minWidth;
        var sessionFactor = 450.0 / minWidth;
        var clientFactor = 299.0 / minWidth;
        var winWidth = $(window).width();

        var serverWidth = 392 > serverFactor * winWidth ? 392 : serverFactor * winWidth;
        var sessionWidth = 450 > sessionFactor * winWidth ? 450 : sessionFactor * winWidth;
        var clientWidth = 299 > clientFactor * winWidth ? 299 : clientFactor * winWidth;

        this.$serverTable.width(serverWidth);
        this.sessionTable.resize(sessionWidth);
        this.$clientTable.width(clientWidth);
    },

    clear: function() {
        $.each(this.tables||[], function(i, table) {
            table.clear();
        });
    },

    _updateServersDecorator: function(funcName, func){
        return this.__addDecorator(function(){
            var oldServers = $.extend(true, [], this.servers);
            func.apply(this, arguments);
            var newServers = this.servers;
            this.updateSessionFlows(oldServers, newServers);
            this.updateOppsiteClients(oldServers, newServers);
            this.redrawFlowTable();

            this.changed('serverchanged.' + funcName);
        });
    },

    setGroup: function(groupname, ipports) {
        var group = this.getGroup(groupname);
        if (group && group.group == groupname) {
            group.ipports = ipports;
        } else {
            this.node.servers.push({'group':groupname, 'ipports': $.extend(true, {}, ipports)});
        }

        this.changed("setGroup");
    },

    getGroup: function(groupname) {
        return _.filter(this.node.servers, function(server) { return server.group == groupname; })[0];
    },

    createGroup: function(group) {
        this.node.servers.push(group);
        this.changed("createGroup");
    },

    removeGroup: function(groupname) {
        var toRemoveGroup = {};
        this.servers = this.node.servers = _.filter(this.node.servers, function(server) {
            if (server.group != groupname) {
                return server;
            } else {
                toRemoveGroup = server;
            }
        });

        if (!$.isEmptyObject(toRemoveGroup)) {
            var ips = toRemoveGroup.ipports.ips;
            var ports = toRemoveGroup.ipports.ports;
        }
        //this.changed('serverchanged.removeGroup');
    },

    renameGroup: function(oldName, newName) {
        var groups = _.pluck(this.node.servers, 'group');

        if (_.contains(groups, newName)) {
            return gettext('分组名称不能重复');
        }

        $.each(this.node.servers, function(i, server) {
            if (server.group === oldName) {
                server.group = newName;
                return false;
            }
        });
        this.changed("renameGroup");
    },

    addServer: function(groupname, ip, port){
        var group = this.getGroup(groupname);
        if($.inArray(ip, group.ipports.ips) == -1){
            group.ipports.ips.push(ip);
        }
        if($.inArray(port, group.ipports.ports) == -1){
            group.ipports.ports.push(port);
        }
        this.serverTable._updateScrollbar();
    //    this.changed("serverchanged.addServer");
    },

    removeIp: function(ip) {
        var self = this;
        _.each(this.servers, function(group, index){
            if(_.contains(group.ipports.ips, ip)){
                self.removeIpFromGroupInner(group.group, ip);
                //if(group.ipports.ips.length == 0){
                //    group.ipports.ips.ports = [];
                //}
            }
        });

        _.each(this.clients, function(group){
            group.ipports = _.reject(group.ipports, function(item){ return item.ip == ip});
        });

        this.rawFlows = _.reject(this.rawFlows, function(item){ return item.ip_a == ip; });
        this.flows = this._aggregate(this.rawFlows) || [];

        this.node['servers'] = this.servers;
        this.node['clients'] = this.clients;

        this.serverTable._updateScrollbar();
        this.clientTable._updateScrollbar();

    //    this.changed("serverchanged.removeIp");
    },


    removeIpFromGroup: function(groupname, ip, ports) {
        /*
        var group = this.getGroup(groupname);
        var index = 0;

        if ((index = $.inArray(ip, group.ipports.ips)) != -1) {
            var ips = group.ipports.ips;
            group.ipports.ips = _.filter(ips, function(p,i){return i != index });
        }
        */
        if(ports){
            var self = this;
            $.each(ports, function(i, item) {
                var p = $(item).find('.port').text();
                self.removePortFromGroupInner(groupname, p);
            });
            ports.remove();
        }
        this.removeIpFromGroupInner(groupname, ip);
        //this.sessionTable.setDefaultSort();
        //this.changed("serverchanged.removeIp");
    },

    removeIpFromGroupInner: function(groupname, ip) {
        var group = this.getGroup(groupname);
        var index = 0;

        if ((index = $.inArray(ip, group.ipports.ips)) != -1) {
            var ips = group.ipports.ips;
            group.ipports.ips = _.filter(ips, function(p,i){return i != index; });
        }
    },

    removePortFromGroup: function(groupname, port, ips) {
        /*
        var group = this.getGroup(groupname);
        var index = 0;

        if ((index = $.inArray(port, group.ipports.ports)) != -1) {
            var ports = group.ipports.ports;
            group.ipports.ports = _.filter(ports, function(p,i){ return i != index });
        }
        */
        if(ips){
            var self = this;
            $.each(ips, function(i, item) {
                var ip = $(item).find('.ip').text();
                self.removeIpFromGroupInner(groupname, ip);
            });
            ips.remove();
        }
        this.removePortFromGroupInner(groupname, port);
        //this.sessionTable.setDefaultSort();
        //this.changed("serverchanged.removePort");
    },

    removePortFromGroupInner: function(groupname, port) {
        var group = this.getGroup(groupname);
        var index = 0;

        if ((index = $.inArray(port, group.ipports.ports)) != -1) {
            var ports = group.ipports.ports;
            group.ipports.ports = _.filter(ports, function(p,i){ return i != index });
        }

    },

    //TODO: slow
    getUnClassifyFlows: function(){
        var servers = SpdMap.Node.getServersIpPortMap(this.servers || []);
        var clients = SpdMap.Node.getClientsIpPortMap(this.clients || []);
        var flows = _.filter(this.flows, function(flow){
            var isClassify = SpdMap.Node.isIpPortMatchServersMap(servers, flow['ip_a'], flow['port_a']);
            if(!isClassify){
                isClassify = SpdMap.Node.isIpPortMatchClientsMap(clients, flow['ip_a'], flow['port_a']);
            }
            return !isClassify;
        });
        return flows;
    },


    updateSessionFlows: function(oldServers, newServers){
        this.sessionTable.updateFlows();
    },

    updateOppsiteClients: function(oldServers, newServers){
        FlowInterfaceDefineUtils.updateOppsiteClients(this.rawFlows, this.node, oldServers, newServers);
    },

    redrawFlowTable: function() {
        var map = CBMSFLOW.environment('topovmap');
        map.redrawFlowTable();
    },

    loadHistoryData: function(data) {
        if(data.nodeId != null && data.nodeId != undefined && data.nodeId >= 0){
            var map = CBMSFLOW.environment("topovmap");
            this.node = map.getNode(data.nodeId);
            this.node.servers = $.extend(true, [], data['servers']);
            this.node.clients = $.extend(true, [], data['clients']);
            this.load(data.rawFlows, this.node, this.ipDeviceMap);
            if(map.getSelectNode() != null && map.getSelectNode().equal(this.node)){
                this.redrawFlowTable();
            }
        }
        else{
            this.node = null;
            this.node_id = null;
            this.clear();
        }
    },

    getHistoryData: function() {
        var servers = [];
        var clients = [];
        var nodeId = null;

        if (this.node) {
            servers = $.extend(true, [], this.node.servers||[]);
            clients = $.extend(true, [], this.node.clients||[]);
            nodeId = this.node_id;
        }

        return {'servers': servers, 'clients': clients, 'rawFlows': this.rawFlows, 'nodeId': nodeId};
    },
    setNode: function(node){
        this.node = node;
        if(node){
            this.node_id = node.id;
        }
        else{
            this.node_id = null;
        }
    },

    clearNode: function(){
        this.node = null;
        this.node_id = null;
        this.changed('clear');
    },
    getIpportsMap: function(){
        if(this.node){
            return this.node.getIpportsMap();
        }
        return {};
    },
    updateNodeHalfraw: function(){
        if(this.node){
            this.node.updateHalfraw();
        }
    },
    getSearchResultIpports: function(){
        var map = CBMSFLOW.environment('topovmap');
        return map.searchResultIpports || {};
    }
});


var FlowInterfaceDefineUtils = {
    isFlowMatchServer: function(flow, servers){
        var flowIp = flow['ip_a'];
        var flowPort = flow['port_a'];
        var isMatch = false;
        for(var i=0;i<servers.length;i++){
            var server = servers[i];
            var ipports = server.ipports;
            if(_.contains(ipports.ips, flowIp) && _.contains(ipports.ports, flowPort)){
                isMatch = true;
                break;
            }
        };
        return isMatch;
    },

    isFlowMatchClient: function(flow, clients){
        var flowIp = flow['ip_a'];
        var flowPort = flow['port_a'];
        var isMatch = false;
        $.each(clients, function(i, client){
            $.each(client.ipports || [], function(j, ipport){
                if(ipport.ip == flowIp && ipport.port == flowPort){
                    isMatch = true;
                    return false;
                }
                return null;
            });
            return !isMatch;
        });
        return isMatch;
    },

    updateOppsiteClients: SpdMap.Node.updateOppsiteClients
};
