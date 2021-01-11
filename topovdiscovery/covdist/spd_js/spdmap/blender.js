var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.Blender =  CBMSFLOW.klass({
    blend:function(map){
        var flow_table = new SpdFlowTable.SplitNodeFlowTable();
        var searchCtrl = new SpdMap.SearchCtrl($('.search-box'));
        var node_table = new SpdFlowTable.NodeTable($('#node-table'));
        var node_definition_view = new SpdMap.NodeDefinitionView($('#node-definition'), map);
        var table_panel = new SpdFlowTable.TablePanel($('#flow-table-block .flow-table-nav'));
        var toolbar = new SpdMap.Toolbar();
        var intfConfig = new SpdMap.IntfConfig();
        var history = new SpdMap.HistoryManager({
            'map':map,
            'hide_box':map.hideBox,
            'zoom':map.zoomCtrl,
            'search':searchCtrl,
            'table_panel' : table_panel,
            'node_definition' : node_definition_view,
            //'flow_table':flow_table,
            'intf_config':intfConfig,
            'flowlist':CBMSFLOW.environment('flowlistProxy')
        },
        //revert priority
        ['flowlist','map'],
        //accept actions
        ['map','zoom','hide_box.select', 'intf_config', 'table_panel.tab', 'node_definition.split'],
        //reject actions
        ['map.born', 'map.server.set', 'map.click.clear', 'map.split', 'map.node.remove','hide_box.select.clear', 'zoom.born', 'intf_config.born', 'intf_config.load', 'intf_config.serverchanged.removeIp', 'intf_config.clear']
        );
        this.init(map, flow_table, node_table, table_panel, searchCtrl, history, toolbar, node_definition_view, intfConfig);
        history.remember_init();
    },
    init:function(map, flow_table, node_table, table_panel, searchCtrl, history, toolbar, node_definition_view, intfConfig){
        this.initDataSource(map);
        this.initMap(map, flow_table, node_table, table_panel, node_definition_view, intfConfig, searchCtrl);
        this.initSearch(map, searchCtrl, node_definition_view, flow_table);
        this.initTable(map, flow_table, node_table, table_panel, node_definition_view);
        this.initHistory(history, map, node_definition_view, intfConfig);
        this.initToolbar(map, history, toolbar);
    },
    initHistory: function(history, map, node_definition_view, intfConfig){
        //set node after map revert
        //bug:set node twice
        //TODO:set node once
        map.bind({
            'revert':function(){
                var node = null;
                if(node_definition_view.node_id){
                    node = this.getNode(node_definition_view.node_id);
                    node_definition_view.setNode(node);
                }
                if(intfConfig.node_id){
                    if(!node || node.id != intfConfig.node_id){
                        if(node){
                            CBMSFLOW.debug('map revert trigger: node id different',{
                                'node_definition':node_definition_view.node_id,
                                'intfConfig':this.intfConfig.node_id
                            },'error');
                        }
                        node = this.getNode(intfConfig.node_id);
                    }
                    intfConfig.setNode(node);
                }
            }
        });
    },
    initDataSource:function(map){
        SpdMap.LocalDataSource.bind({
            "ajax.start":function(){
                if(this.isloaded){
                    $("#map-container").hide();
                    $("#map-loading").show();
                }
            },
            "ajax.success":function(){
                $("#map-container").show();
                $("#map-loading").hide();
                this.isloaded = true;
            },
            "ajax.error":function(){
                $("#map-container").show();
                $("#map-loading").hide();
                this.isloaded = true;
                if(CBMSFLOW.environment("DEBUG")){
                    CBMSFLOW.debug('error in RemoteDataSource');
                }
            }
        });
    },
    initMap:function(map, flow_table, node_table, table_panel, node_definition_view, intfConfig, searchCtrl){
        map.draw();
        map.zoomCtrl.zoomFitOrgInit();
        map.hideBox.bind({
            'click':function(){
                if(this.isSelected()){
                    return;
                }
                map.trigger('map.select.state', 'hideBox', map.hideBox);
                node_table.loads(this.getNodes());
            },
            'revert':function(){
                flow_table.switchController('box');
                if(this.isSelected()){
                    map.trigger('map.select.state', 'hideBox', map.hideBox);
                }
                node_table.loads(this.getNodes());
            },
            'take.out':function(node, edges, x, y){
                node.show();
                node.moveTo(x, y);
                var conn_nodes = [];
                $.each(edges, function(i, edge){
                    edge.updatePath(map.r);
                    edge.show();
                    if(edge.nodeA.id == node.id){
                        conn_nodes.push(edge.nodeB);
                    }else{
                        conn_nodes.push(edge.nodeA);
                    }
                });
                SpdMap.Node.updateIpPortsPort([node]);
                SpdMap.Node.addIpPortsPort(conn_nodes, node);
                SpdMap.Node.updateClientsByNode(node);
                SpdMap.Node.updateOppsiteClientsByNode(node, [], node.servers);
                map.hightlightMatchNodesAndEdgesByNode(node);
                map.getLock('changed');
                node.trigger('click');
                map.nodeClick(node);
                node.setSelect();
                map.releaseLock('changed');
                map.changed('node.show');
                //node.setSelect();
            },
            'catch.stop':function(){
                node_table.loads(this.getNodes());
            },
            'put.stop':function(nodes, edges){
                var conn_nodes = [];
                $.each(edges, function(i, edge){
                    if(!_.some(nodes, function(node){return node.id == edge.nodeA.id;})){
                        conn_nodes.push(edge.nodeA);
                    }
                    else if(!_.some(nodes, function(node){return node.id == edge.nodeB.id;})){
                        conn_nodes.push(edge.nodeB);
                    }
                });
                if(nodes.length > 0){
                    var node = nodes[0];
                    SpdMap.Node.updateIpPortsPort(conn_nodes);
                    SpdMap.Node.clearIpPortsPort(node);
                    SpdMap.Node.clearClients(node);
                    SpdMap.Node.updateOppsiteClientsByNode(node, node.servers, []);
                    map.hightlightMatchNodesAndEdgesByNode(node);
                    if(node.getSelect()){
                        node.clearSelect();
                        map._mapClick();
                        map.trigger('map.select.state', 'none');
                    }
                }
                node_table.loads(this.getNodes());

                var selectedNode = map.getSelectNode();
                if (selectedNode) {
                    var query = map.makeNodeQueryData(selectedNode);
                    map.dataSource.getFlowsByIpports(query, function(flows){
                        node_definition_view.update(selectedNode, flows['flows'] || [], map.ipDeviceMap);
                        intfConfig.load(flows['flows'] || [], selectedNode, map.ipDeviceMap);
                    });
                }
            }
        });

        map.bind({
            'revert':function(){
                if(this.hideBox.isSelected()){
                    map.trigger('map.select.state', 'hideBox', map.hideBox);
                    node_table.loads(this.hideBox.getNodes());
                }
            }
        });

        map.bind({
            'node.select':function(data){
                if(data.node && !data.node.raw){
                    node_definition_view.update(data.node, data.flows, data.ipDeviceMap);
                    intfConfig.load(data.flows, data.node, data.ipDeviceMap);
                }
            },
            'map.select.state':function(type, data){
                if (type === 'combined') {
                    table_panel.switchMode('combined');
                } else if(type == 'node' && !data.raw){
                    table_panel.switchMode('node');
                }
                else{
                    if(type == 'hideBox'){
                        table_panel.switchMode('hideBox');
                    }
                    else {
                        table_panel.switchMode('default');
                    }
                    intfConfig.clearNode();
                    node_definition_view.clearNode();
                }

            },
            'combing':function(){
                searchCtrl.emptySearch();
            },
            'map.node.changed' : function(node, changed){
                if(node.getSelect()){
                    var raw_changed = _.contains(changed, 'raw');
                    var convert = _.contains(changed, 'convert');
                    if(raw_changed){
                        if(!node.raw){
                            table_panel.switchMode('node');
                        }
                        else if(node.raw){
                            table_panel.switchMode('default');
                        }
                    }
                    if(convert){
                        // if ip ports changed, reload flowtable, node definition and intfConfig
                        var query = map.makeNodeQueryData(node);
                        map.dataSource.getFlowsByIpports(query, function(flows){
                            node_definition_view.update(node, flows['flows'] || [], map.ipDeviceMap);
                            intfConfig.load(flows['flows']||[], node, map.ipDeviceMap);
                        });
                    }
                }
            },
            'map.node.renamed' : function(newName){
                flow_table.renameNodeA(newName);
            },
        });

        node_definition_view.bind({
            'ip.removed' : function(node_id, ip){
                var node = map.getNode(node_id);
                intfConfig.removeIp(ip);
                var query = map.makeNodeQueryData(node);
                map.dataSource.getFlowsByIpports(query, function(flows){
                    intfConfig.load(flows['flows']||[], node, map.ipDeviceMap);
                    flow_table.renderTable(flows);
                });
                $('.node-definition-value-container').mCustomScrollbar('update');
            },
            'node.removed' : function(node_id){
                var node = map.getNode(node_id);
                map.removeNode(node);
            }
        });

        if(!this.isloaded){
            $("#map-container").hide();
            $("#map-loading").show();
            this.isloaded = true;
        }

    },
    initSearch:function(map, searchCtrl, node_definition_view){
        searchCtrl.bind('search.done', function(e){
            map.setSearchResult(e);
            map.highlightFlowList(e['query']);
            map.changed("search.done");
        });
        searchCtrl.bind('search.clear', function(e){
            map.clearSearchResult();
            map.highlightFlowList();
            map.changed("search.clear");
        });
    },
    initTable:function(map, flow_table, node_table, table_panel, node_definition_view){
        //flow table
        // debugger;
        map.setFlowTable(flow_table);
        flow_table.setMap(map);
        flow_table.getAllFlows();

        //node table
        node_table.bind({
            'dragnode.start':function(event,ui,node_name){
                var hide_node = map.hideBox.getNodeByName(node_name);
                this._dragnode_start_pos = this._dragnode_start_pos || {};
                this._dragnode_start_pos[node_name] = hide_node.getPos();
            },
            'dragnode.confirm':function(event,ui,node_name){
                var offset = {
                    'x':event.clientX,
                    'y':event.clientY,
                    'h':$("#flow-block").height()
                };
                var moffset = {
                    'x':map.container.offset().left,
                    'y':map.container.offset().top,
                    'h':map.container.height()
                };
                if(offset.y <= moffset.y || offset.y >= (moffset.y + moffset.h - offset.h)){
                    return false;
                }
                var pos = map.windowPosToMapPos(offset);
                var nodes = map.getVisibleNodes();
                $.each(nodes, function(i, item){
                    item.clearIntersect();
                });

                var hide_node = map.hideBox.getNodeByName(node_name);
                hide_node.moveTo(pos.x, pos.y);
                if(map.hideBox.isNodeTouch(hide_node)){
                    map.hideBox.highlight();
                    return false;
                }
                else{
                    map.hideBox.clearHighlight();
                }
                var intersect_node = map.getIntersectNode(hide_node);
                if(intersect_node){
                    intersect_node.setIntersect();
                    return false;
                }
                return true;
            },
            'dragnode.cancel':function(event,ui,node_name){
                var nodes = map.getVisibleNodes();
                for(var i in nodes){
                    var node = nodes[i];
                    node.clearIntersect();
                }
                map.hideBox.clearHighlight();
                var hide_node = map.hideBox.getNodeByName(node_name);
                var pos = this._dragnode_start_pos[node_name];
                hide_node.moveTo(pos.x, pos.y);
            },
            'dragnode.submit':function(event,ui,node_name){
                var offset = {
                    'x':event.clientX,
                    'y':event.clientY
                };
                var pos = map.windowPosToMapPos(offset);
                var node = map.hideBox.getNodeByName(node_name);
                map.hideBox.tableOutNode(node, pos.x, pos.y);
            }
        });

    },
    initToolbar:function(map ,history, toolbar){
        var map_name = CBMSFLOW.environment('map_name');
        if (!CBMSFLOW.environment('compareMode')) {
            history.bind({
                'revert.update':function(){
                    if(this.isLast()){
                        toolbar.disable('redo');
                    }
                    else{
                        toolbar.enable('redo');
                    }
                    if(this.isFirst()){
                        toolbar.disable('undo');
                    }
                    else{
                        toolbar.enable('undo');
                    }
                },
                'remember.update':function(s){
                    if(!this.isFirst()){
                        toolbar.enable('undo');
                    }
                    else{
                        toolbar.disable('undo');
                    }
                    toolbar.disable('redo');
                },
                'revert':function(){
                    this.trigger('revert.update');
                },
                'remember':function(){
                    this.trigger('remember.update');
                }
            });
            history.trigger('remember.update');
        }



        toolbar.bind({
            'undo.click':function(){
                history.undo();
            },
            'redo.click':function(){
                history.redo();
            },
            'save.click':function(){
                var datasource_id = window.localStorage.getItem("spdName"),
                    map_data = map.getSaveData();
                $('#map-saving img').show();
                $('#map-saving span').text(gettext('正在保存...'));
                $('#map-saving').slideDown('slow');
                $.ajax({
                    url: '../save/',
                    type: 'POST',
                    dataType: 'json',
                    data: appendCsrfToken({"map": JSON.stringify(map_data),"datasource": datasource_id}),
                    success: function(result){
                        setTimeout(function(){
                            $('#map-saving img').hide();
                            $('#map-saving span').text(gettext('保存完成'));
                            setTimeout(function() {
                                $('#map-saving').slideUp('slow');
                            }, 1000);
                        }, 1000);
                    }
                });
                map.saved = true;
            },
            'setting.click':function(){
                var FrameDispatchInstance = CBMSFLOW.environment('frameDispatch', FrameDispatchInstance);
                FrameDispatchInstance.toggle('settings');
            },
            'preview.click':function(){
                var FrameDispatchInstance = CBMSFLOW.environment('frameDispatch', FrameDispatchInstance);
                FrameDispatchInstance.toggle('preview');
            },
            'convert.click':function(){
                map.toggleRawNodeDispState();
            },
            'combing.click':function() {
                var permissionData = CBMSFLOW.environment('permissionData');
                var ifSessionImport = permissionData.spd_session_relation_import;
                if(ifSessionImport) new AutocombingPop().show();
                else return
                
            },
            'reset.click':function() {
                new AutocombingPop().resetCompNodes();
            }
        });

        if (CBMSFLOW.environment('compareMode')) {
            ['undo', 'redo', 'save', 'setting', 'preview', 'convert', 'combing', 'reset'].forEach(function(tool) {
                toolbar.disable(tool);
            });
        }

        map.bind({
            'changed':function(action){
                if(action != 'born'){
                    map.saved = false;
                }
            },
            'revert':function(){
                map.saved = false;
            }
        });

    }
},{
    fixWindowSize:function(map_block){
        map_block.height(Math.max(1, $(window).height() + $(window).scrollTop() - map_block.offset().top));
    },
    __setup__:function(){
        $(window).bind('beforeunload', function(event){
            var map = CBMSFLOW.environment('topovmap');
            if(map && map.saved === false){
                return gettext('当前更改未保存。');
            }
            return null;
        });
    }
});
