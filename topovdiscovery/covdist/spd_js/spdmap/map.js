var SpdMap = CBMSFLOW.module('spdmap');
SpdMap.BaseMap = CBMSFLOW.klass(SpdMap.RevertObject, {
    minNodeSize: 8,
    maxNodeSize: 30,
    zeroNodeSize: 12,
    __init__: function(container){
        if(typeof container == 'string'){
            container = $(container);
        }
        this.container = $(container);
        this.containerId = this.container.attr('id');
        this.w =  this._calcMapWidth();
        this.h =  this._calcMapHeight();
        this.r = Raphael(this.container[0], this.w, this.h);
        this.nodes = [];
        this.edges = [];
        this.bindMapResize();
    },
    bindMapResize:function(){
        var _this = this;

        var resizeHandler = function (n) {
            
            return function (e) {
                e.stopPropagation();

                setTimeout(function () {
                    _this.h = Math.max(1, _this._calcMapHeight());
                    _this.w = Math.max(1, _this._calcMapWidth());
                    _this.r.setSize(_this.w, _this.h);
                }, n);
            };
        };

        window.addEventListener('resize', resizeHandler(700));
        this.container.bind("resize", resizeHandler(0));

    },
    _calcMapHeight:function(){
        return this.container.height();
    },
    _calcMapWidth:function(){
        return this.container.width();
    },
    reCalcNodesSize: function(){
        this.nodeWeightRanges = this.getNodeWeightRanges();
        this.nodeSizeRanges = this.getNodeSizeRanges();

        var self = this;
        $.each(this.nodes, function(i, node){
            var nodeSize = self.calcNodeSize(node);
            node.setSize(nodeSize);
        });
    },
    calcNodeSize: function(node){
        var nodeWeight = node.weight;
        if(nodeWeight == 0){
            return this.zeroNodeSize;
        }
        var weightRangeCount = this.nodeWeightRanges.length;
        var weightRangeIndex = weightRangeCount - 1;
        $.each(this.nodeWeightRanges, function(i, item){
            if(nodeWeight < item[1]){
                weightRangeIndex = i;
                return false;
            }
            return true;
        });
        var sizeRangeCount = this.nodeSizeRanges.length;
        var sizeRangeIndex = sizeRangeCount - 1;
        if(weightRangeIndex < sizeRangeCount){
            sizeRangeIndex = weightRangeIndex;
        }
        var weightRange = this.nodeWeightRanges[weightRangeIndex];
        var sizeRange = this.nodeSizeRanges[sizeRangeIndex];
        var ratio = 0;
        if(weightRange[1] != weightRange[0]){
            ratio = Math.min((nodeWeight-weightRange[0]) / (weightRange[1]-weightRange[0]), 1);
        }
        return Math.round(sizeRange[0] + ratio*(sizeRange[1]-sizeRange[0]));
    },
    getNodeSizeRanges: function(){
        var deltaSize = this.maxNodeSize - this.minNodeSize;
        var lowEdgeSize = this.minNodeSize + deltaSize * 0.2;
        var middleEdgeSize = lowEdgeSize + deltaSize * 0.4;
        var highEdgeSize = middleEdgeSize + deltaSize * 0.3;
        return [[this.minNodeSize, lowEdgeSize], [lowEdgeSize, middleEdgeSize], [middleEdgeSize, highEdgeSize], [highEdgeSize, this.maxNodeSize]];
    },
    getNodeWeightRanges: function(){
        var weights = [];
        $.each(this.nodes, function(i, node){
            weights.push(node.weight);
        });
        var minWeight = weights[0];
        var maxWeight = weights[0];
        var totalWeight = 0;
        $.each(weights, function(i, w){
            totalWeight += w;
            if(w < minWeight){
                minWeight = w;
            }else if(w > maxWeight){
                maxWeight = w;
            }
        });
        var highEdgeWeight = maxWeight + (totalWeight-maxWeight)*0.6;
        return [[0, minWeight],[minWeight, maxWeight], [maxWeight, highEdgeWeight], [highEdgeWeight, totalWeight]];
    },
    reCalcEdgesSize: function(){
        this.edgeWeightRanges = this.getEdgeWeightRanges();
        var self = this;
        $.each(this.edges, function(i, edge){
            var edgeSize = self.calcEdgeSize(edge);
            edge.setSize(edgeSize);
        });
    },
    calcEdgeSize: function(edge){
        var size = 2;
        var weight = edge.weight;
        if (weight <= this.edgeWeightRanges.low[1]) {
            size = 2;
        } else if (weight <= this.edgeWeightRanges.middle[1]) {
            size = 3;
        } else if (weight <= this.edgeWeightRanges.high[1]) {
            size = 4;
        }
        return size;
    },
    getEdgeWeightRanges: function() {
        var weights = $.map(this.edges||[], function(i) {
            return i.weight;
        });

        var r1 = 0.6;
        var r2 = 0.2;
        var r3 = 0.2;

        weights.sort(function(a, b) {return a > b ? 1 : -1;});

        var range = {
            'low': [0, weights[Math.ceil(weights.length * r1)]],
            'middle': [weights[Math.ceil(weights.length * r1)], weights[Math.ceil(weights.length * (r1+r2))]],
            'high': [weights[Math.ceil(weights.length * (r1+r2))], weights[weights.length-1]]
        };

        return range;
    },
    getConnectEdges: function(node, excludeUnVisible){
        excludeUnVisible = excludeUnVisible || false;
        var connectEdges = [];
        for(var i=0, edgeCount=this.edges.length; i < edgeCount; i++){
            var edge = this.edges[i];
            if(!excludeUnVisible || edge.isVisible()){
                var nodeA = edge.nodeA;
                var nodeB = edge.nodeB;
                if(nodeA.id == node.id || nodeB.id == node.id){
                    connectEdges.push(edge);
                }
            }
        }
        return connectEdges;
    },
    getConnectEdgesByNodeId: function(node_id, excludeUnVisible){
        excludeUnVisible = excludeUnVisible || false;
        return _.filter(this.edges || [] ,function(edge){
            return (edge.isVisible() || excludeUnVisible) && (edge.nodeA.id == node_id || edge.nodeB.id == node_id);
        });
    },
    drawNode: function(node){
        node.draw(this.r);
    },
    drawEdge: function(edge){
        edge.draw();
    },
    adjustZIndex: function(){
        $.each(this.edges, function(i, edge){
            edge.toBack();
        });
        $.each(this.nodes, function(i, node){
            node.pointToFront();
        });
        $.each(this.nodes, function(i, node){
            node.textToFront();
        });
        $.each(this.nodes, function (i, node) {
            node.contrastTextToFront();
        });
    },
    getNode: function(nodeId){
        for(var i=0, nodeCount=this.nodes.length; i < nodeCount; i++){
            if(this.nodes[i].id == nodeId){
                return this.nodes[i];
            }
        }
        return null;
    },
    getVisibleNodes: function(){
        var nodes = [];
        for(var i=0, nodeCount=this.nodes.length; i < nodeCount; i++){
            var node = this.nodes[i];
            if(node.isVisible()){
                nodes.push(node);
            }
        }
        return nodes;
    },
    getVisibleEdges: function(){
        var edges = [];
        for(var i in this.edges){
            var edge = this.edges[i];
            if(edge.isVisible()){
                edges.push(edge);
            }
        }
        return edges;
    },

    _generateNodes: function(nodes) {
        var results = [];
        for(var i=0, nodeCount=nodes.length; i < nodeCount; i++){
            results.push(new SpdMap.BaseNode(nodes[i]));
        }
        return results;
    },

    _generateEdges: function(edges) {
        var results = [];
        for (var i = 0, len = edges.length; i < len; i++) {
            edges[i].containerId = this.containerId;
            var edge = new SpdMap.BaseEdge(edges[i]);
            edge.nodeA = this.getNode(edges[i].nodeA);
            edge.nodeB = this.getNode(edges[i].nodeB);
            results.push(edge);
        }
        return results;
    },
    _getMapData:function(map_data){
        return $.extend(true, {}, map_data);
    },
    reload: function(map_data){
        this.clear();
        map_data = this._getMapData(map_data);
        this.nodes = this._generateNodes(map_data['nodes'] || []);
        this.edges = this._generateEdges(map_data['edges'] || []);
        this.draw();
    },
    reCalcSize: function(){
        this.reCalcNodesSize();
        this.reCalcEdgesSize();
    },
    draw: function(){
        this.r.clear();
        var self = this;
        $.each(this.nodes, function(i, node){
            self.drawNode(node);
        });
        $.each(this.edges, function(i, edge){
            self.drawEdge(edge);
        });
        this.adjustZIndex();
    },
    genOriginalProportion: function() {
        var nodes = this.getVisibleNodes();

        var minLeft = undefined;
        var maxLeft = undefined;
        var minTop  = undefined;
        var maxTop  = undefined;

        if (nodes.length === 0) {
            return [0, 1, 0, 1];
        }

        $.each(nodes, function(i, node) {
            var pos = node.getPos();

            if (minLeft == undefined && maxLeft == undefined && minTop == undefined && maxTop == undefined) {
                minLeft = pos.x;
                maxLeft = pos.x;
                minTop  = pos.y;
                maxTop  = pos.y;
            }

            minLeft = Math.min(minLeft, pos.x);
            maxLeft = Math.max(maxLeft, pos.x);
            minTop = Math.min(minTop,   pos.y);
            maxTop = Math.max(maxTop,   pos.y);
        });

        minLeft -= 100;
        minTop  -= 100;
        maxTop += 100;
        maxLeft += 100;

        return [minLeft, minTop, (maxLeft - minLeft), (maxTop - minTop)];
    },
    clearNodes: function(){
        while(true){
            node = this.nodes.pop();
            if(!node){break;}
            node.clear();
        }
    },
    clearEdges: function(){
        while(true){
            edge = this.edges.pop();
            if(!edge){break;}
            edge.clear();
        }
    },
    clear: function(){
        if(this.isLocked("clear")){
            return;
        }
        this.getLock("clear");
        this.clearNodes();
        this.clearEdges();
        this.r.clear();
        this.container.find('>svg').unbind("mousedown");
        this.container.find('>svg').unbind("click");
        this.container.unbind("resize");
        this.container = null;
        this.r = null;
        this.h = null;
        this.w = null;
    },
    getNodeViewBox: function(node){
        var box = node.getBBox();
        var pos1 = this.r.translatePosToViewBox({x:box.x, y:box.y});
        var pos2 = this.r.translatePosToViewBox({x:box.x2, y:box.y2});
        return {
            x:pos1.x,
            y:pos1.y,
            x2:pos2.x,
            y2:pos2.y
        };
    },
    getEdgeViewBox: function(edge){
        var box = edge.getBBox();
        var pos1 = this.r.translatePosToViewBox({x:box.x, y:box.y});
        var pos2 = this.r.translatePosToViewBox({x:box.x2, y:box.y2});
        return {
            x:pos1.x,
            y:pos1.y,
            x2:pos2.x,
            y2:pos2.y
        };
    },
    getNodeOffsetBox: function(node){
        var viewbox = this.getNodeViewBox(node);
        var offset = this.container.offset();
        return {
            x:viewbox.x + offset.left,
            y:viewbox.y + offset.top,
            x2:viewbox.x2 + offset.left,
            y2:viewbox.y2 + offset.top
        };
    },
    getEdgeOffsetBox: function(edge){
        var viewbox = this.getEdgeViewBox(edge);
        var offset = this.container.offset();
        return {
            x:viewbox.x + offset.left,
            y:viewbox.y + offset.top,
            x2:viewbox.x2 + offset.left,
            y2:viewbox.y2 + offset.top
        };
    },
    getSelectNode: function(){
        var selectNode = null;
        $.each(this.nodes, function(i, item){
            if(item.selected){
                selectNode = item;
                return false;
            }
            return null;
        });
        return selectNode;
    },
    getSelectEdge: function(){
        var selectEdge = null;
        $.each(this.edges, function(i, item){
            if(item.getSelect()){
                selectEdge = item;
                return false;
            }
            return null;
        });
        return selectEdge;
    },
    hasCompNodes: function() {
        var hasComp = false;

        $.each(this.nodes, function(i, item){
            if(!item.raw){
                hasComp = true;
                return false;
            }
            return null;
        });

        return hasComp;
    },
    hasHideNodes: function() {
        var hasHide = false;

        $.each(this.nodes, function(i, item){
            if(!item.visible){
                hasHide = true;
                return false;
            }
            return null;
        });

        return hasHide;
    },

    genPng: function(width, height) {
        var mapsvg = this.container.find('>svg');
        var map_size = this.zoomCtrl._genOriginalProportion();

        var png_box_width = width;
        var png_box_height = height;
        var map_width_str = 'width="'+width+'"';
        var map_height_str = 'height="'+height+'"';

        if((png_box_height/map_size[3]) * map_size[2] < png_box_width){
            var adj = png_box_height/map_size[3];
        }else{
            var adj = png_box_width/map_size[2];
        }
        var map_width = map_size[2] * adj;
        var map_height = map_size[3] * adj;
        map_size[0] = map_size[0] - ((png_box_width - map_width)/2)/adj;
        map_size[1] = map_size[1] - ((png_box_height - map_height)/2)/adj;

        var viewbox_str = 'viewBox="' + map_size.toString() + '"';
        var svg_parent = mapsvg.parent();
        var newmapsvg = jQuery.extend(true, {}, mapsvg);
        var mapsvghtml = newmapsvg[0];
        var p_div = $('<div></div>');
        p_div.append(mapsvghtml);
        svgtxt = p_div.html();

        var reheight = /height=\"[+-]?\d*\.?\d*\"/;
        var rewidth = /width=\"[+-]?\d*\.?\d*\"/;
        var reviewbox = /viewBox=\"[+-]?\d*\.?\d* [+-]?\d*\.?\d* [+-]?\d*\.?\d* [+-]?\d*\.?\d*\"/;
        svgtxt = svgtxt.replace(reheight, map_height_str).replace(rewidth, map_width_str).replace(reviewbox, viewbox_str);

        var canvas = $('<canvas id="canvas"></canvas> ');
        canvg(canvas[0], svgtxt);
        var map_png = canvas[0].toDataURL("image/png");

        svg_parent.append(mapsvg);
        return map_png;
    }
});

