var SpdMap = CBMSFLOW.module("spdmap");
//console.log(CBMSFLOW.module("plugin.PopupAbstract"));

SpdMap.PreviewPopupAbstract = CBMSFLOW.klass("plugin.PopupAbstract", {
    __init__: function($super, container, options){
        this.container = container;
        $(".close", this.container).click($.proxy(this.hide, this));
        $(".preview-popup-data,.snapshot-popup-data",this.container).mCustomScrollbar({
            advanced: {
                autoScrollOnFocus: false
            }
        });
        this.container.bind({
            'mousewheel':function(e,delt){
                $(this).children(".mCustomScrollBox").trigger('mousewheel',delt);
                e.stopPropagation();
                return false;
            }
        });
        $super(options);
    },
    show: function(){
        this.container.show();
        this.container.find('.flow-data-export').each(function(){
            $(this).height($(this).parent().height());
        });
        this.updateScrollbar();
    },
    hide: function(){
        this.cleanData();
        this.container.hide();
        this.getOption("hideCallback",$.noop)();
    },
    getWidth:function(){
        return this.container.width();
    },
    getData: function(){},
    render: function(data){
    },
    cleanData: function(){
        $(".data", this.container).empty();
    },
    updateScrollbar: function() {
        $(".preview-popup-data,.snapshot-popup-data",this.container).mCustomScrollbar('update');
    },
    popup: function(data, offsetbox, edges){
        this.render(data);
        this.setWidth();
        $('.node-type-options').data('id', data.id);
        $('.node-type-options').data('edges', edges);
        if (data.type === 'server') {
            $(".node-type-options label:nth-child(3) input[name='client-type']").attr("checked",true);
        } else {
            $(".node-type-options label:nth-child(2) input[name='client-type']").attr("checked",true);
        }
        // $('.modal-body .warning').hide();
        $('.modal-body .warning').removeClass('bold');
        this.show(data);
        this.moveByOffsetBox(offsetbox);
    },
    moveByOffsetBox:function(offsetbox){
        var pos = this.getPos(offsetbox);
        this.setPos(pos);
    },
    setPos: function(pos){
        this.container.offset({ top: pos.y, left: pos.x });
    },
    getPos: function(offsetbox){},
    destroy: function(){},
    getDataElem: function(data_name, container){
        container = container || this.container;
        return $(".data[data_name='"+ data_name +"']", container);
    },
    appendGroup: function(elem){
        var template = '';
        template = ''
            +'<div class="data-group node-data-row">'
            +'<div class="sub-data data-group-title" data_name="name"></div>'
            +'<div class="data-group-body">'
            +'<ul class="sub-data text-tip text-ellipsis" data_name="ips"></ul>'
            +'<ul class="sub-data" data_name="ports"></ul>'
            +'</div>'
            +'</div>';
        return $(template).appendTo(elem);
    },
    appendServer: function(group_data, elem, addExport){
        var groupElem = this.appendGroup(elem);
        groupElem.find('.sub-data').css({'padding-top': '10px', 'padding-bottom': '10px'});
        $(".sub-data[data_name=name]", groupElem).html(group_data.group);
        $.each(_.sortBy(group_data.ips||[],function(ip_data){
            return SpdMap.utils.ipText2Int(ip_data.ip);
        }), function(m, ip_data){
            $(".sub-data[data_name=ips]", groupElem).append("<li><span>"+ip_data.ip+"</span><span>"+ip_data.device+"</span></li>");
        });
        $.each(_.sortBy(group_data.ports||[],function(port){
            return port;
        }), function(n, port){
            $(".sub-data[data_name=ports]", groupElem).append("<li>"+port+"</li>");
        });

        if(CBMSFLOW.environment('SPD.PROTOCOL') && this.protocolMap){
            var groupPorts = group_data.ports;
            var group = group_data.group;
            for (var i in groupPorts) {
                var port = groupPorts[i];
                var key = this.title+"_"+group+"_"+port;
                var protocol = this.protocolMap[key] ? this.protocolMap[key].join(';').toUpperCase() : gettext('未知');
                var portElem = _.filter($(".sub-data[data_name=ports] li", groupElem), function(e) {
                    if ($(e).text() == port) {
                        return $(e);
                    }
                    return null;
                });
                if (portElem.length==1) {
                    portElem = $(portElem[0]);
                    portElem.html('<span>'+portElem.text()+'</span><span class="protocol text-ellipsis" > '+protocol+'</span>');

                    var width = CBMSFLOW.SPD.fontutil.getTextWidth(portElem.find('.protocol'));
                    if (width > 130) {
                        portElem.find('.protocol').css('cursor', 'pointer').tipIt(protocol.split(';').join('<br>'));
                    }
                }
            }
        }

        if(addExport){
            groupElem.find('.data-group-body').append('<ul class="flow-data-export"><li><button data-toggle="tooltip" data-original-title="'+gettext("导出")+'"><i class="export-icon"></i></button></li></ul>');
            groupElem.find('.flow-data-export button').tooltip();
        }
        return groupElem;
    },
    appendServers: function(data, elem, addExport){
        data = data || {};
        addExport = addExport || false;
        var _this = this;
        $.each(data, function(i, group_data){
            if(group_data && group_data.ips && group_data.ips.length > 0){
                _this.appendServer(group_data, elem, addExport);
            }
        });
    },
    appendClients: function(data, elem, addExport){
        addExport = addExport || false;
        if(data && data.ips && data.ips.length > 0){
            var groupElem = this.appendGroup(elem);
            groupElem.find('.sub-data').css({'padding-top': '10px', 'padding-bottom': '10px'});
            $(".sub-data[data_name=name]", groupElem).html(gettext("客户接口"));
            $.each(_.sortBy(data.ips||[],function(ip_data){
                return SpdMap.utils.ipText2Int(ip_data.ip);
            }), function(m, ip_data){
                $(".sub-data[data_name=ips]", groupElem).append("<li><span>"+ip_data.ip+"</span><span>"+ip_data.device+"</span></li>");
            });
            $(".sub-data[data_name=ports]", groupElem).append("<li>" + gettext("随机") + "</li>");
            if(addExport){
                groupElem.find('.data-group-body').append('<ul class="flow-data-export"><li><button data-toggle="tooltip" data-original-title="'+gettext("导出")+'"><i class="export-icon"></i></button></li></ul>');
                groupElem.find('.flow-data-export button').tooltip();
                groupElem.find('.flow-data-export').height(groupElem.height());
            }
            return groupElem;
        }
        return null;
    },
    setWidth: function(){
        this.container.css('width', 'auto');
    }
});

