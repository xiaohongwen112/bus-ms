var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.NodeDefinitionView = CBMSFLOW.klass(SpdMap.RevertObject, {

    IP_ROWS_TEMPLATES :
        "<% _.each(data, function(row, seq) { %> "
        +"<tr class='node-ip-row <%=row.extra_class%>' ip='<%=row.ip%>'>"
        +"    <td class='cell-seq'><span><%=seq+1%></span></td>"
        +"    <td class='cell-ip'><span><%=row.ip%></span></td>"
        +"    <td class='cell-device'><span><%=row.device%></span></td>"
        +"    <td class='cell-flowcount'><span><%=row.flow_count%></span></td>"
        +"    <td class='cell-bytes'><span><%=row.bytes%></span></td>"
        +"    <td class='cell-operation'><span class='delete spd-icon spd-icon-delete hide'></span></td>"
        +"</tr>"
        +" <% }); %>",

    __init__: function($container, map){
        this.$container = $container;
        this.map = map;
        this.ipDeviceMap = null;
        this.$valueContainer = $('.node-definition-value-container');
        this.$valueContainer.mCustomScrollbar();

        this.node_id = null;
        this.node = null;
        this.records = [];
        this._enableTableSort();
    },

    update: function(node, flows, ipDeviceMap){
        this.node_id = node.id;
        this.node = node;
        this.records = this._buildRecords(node.ip_ports, flows, ipDeviceMap);
        this.render();
        this.$valueContainer.height($('#flow-table-block').height() - this.$container.find('.node-definition-title-container').height());
        this.$valueContainer.mCustomScrollbar('update');
        this.changed('update');
    },

    render: function(){
        var html = _.template(this.IP_ROWS_TEMPLATES, {data: this.records});
        this.$container.find('tbody').html(html);
        this.$container.find('.table-value').trigger('update');
        this._bindEvents();
    },

    _buildRecords : function(iplist, flows, ipDeviceMap){
        var data = [];
        var stats = {};
        var hide_ipports = this.map.getUnvisibleIpPorts(this.node) || [];
        var functool = CBMSFLOW.functool;
        var datasource = CBMSFLOW.environment('flowlistProxy');
        var call_result = functool.synccall(datasource, datasource.getOppositeIpports, [{'ipports': JSON.stringify(hide_ipports)}]);
        var hide_oips = _.map(call_result[0], function(ipport){return ipport[0];});

        iplist = _.uniq(_.map(iplist, function(item){return item[0];}));
        _.each(iplist, function(item){
            stats[item] = {'flow_count' : 0, 'bytes' : 0};
        });

        _.each(flows, function(item){
            if(stats[item.ip_a] != undefined){
                stats[item.ip_a]['flow_count'] += 1;
                stats[item.ip_a]['bytes'] += item.bytes;
            }
            if(stats[item.ip_b] != undefined){
                stats[item.ip_b]['flow_count'] += 1;
                stats[item.ip_b]['bytes'] += item.bytes;
            }
        });

        _.each(iplist, function(item, index){
            var extra_class = [];
            if(!stats[item].flow_count) {
                if(_.contains(hide_oips, item)){
                    extra_class.push('grey');
                }
                else{
                    extra_class.push('red');
                }
            }

            data.push({
                'ip' :  item,
                'device' : ipDeviceMap[item] || '',
                'flow_count' : stats[item].flow_count,
                'bytes' : stats[item].bytes,
                'extra_class' :  extra_class.join(' ')
            });
        });
        return data;
    },

    _bindEvents : function(){
        var self = this;
        var dragger = new SpdMap.NodeSplitDragger(this.map, this.node, $.proxy(this.getSelectIpPorts, this), $.proxy(this.splitedHandler, this));
        this.$container.find('.table-value tr:not(.red) td.cell-ip').each(function(index, item){
            dragger.bindDrag($(item));
        });
        this.$container.find('.table-value td.cell-operation .delete').click(function(e){
            var ip = $.trim($(this).parents('tr').find('td.cell-ip').text());
            self.removeIp(ip);
            self.changed('split');
        });
        this.dragger = dragger;
    },

    _enableTableSort : function(){

        var table_title = this.$container.find('.table-title');
        var table_value = this.$container.find('.table-value');

        table_value.tablesorter({
            headers:{
                0:{sorter: "digit"},
                1:{sorter: "ipAddress"},
                2:{sorter: "text"},
                3:{sorter: "digit"},
                4:{sorter: "digit"}
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
    },

    getSelectIpPorts: function(event, ui){
        var ip = $(event.target).text().trim();
        return [_.find(this.node.ip_ports, function(item){ return item[0] == ip;})];
    },

    splitedHandler: function(event, ui){
        var ip = $(event.target).text().trim();
        this.removeIp(ip);
        this.changed('split');
    },

    removeIp : function(ip){
        this.node.ip_ports = _.reject(this.node.ip_ports, function(item){
            return item[0] == ip;
        });
        this.records = _.reject(this.records, function(item){ return item['ip'] == ip; });
        if(this.records.length == 0){
            this.trigger('node.removed',  this.node_id);
            this.node_id = null;
            this.node = null;
        }
        else{
            this.trigger('ip.removed', this.node_id, ip);
        }
        if(this.node != null){
            this.node.updateHalfraw();
        }
        this.render();
    },

    getHistoryData:function(){
        return {
            'node_id' : this.node_id,
            'records' : $.extend(true, [], this.records)
        };
    },
    loadHistoryData:function(data){
        this.node_id = data.node_id;
        if(this.node_id != null && this.node_id != undefined && this.node_id >= 0){
            this.node = this.map.getNode(this.node_id);
        }
        else{
            this.node = null;
        }
        this.records = $.extend(true, [], data.records);
        this.render();
    },
    setNode:function(node){
        if(node){
            this.node_id = node.id;
        }
        else{
            this.node_id = null;
        }
        this.node = node;
        this.dragger.node = node;
    },
    clearNode:function(){
        this.node_id = null;
        this.node = null;
        if(this.dragger){
            this.dragger.node = null;
        }
        this.changed('clear');
    },
    setSearchHighlight:function(ipports){
        ipports = ipports || {};
        this.clearSearchHighlight();
        $(".node-ip-row", this.$container).each(function(){
            var ip = $(this).attr('ip');
            if(ipports[ip]){
                $(this).addClass('yellow');
            }
        });
    },
    clearSearchHighlight:function(){
        this.$container.find('tr.yellow').removeClass('yellow');
    }
});