SpdMap.ClickableMap = CBMSFLOW.klass(SpdMap.BaseMap, {
    __init__:function($super, container){
        $super(container);
        this.bindMapClick();
    },

    getSelectState: function(){
        var node = this.getSelectNode();
        if(node){
            return ['node', node];
        }
        var edge = this.getSelectEdge();
        if(edge){
            return ['edge', edge];
        }
        return ['none', null];
    },

    bindMapClick: function() {
        var self = this;

        //fix problem: click on svg, search input still have focus
        this.container.find('>svg').mousedown(function(e) {
            $(':focus').each(function(i, item){ item.blur(); });
        });


        this.container.find('>svg').click(function(e) {
            resize_table();
            //when we are just dragging the canvas, don't trigger click event
            if(self.r._isDragging){
                self.r._isDragging = false;
                return false;
            }
            if ($.inArray(e.target.tagName, ['path', 'rect', 'circle', 'tspan', 'line']) != -1) {
                return undefined;
            }
            var prevState = self.getSelectState();
            if(prevState[0] != 'none'){
                self._mapClick();
                if (!CBMSFLOW.environment('combined')) {
                    self.trigger('map.select.state', 'none');
                } else {
                    self.trigger('map.select.state', 'combined');
                }
                self.changed('click');
            }

            // e.stopPropagation();
        });

    },
    _mapClick:function(){},
    drawNode: function($super, node){
        $super(node);
        this.bindNodeClick(node);
    },
    drawEdge: function($super, edge){
        $super(edge);
        this.bindEdgeClick(edge);
    },
    bindEdgeClick: function(edge) {
        edge.click($.proxy(this.edgeClick, this));
    },
    bindNodeClick: function(node){
        node.click(this.r, $.proxy(this.nodeClick, this));
    },
    edgeClick: function(edge){},
    nodeClick: function(node){}
});