SpdMap.SnapshotMapNodePopup = CBMSFLOW.klass(SpdMap.PreviewPopupAbstract, {
    getPos: function(offsetbox){
        var x0 = offsetbox.x2 + 10,
            x = x0,
            w = this.getWidth();
        /*
        if((x + w) > ($(window).width() + $(window).scrollLeft())){
            x = offsetbox.x - w - 10;
        }
        if(x < $(window).scrollLeft()){
            x = x0;
        }
        */
        return {
            x:x,
            y:offsetbox.y
        };
    },
    appendGroup: function(elem){
        var template = '';
        template = ''
            +'<div class="data-group node-data-row data-title">'
            +'<div class="data-group-body">'
            +'<ul class="sub-data text-tip text-ellipsis" data_name="name" ></ul>'
            +'<ul class="sub-data" data_name="ips" ></ul>'
            +'<ul class="sub-data" data_name="ports" ></ul>'
            +'</div>'
            +'</div>'
            +'';
        var t = $(template);
        if(CBMSFLOW.environment('SPD.PROTOCOL')){
            $('[data_name=ports]', t).addClass('enable-protocol');
        }
        return t.appendTo(elem);
    },
    appendTitle: function(elem){
        var groupElem = this.appendGroup(elem);
        $(".sub-data[data_name=name]", groupElem).html(gettext("接口"));
        $(".sub-data[data_name=ips]", groupElem).html(gettext("接口定义"));
        $(".sub-data[data_name=ports]", groupElem).html("&nbsp;");
        groupElem.css({'padding-bottom': '10px', 'border-bottom': '1px solid #e1e1e1'});
        return groupElem;
    },
    appendServer: function($super, group_data, elem, addExport){
        var server_elem = $super(group_data, elem, addExport);
        elem.append('<div class="spliter"></div>');
        return server_elem;
    },
    render: function(data){
        this.protocolMap = data['protocolMap'];
        this.title = data.title;
        this.getDataElem("title").html(data.title);
        var dataElem = this.getDataElem("servers");
        this.appendTitle(dataElem);
        this.appendServers(data.servers, dataElem);
        var clientElem = this.appendClients(data.clients, dataElem);
        if(!clientElem){
            dataElem.find(".spliter").last().remove();
        }
    },
    calcWidth: function(){
        var w = 398;
        // if(CBMSFLOW.environment('SPD.PROTOCOL')){
        //     w += 120;
        // }
        return w;
    },
    setWidth: function(){
        this.container.width(this.calcWidth());
    }
});