SpdMap.PreviewMap = CBMSFLOW.klass(SpdMap.ClickableMap, {
    __init__: function($super, container){
        $super(container);
        this.zoomCtrl = new SpdMap.PreviewZoomCtrl(this.container.find('.zoom-ctrl'), this);
        this.ipDeviceMap = CBMSFLOW.environment('ipDeviceMap');
        this._popup();
        this._bindEvents();
        this.dataSource = CBMSFLOW.environment('flowlistProxy');
    },

    _popup: function(){
        this.nodePopup = new SpdMap.PreviewMapNodePopup($(".preview-map-popup-node", this.container),{
            "hideCallback":$.proxy(this.clearClickStyle, this)
        });
        this.edgePopup = new SpdMap.PreviewMapEdgePopup($(".preview-map-popup-edge", this.container),{
            "hideCallback":$.proxy(this.clearClickStyle, this)
        });
    },
    _bindEvents: function(){
        var _this = this;
        this.zoomCtrl.bind("zoom.change", function(){
            if(_this.selectNode){
                _this.nodePopup.moveByOffsetBox(_this.getNodeOffsetBox(_this.selectNode));
            }
            if(_this.selectEdge){
                _this.edgePopup.moveByOffsetBox(_this.getEdgeOffsetBox(_this.selectEdge));
            }
        });
    },
    _unbindEvents: function(){
        this.zoomCtrl.unbind("zoom.change");
    },
    _mapClick: function(){
        this.clearClick();
    },
    _getMapData: function($super, map_data){
        this.map_data = $super(map_data);
        return this.map_data;
    },
    _generateNodes: function(nodes){
        var results = [];
        for(var i=0, nodeCount=nodes.length; i < nodeCount; i++){
            results.push(new SpdMap.PreviewNode(nodes[i]));
        }
        return results;
    },
    load: function(map_data){
        map_data = this._getMapData(map_data);
        this.nodes = this._generateNodes(map_data['nodes'] || []);
        this.edges = this._generateEdges(map_data['edges'] || []);
        this.draw();

        var self = this;
        if(CBMSFLOW.environment('SPD.PROTOCOL')){

            var ipports = _.map(this.nodes, function(n) {return n.ip_ports});
            var query = {type: 'nodes', ipports_list: JSON.stringify(ipports)};
            this.dataSource.getFlowsByIpports(query, function(flows){
                var flows = flows['flows']||[];
                console.time('Get PROTOCOL');
                var protocolMap = self._getProtocols(flows);
                console.timeEnd('Get PROTOCOL');
                console.time('Merge');
                var protocolIdentify = new SpdMap.ProtocolIdentify(self.nodes, protocolMap);
                protocolIdentify.mergeProtocols();
                console.timeEnd('Merge');
                console.time('add Protocol to node');
                protocolIdentify.addProtocolToNode();
                console.timeEnd('add Protocol to node');
                console.timeEnd('START PROTOCOL');
            });
        }

        var self = this;
        setTimeout(function () {            
            var originlProportion = self.zoomCtrl._genOriginalProportion();
            self.zoomCtrl.setViewBox(originlProportion[0],originlProportion[1], originlProportion[2],originlProportion[3]);
        }, 100);

    },
    draw: function(){
        this.r.clear();
        var self = this;
        $.each(this.nodes, function(i, node){
            self.drawNode(node);
            if(!node.isVisible()){
                node.hide();
            }
        });
        $.each(this.edges, function(i, edge){
            self.drawEdge(edge);
        });
        this.adjustZIndex();
    },
    reCalcSize: function(){
    },
    getSaveData: function(){
        this.map_data = this.map_data||{};
        if(CBMSFLOW.environment('SPD.PROTOCOL')){
            for (var i=0; i < this.nodes.length; i++) {
                var node_1 = this.nodes[i];
                for (var j=0; j < this.map_data.nodes.length; j++) {
                    var node_2 =  this.map_data.nodes[j];
                    if (node_1['id'] == node_2['id']){
                        node_2['protocolMap'] = node_1['protocolMap'];
                        break;
                    }
                }
            }
        }
        return this.map_data;
    },
    clearEdgeStyle: function() {
        var self = this;
        $.each(this.edges, function(i, item){
            item.clearSelect(self.r);
        });
    },
    clearNodesStyle: function() {
        $.each(this.nodes, function(i, item){
            item.clearSelect();
        });
    },
    clearClickStyle: function(){
        this.clearEdgeStyle();
        this.clearNodesStyle();
        this.selectEdge = null;
        this.selectNode = null;
    },
    clearClick:function(){
        this.clearClickStyle();
        this.nodePopup.hide();
        this.edgePopup.hide();
    },
    edgeClick: function(edge){
        if(edge.getSelect()){
            if(!edge.nodeA.getSelect() && !edge.nodeB.getSelect()){
                return;
            }
        }
        this.clearClick();
        edge.setSelect();
        this.selectEdge = edge;
        this.edgePopup.popup(this.getEdgeData(edge), this.getEdgeOffsetBox(edge));
    },

    _getProtocols: function(flows) {
        var flows = flows;
        var flowCount = flows.length;
        var protocolMap = {};
        var nodes = this.nodes;
        var nodesCount = nodes.length;

        for (var i=0; i < flowCount; i++) {
            var f = flows[i];
            var ip_a = f['ip_a'];
            var port_a =f['port_a'];
            var ip_b = f['ip_b'];
            var port_b =f['port_b'];


            for (var j=0; j < nodesCount; j++) {
                var node = nodes[j];

                var hasFoundInNode = false;

                for (var k=0,len=node.servers.length; k < len; k++) {
                    var server = node.servers[k];
                    var group = server.group;
                    var ips = server.ipports.ips||[];
                    var ports = server.ipports.ports||[];
                    var _ip = '';
                    var _port = '';
                    if (_.contains(ips, ip_a) && _.contains(ports, port_a)) {
                        _ip = ip_a;
                        _port = port_a;
                    } else if (_.contains(ips, ip_b) && _.contains(ports, port_b)) {
                        _ip = ip_b;
                        _port = port_b;
                    } else {
                        continue;
                    }

                    var key = node.name + '_' + group + '_' + _port;
                    var stacks = protocolMap[key];
                    if (stacks) {
                        stacks = stacks.concat(f['prot_stack']||[]);
                        protocolMap[key] = stacks;
                    } else {
                        protocolMap[key] = f['prot_stack']||[];
                    }

                    hasFoundInNode = true;
                    break;
                }

                if (hasFoundInNode) {
                    break;
                }
            }
        }

        return protocolMap;
    },

    nodeClick: function(node){
        var self = this;
        if(node.getSelect()){
            return;
        }
        this.clearClick();
        node.setSelect();
        var edges = this.getConnectEdges(node);
        $.each(edges, function(i, item){
            item.setSelect();
        });
        this.selectNode = node;
        this.nodePopup.popup(this.getNodeData(node), this.getNodeOffsetBox(node), edges);
    },
    getServerData: function(servers){
        var _this = this;
        return _.map(servers || [], function(server){
            return {
                group:server.group,
                ports:server.ipports.ports,
                ips:_.map(server.ipports.ips, function(ip){
                    return {
                        ip:ip,
                        device:_this.ipDeviceMap[ip] || ""
                    };
                })
            };
        });
    },
    getClientData:function(clients){
        var _this = this;
        return {
            "ips":_.map(_.uniq(_.pluck(_.flatten(_.pluck(clients || [], "ipports"), true), "ip")), function(ip){
                return {
                    ip:ip,
                    device:_this.ipDeviceMap[ip] || ""
                };
            })
        };
    },
    getNodeData: function(node){
        var _this = this;
        return {
            title:node.name,
            servers:_this.getServerData(node.servers),
            clients:_this.getClientData(node.clients),
            protocolMap: node['protocolMap']||{},
            id: node.id,
            type: node.type || 'client',
        };
    },
    getNodeServerData: function(node){
        var _this = this;
        return {
            mode:'node',
            node:node.name,
            servers:_this.getServerData(node.servers)
        };
    },
    getEdgeData: function(edge){
        function matchIpport(ipport, server){
            var match = false;
            $.each(server.ips, function(i, ip){
                if(ip.ip == ipport.ip){
                    match = true;
                    return false;
                }
                return null;
            });
            if(match && $.inArray(ipport.port, server.ports) != -1){
                return true;
            }
            return false;
        }
        var _this = this;
        var direction = [false, false];
        var nodeA = {"title":edge.nodeA.name};
        var nodeB = {"title":edge.nodeB.name};
        var links = [[],[]];

        if(edge.direction[0]){
            var nodeA_servers_raw = this.getServerData(edge.nodeA.servers);
            var matchA_clients = {};
            nodeA.servers = [];
            nodeB.clients = this.getClientData(_.filter(edge.nodeB.clients || [], function(client){
                var match = false;
                var cserver = client.server;
                $.each(nodeA_servers_raw, function(i, server){
                    if(matchIpport(cserver, server)){
                        if(!matchA_clients[i]){
                            matchA_clients[i] = [];
                        }
                        matchA_clients[i].push(client);
                        nodeA.servers.push(server);
                        match = true;
                        direction[0] = true;
                    }
                });
                return match;
            }));
            links[0] = _.map(_.sortBy(_.pairs(matchA_clients), function(client_pair){
                return client_pair[0];
            }), function(client_pair){
                return {"clients":_this.getClientData(client_pair[1]), "servers":[nodeA_servers_raw[client_pair[0]]]};
            });
        }

        if(edge.direction[1]){
            var nodeB_servers_raw = this.getServerData(edge.nodeB.servers);
            var matchB_clients = {};
            nodeB.servers = [];
            nodeA.clients = this.getClientData(_.filter(edge.nodeA.clients || [], function(client){
                var match = false;
                var cserver = client.server;
                $.each(nodeB_servers_raw, function(i, server){
                    if(matchIpport(cserver, server)){
                        if(!matchB_clients[i]){
                            matchB_clients[i] = [];
                        }
                        matchB_clients[i].push(client);
                        nodeB.servers.push(server);
                        match = true;
                        direction[1] = true;
                    }
                });
                return match;
            }));
            links[1] = _.map(_.sortBy(_.pairs(matchB_clients), function(client_pair){
                return client_pair[0];
            }), function(client_pair){
                return {"clients":_this.getClientData(client_pair[1]), "servers":[nodeB_servers_raw[client_pair[0]]]};
            });
        }

        var pos_direction = 0;
        var posA = edge.nodeA.getPos();
        var posB = edge.nodeB.getPos();

        /*
         var radiusA = edge.nodeA.getInnerRadius();
         var radiusB = edge.nodeB.getInnerRadius();
         var posOffset = radiusA + radiusB;
         */
        var posOffset = 0;

        var of_l = posA.x - posB.x;
        if(of_l > 0){
            pos_direction = 1;
        }
        if(of_l <= posOffset && of_l + posOffset >= 0){
            var of_t = posA.y - posB.y;
            if(of_t > posOffset){
                pos_direction = 1;
            }
            else if(of_t + posOffset < 0){
                pos_direction = 0;
            }
        }

        return {
            title:gettext("访问关系"),
            nodeA:nodeA,
            nodeB:nodeB,
            links:links,
            direction:direction,
            pos_direction:pos_direction
        };
    },
    getAllNodeData: function(node){
        return _.map(this.nodes, $.proxy(this.getNodeServerData, this));
    },
    getAllEdgeData: function(edge){
        return _.map(this.edges, $.proxy(this.getEdgeData, this));
    },
    setZoom: function(zoom, pos, current){
        this.zoomCtrl.setZoom(zoom, pos, current);
    },
    clear: function($super){
        this.clearClickStyle();
        $super();
        this._unbindEvents();
        this.zoomCtrl.clear();
        this.nodePopup.destroy();
        this.edgePopup.destroy();
        this.map_data = null;
        this.zoomCtrl = null;
        this.nodePopup = null;
        this.edgePopup = null;
        this.ipDeviceMap = null;
    }
});


SpdMap.SnapshotMap = CBMSFLOW.klass(SpdMap.PreviewMap, {
    __init__: function($super, container, nodes, edges){
        $super(container);
        this.nodes = this._generateNodes(nodes);
        this.edges = this._generateEdges(edges);
        this.snapshot_map_data = {'nodes':nodes, 'edges':edges};
    },
    _popup: function(){
        this.nodePopup = new SpdMap.SnapshotMapNodePopup($(".snapshot-map-popup-node", this.container),{
            "hideCallback":$.proxy(this.clearClickStyle, this)
        });
        this.edgePopup = new SpdMap.SnapshotMapEdgePopup($(".snapshot-map-popup-edge", this.container),{
            "hideCallback":$.proxy(this.clearClickStyle, this)
        });
    },
    load: function(map_data) {
        map_data = this._getMapData(map_data);
        this.nodes = this._generateNodes(map_data['nodes'] || []);
        this.edges = this._generateEdges(map_data['edges'] || []);
        this.draw();
    },
    _calcMapHeight:function(){
        return this.container.height() - $("#snapshot_list_block").outerHeight();
    }
});

SpdMap.Map = CBMSFLOW.klass(SpdMap.ClickableMap, {
    newRNodeNamePrefix: gettext('组件'),
    __init__: function($super, container, nodes, edges, box){
        $super(container);
        this.containerId = container.attr('id');
        this.nodes = this._generateNodes(nodes);
        this.edges = this._generateEdges(edges);
        this.hideBox = this._generateHideBox(box);
        this.drawBox();
        this.reCalcNodesSize();
        this.reCalcEdgesSize();
        this.calcLayout(this.w - this.maxNodeSize, this.h - this.maxNodeSize);
        this.dataSource = CBMSFLOW.environment('flowlistProxy');
        this.mergeModal = new SpdMap.MergeNodesModal();
        this.zoomCtrl = new SpdMap.ZoomCtrl(this.container.find('.zoom-ctrl'), this);
        this.nameditor = new SpdMap.NameEditor(this);
        this.bindViewBoxChange();
        this.bindEvents();
        this.rawNodeDispState = 'ip';
        this.ipDeviceMap = CBMSFLOW.environment('ipDeviceMap');
        this.isloaded = false;
        this.zoomCtrl.zoomFit();
        this.setMapStyle();
    },
    setMapStyle: function(){
        $('svg', this.container).css({
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'z-index': '1'
        });
    },
    setFlowTable: function(flowTable) {
        this.flowTable = flowTable;
    },
    _generateNodes: function(nodes){
        var results = [];
        for(var i=0, nodeCount = nodes.length; i < nodeCount; i++){
            results.push(new SpdMap.Node(nodes[i]));
        }
        return results;
    },
    _generateEdges: function(edges) {
        var results = [];
        for (var i = 0, len = edges.length; i < len; i++) {
            edges[i].containerId = this.containerId;
            var edge = new SpdMap.Edge(edges[i]);
            edge.nodeA = this.getNode(edges[i].nodeA);
            edge.nodeB = this.getNode(edges[i].nodeB);
            results.push(edge);
        }
        return results;
    },
    _calcMapHeight:function(){
        return this.container.height() - $("#flow-block").outerHeight();
    },
    _mapClick:function(){
        this.nameditor.hideBox();
        //if (this.nameditor && this.nameditor.isEditState()) {
        //    if (!this.nameditor.save()) {
        //        return;
        //    } else {
        //        this.nameditor.hideBox();
        //    }
        //} else if (this.nameditor && !this.nameditor.isEditState()) {
        //    this.nameditor.hideBox();
        //}

        this.clearEdgeStyle();
        this.clearNodesStyle();
        $.each(this.nodes, function(i, item){
            item.clearUnSelect();
            item.clearPairSelect();
        });
        $.each(this.edges, function(i, item){
            item.clearUnSelect();
        });
        this.hideBox.clearSelect();

        $.each(this.getVisibleNodes(), function(i, node) {
            node.showText();
        });

        this.flowTable.clearSelectedNode();
        this.flowTable.disableFootTable();

        this.clearClick();
        this.loadFlowList(this.query, {});
    //    if(this.prevChange() != 'click') this.changed('click');
    },
    loadFlowList: function(query, match){
        if(this._showflow){
            clearTimeout(this._showflow);
            this._showflow = null;
        }
        this.query = query || [];
        this.match = match || {};
        if(_.isEmpty(this.match)){
            this.match = {'exclude' : this.getUnvisibleIpPorts()};
        }
        var _this = this;
        if(this.match['type']){
            this._showflow = this.loadDelay(function(){_this.flowTable.highlightFlow($.proxy(_this.dataSource.getFlowsByIpports, _this.dataSource), _this.query, _this.match);});
        }else{
            this._showflow = this.loadDelay(function(){_this.flowTable.highlightFlow($.proxy(_this.dataSource.getAllFlows, _this.dataSource), _this.query, _this.match);});
        }
    },
    bindEvents: function() {
        var self = this;
        if (!CBMSFLOW.environment('compareMode')) {
            this.hideBox.bind({
                'put.stop': function(nodes){
                    $.each(nodes||[], function(i, n) {
                        if (self.nameditor.node && (self.nameditor.node == n)) {
                            self.nameditor.hideBox();
                        }
                    });

                    var selectState = self.getSelectState();

                    if(selectState[0] == 'none'){
                        self.loadFlowList(self.query);
                    }
                    else if(selectState[0] == 'node'){
                        //TODO: if this current select node is not connected to the node put into hidebox, no need to do this
                        self.loadFlowList(self.query, self.makeNodeQueryData(selectState[1]));
                    }
                },
                'take.out': function(node){
                    var selectState = self.getSelectState();
                    if(selectState[0] == 'none'){
                        self.loadFlowList(self.query);
                    }
                    else if(selectState[0] == 'node'){
                        //TODO: if this current select node is not connected to the node put into hidebox, no need to do this
                        self.loadFlowList(self.query, self.makeNodeQueryData(selectState[1]));
                    }
                },

                'click': function(e) {
                    self.nameditor.hideBox();
                    if (self.nameditor.node && self.nameditor.node.isVisible()) {
                        self.nameditor.node.showText();
                    }
                }
            });
        }

        SpdMap.Node.unbind('click');
        SpdMap.Node.bind('click',function(){
            self.changed('node.click');
        });
        SpdMap.Node.unbind('renamed');
        SpdMap.Node.bind('renamed',function(newName){
            self.trigger('map.node.renamed', newName);
        });
        SpdMap.Edge.unbind('click');
        SpdMap.Edge.bind('click',function(){
            self.changed('edge.click');
        });
        SpdMap.NameEditor.unbind('save.done');
        SpdMap.NameEditor.unbind('convert');
        SpdMap.NameEditor.bind({
            "save.done": function(){
                self.changed('node.rename');
            },
            "convert": function(node){
                self.trigger('map.node.changed', node, ['raw', 'convert']);
                self.changed('node.convert');
            }
        });


        /*$(document.body).click(function(e) {
             $('.flow-table-value-container').trigger('resize');
            $('#topovmap-edit').trigger("resize");
            if ($(e.target).parents('#text-edit').length == 1) {
                return false;
            }
            var node = self.getSelectNode();
            if(node && !CBMSFLOW.environment('compareMode')){
                self.nameditor.showAt(node);
            }
        });*/
    },
    getMapPng: function(map_data){
        var nodesBak = this.nodes;
        var edgesBak = this.edges;

        this.r.clear();
        this.nodes = this._generateNodes(map_data['nodes']);
        this.edges = this._generateEdges(map_data['edges']);
        this.draw();

        var map_png = this.genPng(295, 162);

        this.nodes = nodesBak;
        this.edges = edgesBak;
        this.draw();

        if(map_data['nodes'].length == 0){
            return '';
        }
        return map_png;

    },
    draw: function($super){
        this.hideBox.reset();
        $super();
        this.changeRawNodeDispState();
        this.isloaded = true;
    },
    drawNode: function($super, node){
        $super(node);
        this.bindNodeDrag(node);
        if(!node.isVisible()){
            this.hideBox.addNode(node);
        }
    },
    drawEdge: function($super, edge){
        $super(edge);
        if(!edge.isVisible()){
            this.hideBox.addEdge(edge);
        }
    },
    drawBox:function(){
        var self = this;
        this.hideBox.draw(self.r);
        /*
        this.hideBox.drag(self.r,
            function(){
                this.onCatch();
            },function(){
                this.toFront();
                this.startCatch(self.getVisibleNodes(), self.getVisibleEdges());
            },function(){
                this.stopCatch();
            }
        );
        */
        var getData = function(){
            var nodes = self.hideBox.getNodes();
            var node_data = [];
            for(var i in nodes){
                var node = nodes[i];
                node_data.push(node.ip_ports);
            }
            return {type: 'nodes', ipports_list: JSON.stringify(node_data)};
        };
        this.hideBox.click(function(){
            if(this.isSelected()){
                return;
            }
            self.flowTable.switchController('box');
            self.loadFlowList(self.query || [], getData());
            self.clearClick();
            self.changed('click.clear');
        });
        this.hideBox.bind('revert', function(){
            if(this.isSelected()){
                self.loadFlowList(self.query || [], getData());
            }
        });
        this.hideBox.bind('put.stop',function(){
            if(this.isSelected()){
                self.loadFlowList(self.query || [], getData());
            }
        });
    },
    loadDelay: function(func, delay_time){
        if(delay_time == undefined){
            delay_time = 50;
        }
        if(delay_time == 0){
            func();
            return null;
        }
        else{
            return setTimeout(func, delay_time);
        }
    },
    adjustZIndex: function($super){
        $super();
        this.hideBox.toFront();
    },
    _generateHideBox: function(box){
        return new SpdMap.FixedHideBox(box);
    },
    getNodeByIpport: function(ipport){
        var result = null;
        $.each(this.nodes, function(i, node){
            var nodeIpPort = node.getIpPort(ipport);
            if(nodeIpPort){
                result = {'node': node, 'ipport': nodeIpPort};
                return false;
            }
            return null;
        });
        return result;
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
    newRipeNodeName: function(){
        var nextIndex = this.nextRipeNodeNameIndex();
        this.nextRNodeNameIndex += 1;
        return this.newRNodeNamePrefix + nextIndex;
    },
    nextRipeNodeNameIndex: function(){
        if(!this.nextRNodeNameIndex){
            var nextIndex = 1;
            var re = new RegExp('^' + this.newRNodeNamePrefix + '(\\d+)$');
            $.each(this.nodes, function(i, node){
                var result = re.exec(node.name);
                if(result){
                    var i = parseInt(result[1]);
                    if(i >= nextIndex){
                        nextIndex = i + 1;
                    }
                }
            });
            this.nextRNodeNameIndex = nextIndex;
        }
        return this.nextRNodeNameIndex;
    },
    clearClick:function(){
        this.hideBox.clearSelect();
        this.clearEdgeStyle();
        this.clearNodesStyle();
    },

    bindNodeDrag: function(node){
        node.drag(this.r, $.proxy(this.nodeDragMove, this), $.proxy(this.nodeDragStart, this), $.proxy(this.nodeDragEnd, this));
    },
    edgeClick: function(edge) {
        if(edge.getSelect() && !edge.nodeA.getSelect() && !edge.nodeB.getSelect()){
            return;
        }
        this.clearClick();
        this.flowTable.enableFootTable();
        this.nameditor.hideEditBox();
        edge.setSelect();

        this.setNodesEdgesSelectState([edge]);

        this.flowTable.clearSelectedNode();
        this.flowTable.switchController('node');
        var data = {type: 'links', ipports_pairs: JSON.stringify([{'from': edge.nodeA.ip_ports, 'to': edge.nodeB.ip_ports}])};
        var _this = this;
        _this.loadFlowList(_this.query || [], data);
        this.trigger('map.select.state', 'edge', edge);
    },
    nodeDragStart: function(node, x, y, event){
        this.nodeToFront(node);
        this.hideBox.startPut([node], this.getConnectEdges(node, true));
        this.dragIntersectNode = null;
    },
    nodeDragMove: function(node, dx, dy, x, y, event){
        this.updateConnectEdgesPath(node);
        if(this.dragIntersectNode){
            this.dragIntersectNode.clearIntersect();
        }
        var intersectNode = this.getIntersectNode(node);
        if(intersectNode){
            intersectNode.setIntersect();
            this.dragIntersectNode = intersectNode;
        }

        if(node.selected) {
            this.nameditor.moveBox();
        }
        node.textToFront();
        this.hideBox.onPut();
    },
    nodeDragEnd: function(node, startX, startY, event){
        var self = this;
        var intersectNode = this.getIntersectNode(node);
        if(intersectNode){
            intersectNode.setIntersect();
            var isConnect = this.isNodesConnect(node, intersectNode);
            if(isConnect){
                self.getLock('changed');
                node.moveToAnimate(this.r, startX, startY, 1e3, function(node, curX, curY){
                    node.setPos({'x': curX, 'y': curY});
                    self.updateConnectEdgesPath(node);
                    intersectNode.clearIntersect();
                });

                this.nameditor.moveBoxWithNode(node, startX, startY);

            }else{
                this.mergeNodes(intersectNode, node);
                var needMergeInfo = intersectNode.judgeNeedMergeSameNetSeg(node);
                if(needMergeInfo['needMerge']){
                    var otherSameNetSegNodes = this.getOtherSameNetSegNodes(intersectNode, node);

                    if(otherSameNetSegNodes.length > 0){
                        var existedIps = needMergeInfo['sameNetSegIps'];
                        var otherIps = $.map(otherSameNetSegNodes, function(item){
                            return item.ip_ports[0][0];
                        });

                        // popup merge nodes window and return.
                        var mergeCallback = $.proxy(this.genMergeSameNetSegNodes(intersectNode, node, otherSameNetSegNodes), this);

                        this.mergeModal.show(existedIps, otherIps, intersectNode, mergeCallback);
                        return;
                    }
                }
            }
        }
        this.nodeDragEndFinal();
    },
    nodeDragEndFinal: function(){
        this.adjustZIndex();
        this.selectNodeToFront();
        this.hideBox.stopPut();
        this.changed('node.drag');
        this.releaseLock('changed');
    },
    genMergeSameNetSegNodes: function(intersectNode, node, otherSameNetSegNodes){
        var realCallback = function(selectedIps){
            selectedIps = selectedIps || [];
            if(selectedIps.length > 0){
                var self = this;
                $.each(otherSameNetSegNodes, function(i, item){
                    var nodeIp = item.ip_ports[0][0];
                    if(selectedIps.indexOf(nodeIp) != -1){
                        self.mergeNodesMute(intersectNode, item);
                    }
                });
            }
            intersectNode.confirmMergeSameNetSeg(node);

            this.mergeNodes(intersectNode, node);
            this.nodeDragEndFinal();
        };
        return realCallback;
    },

    setNodesEdgesSelectState: function(toBeShowEdges) {

        if (toBeShowEdges.length == 0) {
            return;
        }

        var toBeShowNodes = [];
        $.each(toBeShowEdges, function(i, item){
            toBeShowNodes.push(item.nodeA);
            toBeShowNodes.push(item.nodeB);
            item.setSelect();
        });
        toBeShowNodes = _.uniq(toBeShowNodes);
        $.each(toBeShowNodes, function(i, item) {
            item.setPairSelect();
        });

        var toBeHiddenNodes = _.filter(this.getVisibleNodes(), function(n) { return !_.contains(toBeShowNodes, n); });
        $.each(toBeHiddenNodes, function(i, item) {
            item.setUnSelect();
        });

        var toHiddenEdges = _.filter(this.getVisibleEdges(), function(e) {return !_.contains(toBeShowEdges, e); });
        $.each(toHiddenEdges, function(i, item) {
            item.setUnSelect();
        });
    },

    nodeClick: function(node, force){
        force = force || false;
        if(node.getSelect() && !force){
            return;
        }
        this.clearClick();
        node.setSelect();
        this.flowTable.enableFootTable();

        var connectEdges = this.getConnectEdges(node);
        var edgeIpports = [];

        $.each(connectEdges, function(i, item){
            edgeIpports.push({'from': node.ip_ports, 'to': item.getAnotherNodeIpports(node)});
        });

        this.setNodesEdgesSelectState(connectEdges);
        this.adjustZIndex();
        this.nodeToFront(node);
        this.nameditor.showAt(node);
        this.showNodeTextExcept(node);

        var data = this.makeNodeQueryData(node);

        /*
        // 1. no node in trash, this node links edges's ip_ports
        // 2. has one node in trash, this node ip_ports
        var data = {};
        if (this.hasUnvisibleNodes(node)) {
            data = {type: 'nodes', ipports_list: JSON.stringify([node.ip_ports])};
        } else {
            data = {type: 'links', ipports_pairs: JSON.stringify(edgeIpports)};
        }
        */

        this.flowTable.setSelectedNode(node);
        this.flowTable.switchController('node');
        this.loadFlowList(this.query ||[], data);
        var self = this;
        self.dataSource.getFlowsByIpports(data, function(flows){
            self.trigger('node.select', {'flows' : flows['flows']||[], 'node' : node,  'ipDeviceMap' : self.ipDeviceMap});
        });
        this.trigger('map.select.state', 'node', node);
    },

    makeNodeQueryData : function(node){
        var data = {type: 'nodes',
                    ipports_list: JSON.stringify([node.ip_ports]),
                    exclude : this.getUnvisibleIpPorts(node)
                   };
        return data;
    },

    getSelectState: function(){
        var node = this.getSelectNode();
        if(node){
            return ['node', node];
        }
        var edge = this.getSelectEdge();
        if(edge){
            return ['edge', edge];
        }

        if(this.hideBox.getSelect()){
            return ['hideBox', this.hideBox];
        }

        return ['none', null];
    },

    toggleRawNodeDispState: function(){
        if(this.rawNodeDispState == 'ip'){
            this.rawNodeDispState = 'device';
        }else{
            this.rawNodeDispState = 'ip';
        }
        this.changeRawNodeDispState();
    },
    changeSingleRawNodeDispState: function(node){
        var newDispState = this.rawNodeDispState;
        var ipDeviceMap = this.ipDeviceMap;
        node.changeDispState(newDispState, ipDeviceMap);
    },
    changeRawNodeDispState: function(){
        var newDispState = this.rawNodeDispState;
        var ipDeviceMap = this.ipDeviceMap;
        $.each(this.nodes, function(i, node){
            if(node.raw){
                node.changeDispState(newDispState, ipDeviceMap);
            }
        });
    },

    showNodeTextExcept: function(node) {
        $.each(this.getVisibleNodes(), function(i, n) {
            if (n != node) {
                n.showText();
            }
        });
    },

    getOtherSameNetSegNodes: function(targetNode, node){
        if(!node.raw){
            return [];
        }
        var self = this;
        var otherSameNetSegNodes = [];
        var nodeIp = node.ip_ports[0][0];
        var nodeIpNetSeg = SpdMap.utils.extractIpNetSegment(nodeIp);
        $.each(this.nodes, function(i, item){
            if(item.raw){
                var itemIp = item.ip_ports[0][0];
                var itemIpNetSeg = SpdMap.utils.extractIpNetSegment(itemIp);
                if(itemIpNetSeg == nodeIpNetSeg && !self.isNodesConnect(targetNode, item)){
                    otherSameNetSegNodes.push(item);
                }
            }
        });
        return otherSameNetSegNodes;
    },
    clearEdgeStyle: function() {
        var self = this;
        $.each(this.edges, function(i, item){
            item.clearSelect(self.r);
            item.clearUnSelect();
        });
    },
    clearNodesStyle: function() {
        $.each(this.nodes, function(i, item){
            item.clearSelect();
            item.clearUnSelect();
        });
    },
    selectNodeToFront: function(){
        var selectNode = this.getSelectNode();
        if(selectNode){
            this.nodeToFront(selectNode);
        }
    },
    nodeToFront: function(node){
        // 5 layer
        // * un-related nodes, edges, text
        // * connected nodes - pointer
        // * connected edges
        // * connected nodes - text
        // * this node  (sublayer: pointer , text)
        var connectEdges = this.getConnectEdges(node);
        $.each(connectEdges, function(i, edge){
            var oppositeNode = edge.getOppositeNode(node);
            oppositeNode.pointToFront();
        });
        $.each(connectEdges, function(i, edge){
            edge.toFront();
        });
        $.each(connectEdges, function(i, edge){
            var oppositeNode = edge.getOppositeNode(node);
            oppositeNode.textToFront();
            oppositeNode.contrastTextToFront();
        });
        node.pointToFront();
        node.textToFront();
        node.contrastTextToFront();
    },
    mergeNodes: function(targetNode, node){
        this.getLock('changed');

        var isOriginRaw = targetNode.raw;

        this.mergeNodesMute(targetNode, node);
        if(targetNode.raw){
            if(!node.raw){
                targetNode.rename(node.name);
            }else{
                targetNode.rename(this.newRipeNodeName());
            }
        }
        this.resizeNode(targetNode);
        targetNode.clearRaw();
        targetNode.updateHalfraw();
        if(!targetNode.getSelect()&&!node.getSelect()){
            targetNode.clearIntersect();
        }else{
            if(targetNode.getSelect()){
                this.nodeClick(targetNode, true);
            }else{
                targetNode.triggerClick(this.r);
            }
        }

        //update search hightlight state after merge
        this.hightlightMatchNodesAndEdges();

        var changed = [];
        if(isOriginRaw){
            changed.push('raw');
        }
        this.trigger('map.node.changed', targetNode, changed);

        this.releaseLock('changed');
    },
    mergeNodesMute: function(targetNode, node){
        targetNode.merge(node);

        var self = this;
        var toRemoveEdges = [];
        var connectEdges = this.getConnectEdges(node);
        var targetConnectEdges = this.getConnectEdges(targetNode);
        $.each(connectEdges, function(i, edge){
            var targetEdge = null;
            var oppositeNode = edge.getOppositeNode(node);
            $.each(targetConnectEdges, function(i, item){
                if(item.isConnectNode(oppositeNode)){
                    targetEdge = item;
                    return false;
                }
                return null;
            });
            if(targetEdge){
                targetEdge.merge(edge);
                toRemoveEdges.push(edge);
            }else{
                edge.replaceNode(node, targetNode);
            }
        });

        this.removeEdges(toRemoveEdges);

        node.remove();
        var removeNodeIndex = this.getNodeIndex(node);
        if(removeNodeIndex != -1){
            this.nodes.splice(removeNodeIndex, 1);
        }
    },
    removeEdges: function(edges){
        var self = this;
        var removeEdgesIndex = [];
        $.each(edges, function(i, edge){
            if(!edge.isVisible()) self.hideBox.removeEdge(edge);
            edge.remove();
            removeEdgesIndex.push(self.getEdgeIndex(edge));
        });
        removeEdgesIndex.sort(function(a, b){return b-a;});
        $.each(removeEdgesIndex, function(i, removeEdgeIndex){
            self.edges.splice(removeEdgeIndex, 1);
        });
    },
    resizeNode: function(node){
        var newSize = this.calcNodeSize(node);
        node.updateSize(newSize);

        var connectEdges = this.getConnectEdges(node);
        var self = this;

        this.edgeWeightRanges = this.getEdgeWeightRanges();
        $.each(connectEdges, function(i, edge){
            var nEdgeSize = self.calcEdgeSize(edge);
            edge.updateSize(nEdgeSize);
        });

        this.updateConnectEdgesPath(node);

    },
    updateConnectEdgesPath: function(node){
        var self = this;
        var connectEdges = this.getConnectEdges(node);
        $.each(connectEdges, function(i, edge){
            edge.updatePath();
        });
    },
    isNodesConnect: function(nodeA, nodeB){
        var isConnect = false;
        $.each(this.edges, function(i, edge){
            if(edge.nodeA.id == nodeA.id && edge.nodeB.id == nodeB.id){
                isConnect = true;
                return false;
            }else if(edge.nodeB.id == nodeA.id && edge.nodeA.id == nodeB.id){
                isConnect = true;
                return false;
            }
            return null;
        });
        return isConnect;
    },
    getIntersectNode: function(node){
        var intersectNode = null;
        var nodePos = node.getPos();
        var nodeRadius = node.getOuterRadius();
        var nodeId = node.id;
        var toleratex = [nodePos.x - node.getMaxOuterRadius(this.maxNodeSize) - nodeRadius - 10, nodePos.x + node.getMaxOuterRadius(this.maxNodeSize) + nodeRadius + 10];
        var toleratey = [nodePos.y - node.getMaxOuterRadius(this.maxNodeSize) - nodeRadius - 10, nodePos.y + node.getMaxOuterRadius(this.maxNodeSize) + nodeRadius + 10];
        $.each(this.nodes, function(i, item){
            if(!item.isVisible()){
                return null;
            }
            var itemPos = item.getPos();
            if(itemPos.x < toleratex[0] || itemPos.x > toleratex[1] || itemPos.y < toleratey[0] || itemPos.y > toleratey[1]){
                return null;
            }
            var distance = SpdMap.utils.calcDistance(nodePos, itemPos);
            var radiusTotal = nodeRadius + item.getOuterRadius();
            if(item.id != nodeId && distance <= radiusTotal){
                intersectNode = item;
                return false;
            }
            return null;
        });
        return intersectNode;
    },
    getIntersectBox: function(node){
        var intersectBox = null;
        if(SpdMap.utils.isIntersectant(node, this.hideBox)){
            intersectBox = this.hideBox;
        }
        return intersectBox;
    },
    getNodeIndex: function(node){
        var nodeIndex = -1;
        $.each(this.nodes, function(i, item){
            if(item.id == node.id){
                nodeIndex = i;
                return false;
            }
            return null;
        });
        return nodeIndex;
    },

    getEdgeIndex: function(edge){
        var edgeIndex = -1;
        $.each(this.edges, function(i, item){
            if(item.equal(edge)){
                edgeIndex = i;
                return false;
            }
            return null;
        });
        return edgeIndex;
    },

    getUnvisibleIpPorts: function(node) {
        var result = [];
        if(node != undefined){
            var connectEdges = this.getConnectEdges(node);
            $.each(connectEdges||[], function(i, edge) {
                if(!edge.nodeA.visible){
                    result = result.concat(edge.nodeA.ip_ports);
                }
                if(!edge.nodeB.visible){
                    result = result.concat(edge.nodeB.ip_ports);
                }
            });
        }
        else{
            $.each(this.nodes, function(i, node){
                if(!node.visible){
                    result = result.concat(node.ip_ports);
                }
            });
        }
        return result;
    },


    hasUnvisibleNodes: function(node) {
        var connectEdges = this.getConnectEdges(node);
        var hasFound = false;
        $.each(connectEdges||[], function(i, edge) {
            if(!edge.nodeA.visible || !edge.nodeB.visible) {
                hasFound = true;
                return false;
            }
            return null;
        });
        return hasFound;
    },

    updateOppsiteClients: function(node, addClients, removedClients){
        var connectEdges = this.getConnectEdges(node);
        for(var i=0, edgeCount=connectEdges.length; i < edgeCount; i++){
            var edge = connectEdges[i];
            var oppsiteNode = edge.getOppositeNode(node);
            if(oppsiteNode.isVisible()){
                oppsiteNode.removeClients(removedClients);
                oppsiteNode.addClients(addClients);
                edge.updateDirection();
            }
        }
        this.changed('server.set');
    },

    findOppsiteNodes: function(node, excludeUnVisible){
        excludeUnVisible = excludeUnVisible || false;
        var nodes = [];
        var connectEdges = this.getConnectEdges(node);
        for(var i=0, edgeCount=connectEdges.length; i < edgeCount; i++){
            var edge = connectEdges[i];
            var oppsiteNode = edge.getOppositeNode(node);
            if(!excludeUnVisible || oppsiteNode.isVisible()){
                nodes.push(oppsiteNode);
            }
        }
        return nodes;
    },

    redrawFlowTable: function() {
        var self = this;
        var node = this.getSelectNode();
        var data = {};
        self.flowTable.markFlowCS(node);
    },

    windowPosToMapPos:function(wpos){
        var pos = {
            'x':wpos.x - this.container.offset().left,
            'y':wpos.y - this.container.offset().top
        };
        return this.r.translatePosFromViewBox(pos);
    },

    /* zoom ctrl related */

    bindViewBoxChange : function(){
        var _this = this;
        this.zoomCtrl.bind('viewbox.changed', function(pos){
            if (_this.nameditor) {
                _this.nameditor.moveBox();
            }
        });
    },

    /* zoom ctrl realted */

    /* search related */
    setSearchResult : function(result){
        result = result || {};
        this.query = result['query'];
        this.searchFlows = result['flows'];
        this.searchResultIpports = result['ipports'];
        this.clearClick();
        this.hightlightMatchNodesAndEdges();
        //this.setNavDefault();
        this.trigger('map.select.state', 'none');
    },

    clearSearchResult : function(){
        this.query = null;
        this.searchFlows = null;
        this.searchResultIpports = {};
        this.clearClick();
        this.clearHighlightNodesAndEdges();
        this.clearFlowListSearchResult();
        this.nameditor.hideEditBox();
        this.trigger('map.select.state', 'none');
    },

    hightlightMatchNodesAndEdgesByEdges: function(edges){

        var query = this.query;
        var records = this.searchFlows||[];
        var match_mode = _.reduce(query || [], function(num, item){
            item = item || {};
            var i = (item['ip'] === null || item['ip'] === undefined)  &&
             (item['port'] === null || item['port'] === undefined) &&
             (item.device === null || item.device === undefined) ? 0 : 1;
            return i + num;
        }, 0);

        var a = records.map(function (r) {
            return r.ip_a;
        });
        var b = records.map(function (r) {
            return r.ip_b;
        })

        function isEdgeMatchRecord(edge) {
            return records.some(function (record) {
                var recordIpA = record['ip_a'];
                var recordIpB = record['ip_b'];
                var recordPortA = record['port_a'];
                var recordPortB = record['port_b'];

                var nodeAIps = _.pluck(edge.nodeA['ip_ports'], 0);
                var nodeBIps = _.pluck(edge.nodeB['ip_ports'], 0);
                var nodeAPorts = _.flatten(_.pluck(edge.nodeA['ip_ports'], 1));
                var nodeBPorts = _.flatten(_.pluck(edge.nodeB['ip_ports'], 1));

                return ((_.contains(nodeAIps, recordIpA) && _.contains(nodeAPorts, recordPortA)) &&
                            (_.contains(nodeBIps, recordIpB) && _.contains(nodeBPorts, recordPortB))) ||
                        ((_.contains(nodeAIps, recordIpB) && _.contains(nodeAPorts, recordPortB)) &&
                            (_.contains(nodeBIps, recordIpA) && _.contains(nodeBPorts, recordPortA)));
            });
        }

        /*if(match_mode == 0 && (!query[2] || !query[2].prot)){
            return;
        }*/

        this.clearHighlightNodesAndEdgesByEdges(edges);

        $.each(edges, function(i, edge){

            if (isEdgeMatchRecord(edge)) {
                // 条件一组
                if (match_mode === 1 && query) {

                    var utils = SpdMap.utils;

                    var nodeAIps = _.pluck(edge.nodeA['ip_ports'], 0);
                    var nodeBIps = _.pluck(edge.nodeB['ip_ports'], 0);

                    if ((query[0].ip !== null || query[0].port !== null || query[0].device !== null)) {

                        if (edge.nodeA.isMatchQuery(query[0]) ) {
                            if (nodeAIps.some(function (ip) {
                                return a.indexOf(ip) > -1;
                            })) {
                                edge.nodeA.setHighlight();
                            }
                        }
                        if (edge.nodeB.isMatchQuery(query[0])) {
                            if (nodeBIps.some(function (ip) {
                                return a.indexOf(ip) > -1;
                            })) {
                                edge.nodeB.setHighlight();
                            }
                        }

                    } else if ((query[1].ip !== null || query[1].port !== null || query[1].device !== null)) {

                        if (edge.nodeA.isMatchQuery(query[1])) {
                            if (nodeAIps.some(function (ip) {
                                return b.indexOf(ip) > -1;
                            })) {
                                edge.nodeA.setHighlight();
                            }
                        }
                        if (edge.nodeB.isMatchQuery(query[1])) {
                            if (nodeBIps.some(function (ip) {
                                return b.indexOf(ip) > -1;
                            })) {
                                edge.nodeB.setHighlight();
                            }
                        }
                    }

                // 条件两组
                } else if (match_mode === 2 || match_mode === 0) {
                    edge.nodeA.setHighlight();
                    edge.nodeB.setHighlight();
                    edge.setHighlight();
                }
            }
        });

        this.hightlightHideBox();
    },
    hightlightMatchNodesAndEdgesByNode: function(node){
        var edges = this.getConnectEdges(node);
        this.hightlightMatchNodesAndEdgesByEdges(edges);
    },
    hightlightMatchNodesAndEdges: function(){
        this.hightlightMatchNodesAndEdgesByEdges(this.edges);
    },
    hightlightHideBox: function(){
        this.hideBox.updateSearchHighlight();
    },
    clearHightlightHideBox: function(){
        this.hideBox.clearSearchHighlight();
    },
    clearHighlightNodesAndEdges: function(){
        this.clearHighlightNodesAndEdgesByEdges(this.edges);
    },
    clearHighlightNodesAndEdgesByEdges: function(edges){
        $.each(edges || [] ,function(i, item){
            item.nodeA.clearHighlight();
            item.nodeB.clearHighlight();
            item.clearHighlight();
        });
        this.clearHightlightHideBox();
    },
    getNodeSearchQueryByNodeId: function(node_id){
        var query = this.query;
        var match_mode = _.reduce(query || [], function(num, item){
            item = item || {};
            var i = (item['ip'] === null || item['ip'] === undefined)  && (item['port'] === null || item['port'] === undefined) ? 0 : 1;
            return i + num;
        }, 0);
    },
    highlightFlowList: function(match_query) {

        if(this.nameditor && this.nameditor.node) {
            this.nameditor.hideBox();
            if(this.nameditor.node.isVisible()){
                this.nameditor.node.showText();
            }
        }

        this.loadFlowList(match_query);
    },

    clearFlowListSearchResult: function(){
        this.flowTable.clearSearchResult();
    },
    unhighlightFlowList: function() {
        this.flowTable.clearHightlight();
    },

    removeNode : function(node){
        if(this.nameditor.node && this.nameditor.node.equal(node)){
            this.nameditor.node = null;
        }
        var shouldClearClick = false;
        _.each(this.nodes, function(n){
            if(n.equal(node)){
                shouldClearClick = n.getSelect();
                node.remove();
                return false;
            }
            return null;
        });
        var removeNodeIndex = this.getNodeIndex(node);
        if(removeNodeIndex != -1){
            this.nodes.splice(removeNodeIndex, 1);
        }

        var connectEdges = this.getConnectEdges(node);
        this.removeEdges(connectEdges);
        this.redraw();
        var state = this.getSelectState();
        this.trigger('map.select.state', state[0], state[1]);
        this.changed('node.remove');
    },
    redraw:function(calc_layout){
        this.nameditor.hideBox();
        if (this.nameditor.node) {
            this.nameditor.node.hideText();
        }
        if(calc_layout){
            this.calcLayout(this.w - this.maxNodeSize, this.h - this.maxNodeSize, true);
        }

        //this.hideBox.reset();
        this.draw();
        var _this = this;

        var selected = 0;
        var toShowEdges = [];
        $.each(this.nodes,function(i,node){
            if(node.isVisible()){
                node.show();
                node.updateStyle();
                if(node.selected){
                    toShowEdges = toShowEdges.concat(_this.getConnectEdges(node));
                    _this.nodeToFront(node);
                    _this.nameditor.showAt(node);
                    _this.showNodeTextExcept(node);
                    _this.flowTable.setSelectedNode(node);
                    //_this.nodeClick(node);
                    selected = 1;
                }
            }
        });
        $.each(this.edges,function(i,edge){
            if(edge.isVisible()){
                edge.show();
                edge.updateStyle();
                if(edge.getSelect() && !selected){
                    //_this.edgeClick(edge);
                    toShowEdges.push(edge);
                    selected = 1;
                }
            }
        });
        if(!selected){
            this._mapClick();
        }

        this.hightlightHideBox();
        this.setNodesEdgesSelectState(toShowEdges);
        this.loadFlowList(this.query, this.match);
    },
    reload:function(map_data, calc_layout, calc_size){
        map_data = map_data || {};
        calc_layout = calc_layout || false;
        calc_size = calc_size || false;
        if (this.nameditor.node) {
            this.nameditor.node.hideText();
            this.nameditor.node = null;
        }
        this.clearNodes();
        this.clearEdges();
        this.nodes = this._generateNodes(map_data.nodes || []);
        this.edges = this._generateEdges(map_data.links || []);
        if(calc_size){
            this.reCalcSize();
        }
        this.redraw(calc_layout);
    },
    loadHistoryData:function(data){
        this.setMapData(data.map);
        this.reload({
            'nodes': $.extend(true, [], data.nodes),
            'links': $.extend(true, [], data.edges)
        });
    },
    getHistoryData:function(){
        var node_data_list = [];
        $.each(this.nodes, function(node_index, node){
            var node_data = {
                'id': node.id,
                'name': node.name,
                'pos': node.pos,
                'ip_ports': $.extend(true, [] , node.ip_ports),
                'raw': node.raw,
                'visible': node.visible,
                'confirmSegments': $.extend([],node.confirmSegments),
                'size': node.size,
                'weight': node.weight,
                'selected': node.selected,
                'servers': $.extend(true, [], node.servers||[]),
                'clients': $.extend(true, [], node.clients||[]),
                'isHighlight': node.isHighlight
            };
            node_data_list.push(node_data);
        });
        //get edge data
        var edge_data_list = [];
        $.each(this.edges, function(edge_index, edge){
            var edge_data = {
                'nodeA': edge.nodeA.id,
                'nodeB': edge.nodeB.id,
                'direction': $.extend([false, false],edge.direction),
                'size': edge.size,
                'weight': edge.weight,
                'isSelected': edge.isSelected,
                'isHighlight': edge.isHighlight
            };
            edge_data_list.push(edge_data);
        });
        //get map data
        var map_data = {
            'nodes': node_data_list,
            'edges': edge_data_list,
            'map':{
                'query': $.extend(true,[],this.query),
                'match': $.extend(true,{},this.match),
                'searchResultIpports': this.searchResultIpports,
                'nextRNodeNameIndex': this.nextRNodeNameIndex
            }
        };

        return map_data;
    },
    setMapData: function(data){
        data = data || {};
        var default_data = {
            'query': [],
            'match': {},
            'searchResultIpports': {},
            'nextRNodeNameIndex': null
        };
        $.extend(this, default_data, data);
    },
    getZoomData: function(current){
        return this.zoomCtrl.getZoomData(current);
    },

    /* end search related */

    calcLayout: function(w, h, forceReCalc){
        var allowMoveFixedNode = false;
        if (forceReCalc != undefined && forceReCalc == true){
            allowMoveFixedNode = true;
        }

        var nodeCount = this.nodes.length;
        var d3Nodes = [];
        var d3Edges = [];
        var nodeMap = {};
        this.nodes.forEach(function(node, i){
            var n = {'id' : node['id']};
            if(node.pos && node.pos.x && node.pos.y){
                n.x = node.pos.x;
                n.y = node.pos.y;
                if(!node.raw && ! allowMoveFixedNode){
                    n.fixed = true;
                }
                else{
                    n.fixed = false;
                }
            }
            else{
                // give an init position;
                n.x = i * w / nodeCount + 5 * (i % 2);
                n.y = i * h / nodeCount + 5 * ((i+1) % 2);;
                n.fixed = false;
            }
            d3Nodes.push(n);
            nodeMap[n.id] = n;
        });

        this.edges.forEach(function(edge, i){
            d3Edges.push({'source' : nodeMap[edge['nodeA']['id']],
                           'target' : nodeMap[edge['nodeB']['id']]});
        });

        //@see http://stackoverflow.com/questions/9901565/charge-based-on-size-d3-force-layout
        var k = Math.sqrt(d3Nodes.length * 1.0 / (w * h));

        /*
        var linkDistance = 120;
        var charge = -10 /k;
        var gravity = 100 * k;
        var layoutHeight = h;
        var layoutWidth = w;
        */

        var linkDistance = this.maxNodeSize + 40;
        var charge = -10 /k;
        var gravity = 100 * k;
        var layoutHeight = h;
        var layoutWidth = w;

        //console.log('layout params', 'nodeCount', nodeCount, 'size', layoutWidth, layoutHeight,
        //            'charge', charge, 'linkDistance', linkDistance, 'gravity', gravity);

        var max_loop = nodeCount * nodeCount;
        var force = d3.layout.force()
            .charge(charge)
            .gravity(gravity)
            .linkDistance(linkDistance)
            .nodes(d3Nodes)
            .links(d3Edges)
            .size([layoutWidth, layoutHeight]);

        force.start();
        for (var i = 0; i < max_loop; ++i){
            force.tick();
        }
        force.stop();


        var offsetX = 0;
        var offsetY = 0;
        var factor = 1.0;

        //if we are using a different layout container, adjust the pos
        /*
        if (layoutWidth != w || layoutHeight != h){
            var box = [layoutWidth, layoutHeight, 0, 0];
            d3Nodes.forEach(function(node, i){
                box[0] = Math.min(node.x, box[0]);
                box[1] = Math.min(node.y, box[1]);
                box[2] = Math.max(node.x, box[2]);
                box[3] = Math.max(node.y, box[3]);
            });
            var boxWidth = box[2] - box[0];
            var boxHeight = box[3] - box[1];
            factor = Math.max(factor, boxWidth / w);
            factor = Math.max(factor, boxHeight / h);
            boxWidth = boxWidth / factor;
            boxHeight = boxHeight / factor;
            offsetX = - box[0]/factor + (w - boxWidth)/2
            offsetY = - box[1]/factor + (h - boxHeight)/2
        }
        */

        //console.log('factor', factor, 'offset', offsetX, offsetY);

        var nodePosMap = {};
        force.nodes().forEach(function(node, i){
            var pos = {
                'x' : node.x / factor + offsetX,
                'y' : node.y / factor + offsetY
            };
            nodePosMap[node.id] = pos;
        });

        this.nodes.forEach(function(node){
            node.setPos(nodePosMap[node.id]);
        });
    },
    getSaveData: function(action){
        action = action || 'save';
        //get node data
        var node_data_list = [];
        var png_node_data_list = [];
        var node_id_list = [];
        var max_node_id = 0;
        $.each(this.nodes, function(node_index, node){
            if(!node['raw']){
                var node_data = {
                    'id': node['id'],
                    'name': node['name'],
                    'pos': node['pos'],
                    'ip_ports': node['ip_ports'],
                    'raw': node['raw'],
                    'visible': node['visible'],
                    'confirmSegments': node['confirmSegments'],
                    'servers': node['servers'],
                    'clients': node['clients']
                };
                if(action == 'preview'){
                    node_data['weight'] = node['weight'];
                    node_data['size'] = node['size'];
                }
                node_data_list.push(node_data);
                node_id_list.push(node['id']);
                if(node['id']>max_node_id){
                    max_node_id = node['id'];
                }
                // for genPng
                node_data['weight'] = node['weight'];
                node_data['size'] = node['size'];
                png_node_data_list.push(node_data);
            }
        });

        //get edge data
        var edge_data_list = [];
        var png_edge_data_list = [];
        $.each(this.edges, function(edge_index, edge){
            var node_a_id = edge['nodeA']['id'];
            var node_b_id = edge['nodeB']['id'];
            if((node_id_list.indexOf(node_a_id) != -1) && (node_id_list.indexOf(node_b_id) != -1)){
                var edge_data = {
                    'nodeA': node_a_id,
                    'nodeB': node_b_id,
                    'direction': edge['direction'] || [false, false]
                };
                if(action == 'preview'){
                    edge_data['weight'] = edge['weight'];
                    edge_data['size'] = edge['size'];
                }
                edge_data_list.push(edge_data);
                // for genPng
                edge_data['weight'] = edge['weight'];
                edge_data['size'] = edge['size'];
                png_edge_data_list.push(edge_data);
            }
        });

        //get hidebox data
        var hidebox_data = {
            'other_raw_ips': this.hideBox.getRawIps()
        };

        //get map data
        var map_data = {
            'id': this['id'] || '',
            'name': this['name'],
            'nodes': node_data_list,
            'edges': edge_data_list,
            'max_node_id': max_node_id,
            'hidebox': hidebox_data
        };

        //get map png
        if(action == 'save'){
            var map_png = this.getMapPng({'nodes':png_node_data_list, 'edges':png_edge_data_list});
            if(map_png != ''){
                map_data['map_png'] = map_png;
            }
        }
        return map_data;
    },
    getCombingData: function(data){
        var utils = SpdMap.utils;
        var max_node_id = 0;
        var nodes = _.map(_.groupBy(data || [], function(row){
            return row['component'];
        }), function(rows, node_name){
            return {
                'id':max_node_id ++,
                'name':node_name,
                'ip_ports':_.map(rows, function(row){
                    return utils.genIpPortList({'ip':row['ipaddr']});
                }),
                'visible':true,
                'raw':false
            };
        });
        return {
            'nodes': nodes,
            'edges': []
        };
    },
    combing: function(data, originalData){
        /*
        data = [
            {'component':'test','ipaddr':'2.1.1.1'},
            {'component':'test','ipaddr':'1.1.1.1'},
            {'component':'test2','ipaddr':'3.2.2.1'}
        ];
        */
        // var map_data = this.getCombingData(data || []);
        var map_data = window.getCombingData;
        var map_name = CBMSFLOW.environment('map_name');
        var datasource_name = CBMSFLOW.environment('datasource_name');
        var url = CBMSFLOW.util.format_spd_i18n_url('/%s/map/load/', [map_name]);
        var _callback = this.__addDecorator(function(result){
            if(result['message']){
                CBMSFLOW.getLogger('spd.message').info(result['message']);
            }
            this.setMapData({});
            this.dataSource.reset(new SpdMap.LocalDataSource(result['flows']));
            this.reload(result['map_data'], true, true);
            this.loadFlowList();
            this.trigger('map.select.state', 'combined');
            this.trigger('combing');
            this.changed('combing');


            var tbody = $('#combing-table .combing-table-content .body tbody');

            var tableTemplate = "<% _.each(iplist, function(item, i) { %> "
            +"<tr>"
            +"    <td class='seq'><%=i+1%></td>"
            +"    <td class='component'><%=item.component%></td>"
            +"    <td class='ipaddr'><%=item.ipaddr%></td>"
            +"    <td class='equipment'><%=item.equipment%></td>"
            +"    <td class='port'><%=item.port%></td>"
            +"    <td class='componentB'><%=item.componentB%></td>"
            +"    <td class='ipaddrB'><%=item.ipaddrB%></td>"
            +"    <td class='equipmentB'><%=item.equipmentB%></td>"
            +"    <td class='portB'><%=item.portB%></td>"
            +"    <td class='atob'><%=item.A2B%></td>"
            +"    <td class='btoa'><%=item.B2A%></td>"
            +"    <td class='allb'><%=item.allbyte%></td>"
            +"    <td class='usability'><%=item.usability%></td>"
            +"    <td class='pattern'><%=item.pattern%></td>"
            +"    <td class='zonebit'><%=item.zonebit%></td>"
            +"    <td class='proto'><%=item.protocol%></td>"
            +"</tr>"
            +"<% }); %>";

            tbody.empty();
            tbody.html(_.template(tableTemplate, {'iplist': originalData}));

            // window.localStorage.setItem('combinedRelation', JSON.stringify(originalData));
            CBMSFLOW.environment('combinedRelation', originalData);

            $('.grey-scrollbar.combing-scroll').mCustomScrollbar({
                theme: "minimal"
            });

        });
        var request_data = {'map_data': JSON.stringify(map_data)};
        if(datasource_name) request_data['datasource'] = datasource_name;
        $.ajax({
            'type': 'POST',
            'url': url,
            'async': false,
            'data': request_data,
            'success': $.proxy(_callback, this),
            'error': function(req, stat, e){
                CBMSFLOW.debug("[error]map combing remote call error.", {
                    'url':url,
                    'map_name':map_name,
                    'map_data':map_data,
                    'XMLHttpRequest':req,
                    'textStatus':stat,
                    'errorThrown':e
                }, 'error');
            }
        });
    },
    reset: function() {
        this.trigger('combing');
        var mapData = {'nodes':[], 'links': []};
        var map_name = CBMSFLOW.environment('map_name');
        var datasource_name = CBMSFLOW.environment('datasource_name');
        var url = CBMSFLOW.util.format_spd_i18n_url('/%s/map/load/', [map_name]);
        var _callback = this.__addDecorator(function(result){
            if(result['message']){
                CBMSFLOW.getLogger('spd.message').info(result['message']);
            }
            this.setMapData({});
            this.reload(result['map_data'], true, true);
            this.dataSource.reset(new SpdMap.LocalDataSource(result['flows']));
            this.zoomCtrl.zoomFitOrg();
            this.loadFlowList();
            this.trigger('map.select.state', 'none');
            this.changed('reset');
        });
        var request_data = {'map_data': JSON.stringify(mapData)};
        if(datasource_name) request_data['datasource'] = datasource_name;
        $.ajax({
            'type': 'POST',
            'url': url,
            'async': false,
            'data': request_data,
            'success': $.proxy(_callback, this),
            'error': function(req, stat, e){
                CBMSFLOW.debug("[error]map reset remote call error.",{
                    'url':url,
                    'map_name':map_name,
                    'map_data':mapData,
                    'XMLHttpRequest':req,
                    'textStatus':stat,
                    'errorThrown':e
                }, 'error');
            }
        });
    },
    clear: function($super){
        $super();
        this._unbindEvents();
        this.zoomCtrl.clear();
        this.zoomCtrl = null;
        this.dataSource = null;
    }
});
function resize_table(){
    var flowTable = $('#flow-table');
    if (flowTable.position() === null) return;
    var adjWidth = flowTable.position().left;
    flowTable.width($(window).width() - adjWidth);
    $('#node-table').width($(window).width() - adjWidth);
    $('#node-definition').width($(window).width() - adjWidth);
        resizeTimeOut = setTimeout(function () {
            var body = document.getElementsByTagName("body")[0];
            var scroll = body.scrollHeight - body.clientHeight;
            var d = 0;
            flowTable.width($(window).width() - adjWidth - d);
            $('#node-table').width($(window).width() - adjWidth - d);
            $('#node-definition').width($(window).width() - adjWidth - d);

            var adj_left = ($(window).width() - 90) / 2;
            $('#flow-table-block .resizable-span').css('left', adj_left);
            $('.flow-table-value-container').trigger('resize');
        }, 50);
}