SpdMap.PreviewMapNodePopup = CBMSFLOW.klass(SpdMap.SnapshotMapNodePopup, {
    appendServer: function($super, group_data, elem, addExport){
        var _this = this;
        if (!CBMSFLOW.environment('PERMISSION.PCAP.EXPORT')){
            return $super(group_data, elem, false);
        }
        var server_elem = $super(group_data, elem, true);
        server_elem.find('.flow-data-export button').click(function(){
            var pcapExporter = CBMSFLOW.environment('pcapExporter');
            var node_title = _this.getDataElem("title").html();
            pcapExporter.show([{'mode':'server', 'server':group_data, 'title':node_title}]);
        });
        return server_elem;
    },
    appendTitle: function($super, elem){
        var titleELem = $super(elem);
        if (CBMSFLOW.environment('PERMISSION.PCAP.EXPORT')){
            $('.data-group-body').append('<ul style="width:45px;margin-left:60px;">' + gettext("数据包") + '</ul>');
        }
        return titleELem;
    },
    calcWidth: function($super){
        var w = $super();
        // if (CBMSFLOW.environment('PERMISSION.PCAP.EXPORT')){
        //     w += 140;
        // }
        // return w;
        return 300;
    }
});

SpdMap.SnapshotMapEdgePopup = CBMSFLOW.klass(SpdMap.PreviewPopupAbstract, {
    getPos: function(offsetbox){
        var w = this.getWidth(),
            y = offsetbox.y2,
            x = (offsetbox.x + offsetbox.x2)/2 - w/2,
            l = $(window).scrollLeft(),
            r = l + $(window).width();
        /*
        if(x < l + 10){
            x = l + 10;
        }
        else if(x + w > r - 10){
            x = r - w - 10;
        }
        */
        return {
            x:x,
            y:y
        };
    },
    appendLink: function(data, elem){
        if($(elem).find('.flow-data-row').length > 0){
            $('<div class="spliter"></div>').appendTo(elem);
        }
        var template = '';
        if(!data){
            template = ''
                +'<div class="flow-data-row flow-data-db flow-data-d2">'
                +'<div class="data flow-data-node-block" data_name="node_server1"></div>'
                +'<div class="flow-data-arrow-block"><div class="flow-data-arrow-left"></div></div>'
                +'<div class="data flow-data-node-block" data_name="node_client2"></div>'
                +'</div>'
                + '';
        }
        else{
            template = ''
                +'<div class="flow-data-row flow-data-db flow-data-d1">'
                +'<div class="data flow-data-node-block" data_name="node_client1"></div>'
                +'<div class="flow-data-arrow-block"><div class="flow-data-arrow-right"></div></div>'
                +'<div class="data flow-data-node-block" data_name="node_server2"></div>'
                +'</div>'
                + '';
        }
        return $(template).appendTo(elem);
    },
    render: function(data){
        var _this = this;

        /*
         * link_direction: [left_direction, right_direction]
         * value:[0,1] | [1,0]
         */
        var link_direction = [0 ^ data.pos_direction, 1 ^ data.pos_direction];

        this.getDataElem("title").html(data.title);
        this.getDataElem("node_name" + (link_direction[0] + 1)).html(data.nodeA.title);
        this.getDataElem("node_name" + (link_direction[1] + 1)).html(data.nodeB.title);
        var link_elem = this.getDataElem("link");
        if(data.direction[link_direction[0]]){
            $.each(data.links[link_direction[0]] || [], function(i, item){
                var elem = _this.appendLink(false, link_elem);
                _this.appendClients(item.clients,_this.getDataElem("node_client2", elem));
                _this.appendServers(item.servers,_this.getDataElem("node_server1", elem));
            });
        }
        if(data.direction[link_direction[1]]){
            $.each(data.links[link_direction[1]] || [], function(i, item){
                var elem = _this.appendLink(true, link_elem);
                _this.appendClients(item.clients,_this.getDataElem("node_client1", elem));
                _this.appendServers(item.servers,_this.getDataElem("node_server2", elem));
            });
        }
    },
    calcWidth: function(){
        var w = 678;
        return w;
    },
    setWidth: function(){
        this.container.width(this.calcWidth());
    }
});

SpdMap.PreviewMapEdgePopup = CBMSFLOW.klass(SpdMap.SnapshotMapEdgePopup, {
    render: function($super, data){
        if (!CBMSFLOW.environment('PERMISSION.PCAP.EXPORT')){
            $super(data);
            return;
        }
        /*
         * link_direction: [left_direction, right_direction]
         * value:[0,1] | [1,0]
         */
        var link_direction = [0 ^ data.pos_direction, 1 ^ data.pos_direction];

        this.edge_data = data;
        var _this = this;
        this.getDataElem("title").html(data.title);
        this.getDataElem("node_name" + (link_direction[0] + 1)).html(data.nodeA.title);
        this.getDataElem("node_name" + (link_direction[1] + 1)).html(data.nodeB.title);
        var link_elem = this.getDataElem("link");
        if(data.direction[link_direction[0]]){
            $.each(data.links[link_direction[0]] || [], function(i, item){
                var elem = _this.appendLink(false, link_elem);
                _this.appendClients(item.clients,_this.getDataElem("node_client2", elem), true);
                _this.appendServers(item.servers,_this.getDataElem("node_server1", elem), false);
                elem.find('.flow-data-export button').click(function(){
                    var pcapExporter = CBMSFLOW.environment('pcapExporter');
                    pcapExporter.show([{'links': [[item]], 'nodeA': data.nodeA, 'nodeB': data.nodeB, 'mode':'link'}]);
                });
            });
        }
        if(data.direction[link_direction[1]]){
            $.each(data.links[link_direction[1]] || [], function(i, item){
                var elem = _this.appendLink(true, link_elem);
                _this.appendClients(item.clients,_this.getDataElem("node_client1", elem), false);
                _this.appendServers(item.servers,_this.getDataElem("node_server2", elem), true);
                elem.find('.flow-data-export button').click(function(){
                    var pcapExporter = CBMSFLOW.environment('pcapExporter');
                    pcapExporter.show([{'links': [[item]], 'nodeA': data.nodeA, 'nodeB': data.nodeB, 'mode': 'link'}]);
                });
            });
        }
    },
    calcWidth: function($super){
        var w = $super();
        if (CBMSFLOW.environment('PERMISSION.PCAP.EXPORT')){
            w += 140;
        }
        return w;
    }
});
