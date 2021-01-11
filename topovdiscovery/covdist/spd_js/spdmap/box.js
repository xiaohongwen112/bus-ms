var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.Box = CBMSFLOW.klass(SpdMap.RevertObject, {
    strokeColor: '#1c89c9',
    strokeColorHighlight: '#f4b300',
    strokeColorSelected : '#fe4c40',
    fillColor: '#999999',
    strokeWidth:3,
    height:50,
    width:50,
    box_name:'box',
    __init__: function(x, y){
        this.x = x;
        this.y = y;
        this._start_nodes = null;
        this._cache_nodes = new SpdMap.NodeGroup();
        this._nodes = new SpdMap.NodeGroup();
    },
    draw:function(r){
        this.graph = r.rect(this.x, this.y, this.width, this.height);
        this.graph.attr({'stroke': this.strokeColor, 'fill':this.fillColor,'cursor': 'pointer','stroke-width':this.strokeWidth});
        this.graph[0].setAttribute('box_name',this.box_name);
    },
    click:function(onclick){
        var onclick_f = onclick || function(){};
        this.bind('click', onclick_f);

        var self = this;
        var flag = 0;
        this.graph.mousedown(function(){
            flag = 0;
        });
        this.graph.mousemove(function(){
            flag = 1;
        });
        this.graph.mouseup(function(){
            if(flag == 0){
                self._click();
            }
        });
    },
    _click:function(event){
        var trigger_result = this.trigger('click', event);
        if(trigger_result !== false){
            this.setSelect();
        }
    },
    drag:function(r, onmove, onstart, onend){

        var onmove_f = onmove || function(){};
        var onstart_f = onstart || function(){};
        var onend_f = onend || function(){};
        this.bind({
            'drag.move':onmove_f,
            'drag.start':onstart_f,
            'drag.end':onend_f
        });

        var self = this;
        var _onstart = function(x, y, event){
            this.x = self.x;
            this.y = self.y;
            self._dragStart(x, y, event);
        };
        var _onmove = function(dx, dy, ex, ey, event) {
            var x = this.x + dx;
            var y = this.y + dy;
            self._dragMove(dx, dy, x, y, ex, ey, event);
        };
        var _onend = function(event){
            self._dragEnd(event);
        };
        this.graph.drag(_onmove, _onstart, _onend);
    },
    _dragStart:function(x, y, event){
        this.trigger('drag.start', x, y, event);
    },
    _dragEnd:function(event){
        this.trigger('drag.end', event);
    },
    _dragMove:function(dx, dy, x, y, ex, ey, event){
        var trigger_result = this.trigger('drag.move', dx, dy, x, y, ex, ey, event);
        if(trigger_result !== false){
            this.moveTo(x, y);
        }
    },
    getCenter:function(){
        return {
            'x' : this.x + this.width / 2,
            'y' : this.y + this.height / 2
        };
    },
    _getMaxTouchRadius:function(){
        return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    },
    _getMinTouchRadius:function(){
        return Math.min(this.width, this.height) / 2;
    },
    moveTo:function(x, y){
        this.graph.attr({'x':x,'y':y});
        this.x = x;
        this.y = y;
    },
    toFront:function(){
        this.graph.toFront();
    },
    highlight:function(){
        this.graph.attr({'stroke':this.strokeColorHighlight});
    },
    clearHighlight:function(){
        if(this.isSelected()){
            this.setSelect();
        }
        else{
            this.restore();
        }
    },
    isSelected:function(){
        return this._selected || false;
    },
    getSelect:function(){
        return this.isSelected();
    },
    setSelect:function(){
        this._selected = true;
        this.graph.attr({'stroke':this.strokeColorSelected});
        if(this.prevChange() != 'select') this.changed('select');
    },
    clearSelect:function(){
        this._selected = false;
        this.restore();
        if(this.prevChange() != 'select.clear') this.changed('select.clear');
    },
    restore:function(){
        this.graph.attr({'stroke':this.strokeColor});
    },
    hasNode:function(node){
        return this._nodes.inGroup(node);
    },
    getNodes:function(){
        return this._nodes.toArray();
    },
    hasCacheNode:function(node){
        return this._cache_nodes.inGroup(node);
    },
    _get_touches:function(nodes){
        var in_box = [];
        var out_box = [];
        var before_box = [];
        var after_box = [];
        for(var i in nodes){
            var node = nodes[i];
            if(this.hasNode(node)){
                continue;
            }
            if(!this.hasCacheNode(node)){
                if(this.isNodeTouch(node)){
                    in_box.push(node);
                }
                else if(this.beforeNodeTouch(node)){
                    before_box.push(node);
                }
                else{
                    after_box.push(node);
                }
            }
            else{
                if(!this.isNodeTouch(node)){
                    out_box.push(node);
                }
            }
        }
        return {
            'in':in_box,
            'out':out_box,
            'before':before_box,
            'after':after_box
        };
    },
    startCatch:function(nodes){
        this._start_nodes = new SpdMap.NodeGroup(nodes);
        this.trigger('catch.start', nodes);
    },
    startPut:function(nodes){
        this._start_nodes = new SpdMap.NodeGroup(nodes);
        this.trigger('put.start', nodes);
    },
    onCatch:function(){
        var nodes = this._start_nodes.toArray();
        var trigger_result = this.trigger('catch.move', nodes);
        if(trigger_result === false){
            return false;
        }
        var touches = this._get_touches(nodes);
        if(touches['in']){
            this.trigger('catch.in', touches['in']);
        }
        if(touches['out']){
            this.trigger('catch.out', touches['out']);
        }
        if(touches['before']){
            this.trigger('catch.before', touches['before']);
        }
        if(touches['after']){
            this.trigger('catch.after', touches['after']);
        }
        return null;
    },
    onPut:function(){
        var nodes = this._start_nodes.toArray();
        var trigger_result = this.trigger('put.move', nodes);
        if(trigger_result === false){
            return false;
        }
        var touches = this._get_touches(nodes);
        if(touches['in']){
            this.trigger('put.in', touches['in']);
        }
        if(touches['out']){
            this.trigger('put.out', touches['out']);
        }
        if(touches['before']){
            this.trigger('put.before', touches['before']);
        }
        if(touches['after']){
            this.trigger('put.after', touches['after']);
        }
        return null;
    },
    stopCatch:function(){
        var nodes = [];
        var _this = this;
        this._cache_nodes.takeOutEach(function(i, node){
            _this.addNode(node);
            nodes.push(node);
        });
        this._start_nodes = null;
        this.trigger('catch.stop', nodes);
    },
    stopPut:function(){
        var nodes = [];
        var _this = this;
        this._cache_nodes.takeOutEach(function(i, node){
            _this.addNode(node);
            nodes.push(node);
        });
        this._start_nodes = null;
        this.trigger('put.stop', nodes);
    },
    addCacheNode:function(node){
        if(!this._nodes.inGroup(node) && !this._cache_nodes.inGroup(node)){
            this._cache_nodes.push(node);
        }
    },
    removeCacheNode:function(node){
        this._cache_nodes.remove(node);
    },
    getBbox:function(){
        return this.graph.getBBox();
    },
    isNodeTouch: function(node){
        var node_radius = node.getOuterRadiusInViewBox();
        var box_radius = this._getMaxTouchRadius();
        var box_radius_inner = this._getMinTouchRadius();
        var node_center = node.getCenterInViewBox();
        var box_center = this.getCenter();

        var distance = SpdMap.utils.calcDistance(node_center, box_center);
        if(distance > (node_radius + box_radius)){
            return false;
        }

        if(distance <= (node_radius + box_radius_inner)){
            return true;
        }
        return false;
    },
    beforeNodeTouch:function(node, offset){
        offset = offset || 5;
        var node_radius = node.getOuterRadiusInViewBox();
        var box_radius = this._getMaxTouchRadius();
        var box_radius_inner = this._getMinTouchRadius();
        var node_center = node.getCenterInViewBox();
        var box_center = this.getCenter();

        var distance = SpdMap.utils.calcDistance(node_center, box_center) - offset;
        if(distance > (node_radius + box_radius)){
            return false;
        }

        if(distance <= (node_radius + box_radius_inner)){
            return true;
        }
        return false;
    },
    getNodeByName:function(node_name){
        var node = null;
        this._nodes.each(function(i, _node){
            if(_node.name == node_name){
                node = _node;
                return false;
            }
            return null;
        });
        return node;
    },
    tableOutNode:function(node, x, y){
        this.removeNode(node);
        this.trigger('take.out', node, x, y);
    },
    reset:function(nodes){
        this._nodes.reset(nodes);
    },
    addNode:function(node){
        this._nodes.push(node);
    },
    removeNode:function(node){
        this._nodes.remove(node);
    }
});

SpdMap.MixBox = CBMSFLOW.klass(SpdMap.Box, {

    __init__:function($super, x, y){
        this._start_edges = null;
        this._cache_edges = new SpdMap.EdgeGroup();
        this._edges = new SpdMap.EdgeGroup();
        $super(x, y);
    },
    _get_touches:function(nodes, edges){
        var out_edges_group = new SpdMap.EdgeGroup(edges);
        var in_edges_group = new SpdMap.EdgeGroup();
        in_edges_group.extend(this._edges, this._cache_edges);
        var in_nodes_group = new SpdMap.NodeGroup();
        in_nodes_group.extend(this._nodes, this._cache_nodes);
        var in_box = {'nodes':[],'edges':[]};
        var out_box = {'nodes':[],'edges':[]};
        var before_box = {'nodes':[]};
        var after_box = {'nodes':[]};
        for(var i in nodes){
            var node = nodes[i];
            if(this.hasNode(node)){
                continue;
            }
            if(!this.hasCacheNode(node)){
                if(this.isNodeTouch(node)){
                    in_box['nodes'].push(node);
                    in_nodes_group.push(node);
                    var edge_indexs = [];
                    out_edges_group.each(function(i,edge){
                        if(edge.isConnectNode(node)){
                            edge_indexs.push(edge);
                        }
                    });
                    $.each(edge_indexs, function(i,n){
                        in_box['edges'].push(out_edges_group.takeOut(n));
                    });
                }
                else if(this.beforeNodeTouch(node)){
                    before_box['nodes'].push(node);
                }
                else{
                    after_box['nodes'].push(node);
                }
            }
            else{
                if(!this.isNodeTouch(node)){
                    out_box['nodes'].push(node);
                    in_nodes_group.remove(node);
                    var edge_indexs = [];
                    in_edges_group.each(function(i,edge){
                        if(edge.isConnectNode(node) && !in_nodes_group.isLinked(edge)){
                            edge_indexs.push(edge);
                        }
                    });
                    $.each(edge_indexs, function(i,n){
                        var out_edge = in_edges_group.takeOut(n);
                        out_box['edges'].push(out_edge);
                        out_edges_group.push(out_edge);
                    });
                }
            }
        }
        return {
            'in':in_box,
            'out':out_box,
            'before':before_box,
            'after':after_box
        };
    },
    startCatch:function(nodes, edges){
        this._start_nodes = new SpdMap.NodeGroup(nodes);
        this._start_edges = new SpdMap.EdgeGroup(edges);
        this.trigger('catch.start', nodes, edges);
    },
    startPut:function(nodes, edges){
        this._start_nodes = new SpdMap.NodeGroup(nodes);
        this._start_edges = new SpdMap.EdgeGroup(edges);
        this.trigger('put.start', nodes, edges);
    },
    onCatch:function(){
        var nodes = this._start_nodes.toArray();
        var edges = this._start_edges.toArray();
        var trigger_result = this.trigger('catch.move', nodes, edges);
        if(trigger_result === false){
            return false;
        }
        var touches = this._get_touches(nodes, edges);

        if(touches['before']['nodes']){
            this.trigger('catch.before', touches['before']['nodes']);
        }
        if(touches['after']['nodes']){
            this.trigger('catch.after', touches['after']['nodes']);
        }
        if(touches['in']['nodes']){
            this.trigger('catch.in', touches['in']['nodes'], touches['in']['edges']);
        }
        if(touches['out']['nodes']){
            this.trigger('catch.out', touches['out']['nodes'], touches['out']['edges']);
        }
        return null;
    },
    onPut:function(){
        var nodes = this._start_nodes.toArray();
        var edges = this._start_edges.toArray();
        var trigger_result = this.trigger('put.move', nodes, edges);
        if(trigger_result === false){
            return false;
        }
        var touches = this._get_touches(nodes, edges);
        if(touches['before']['nodes']){
            this.trigger('put.before', touches['before']['nodes']);
        }
        if(touches['after']['nodes']){
            this.trigger('put.after', touches['after']['nodes']);
        }
        if(touches['in']['nodes']){
            this.trigger('put.in', touches['in']['nodes'], touches['in']['edges']);
        }
        if(touches['out']['nodes']){
            this.trigger('put.out', touches['out']['nodes'], touches['out']['edges']);
        }
        return null;
    },
    stopCatch:function(){
        var nodes = [];
        var edges = [];
        var _this = this;
        this._cache_nodes.takeOutEach(function(i, node){
            _this.addNode(node);
            nodes.push(node);
        });
        this._cache_edges.takeOutEach(function(i, edge){
            _this.addEdge(edge);
            edges.push(edge);
        });
        this.trigger('catch.stop', nodes, edges);
    },
    stopPut:function(){
        var nodes = [];
        var edges = [];
        var _this = this;
        this._cache_nodes.takeOutEach(function(i, node){
            _this.addNode(node);
            nodes.push(node);
        });
        this._cache_edges.takeOutEach(function(i, edge){
            _this.addEdge(edge);
            edges.push(edge);
        });
        this.trigger('put.stop', nodes, edges);
    },
    addCacheEdge:function(edge){
        if(!this._edges.inGroup(edge) && !this._cache_edges.inGroup(edge)){
            this._cache_edges.push(edge);
        }
    },
    removeCacheEdge:function(edge){
        this._cache_edges.remove(edge);
    },
    getCacheConnectEdges:function(node){
        return this._cache_edges.getConnectEdges(node);
    },
    getConnectEdges:function(node){
        return this._edges.getConnectEdges(node);
    },
    tableOutNode:function(node, x, y){
        var edges = [];
        this.removeNode(node);
        var _edges = this.getConnectEdges(node);
        for(var i in _edges){
            var edge = _edges[i];
            if(! this._nodes.isLinked(edge)){
                this.removeEdge(edge);
                edges.push(edge);
            }
        }
        this.trigger('take.out', node, edges, x, y);
    },
    loadHistoryData:function(data){
        this._selected = data.selected;
        if(this.isSelected()){
            this.setSelect();
        }else{
            this.restore();
        }
    },
    getHistoryData:function(){
        return {
            'selected':this.isSelected()
        };
    },
    reset:function(nodes,edges){
        this._nodes.reset(nodes);
        this._edges.reset(edges);
    },
    addEdge:function(edge){
        this._edges.push(edge);
    },
    removeEdge:function(edge){
        this._edges.remove(edge);
    }
});

SpdMap.HideBox = CBMSFLOW.klass(SpdMap.MixBox, {
    defaultPos:{'x':10,'y':10},
    box_name:'hide_box',
    __init__:function($super, data){
        data = data || {};
        var pos = data['pos'] || this.defaultPos;
        $super(pos['x'], pos['y']);
        this._initEvent();
        this._other_raw_ips = data['other_raw_ips'] || [];
    },
    addNode: function($super, node){
        node.hide();
        $super(node);
    },
    addEdge: function($super, edge){
        edge.hide();
        $super(edge);
    },
    addNodes: function(nodes){
        var self = this;
        $.each(nodes || [], function(i, node){
            self.addNode(node);
        });
    },
    addEdges: function(edges){
        var self = this;
        $.each(edges || [], function(i, edge){
            self.addEdge(edge);
        });
    },
    getRawIps:function(){
        var raw_ips = $.extend([], this._other_raw_ips);
        this._nodes.each(function(i, node){
            if(node.raw){
                var ipports = node.getIpportsMap();
                var ip = _.keys(ipports)[0];
                raw_ips.push(ip);
            }
        });
        return raw_ips;
    },
    getIps:function(){
        var raw_ips = $.extend([], this._other_raw_ips);
        this._nodes.each(function(i, node){
            var ipports = node.getIpportsMap();
            var ip = _.keys(ipports)[0];
            raw_ips.push(ip);
        });
        return raw_ips;
    },
    reset: function(nodes, edges){
        this._nodes.empty();
        this._edges.empty();
        this.addNodes(nodes);
        this.addEdges(edges);
    },
    _initEvent:function(){
        this.bind({
            'catch.move':function(){
                if(this._cache_nodes.isEmpty()){
                    this.clearHighlight();
                }else{
                    this.highlight();
                }
            },
            'catch.in':function(nodes, edges){
                if(nodes.length > 0){
                    this.highlight();
                }
                for(var i in nodes){
                    var node = nodes[i];
                    node.hide();
                    this.addCacheNode(node);
                }
                for(var i in edges){
                    var edge = edges[i];
                    edge.hide();
                    this.addCacheEdge(edge);
                }
            },
            'catch.out':function(nodes, edges){
                for(var i in nodes){
                    var node = nodes[i];
                    node.show();
                    this.removeCacheNode(node);
                }
                for(var i in edges){
                    var edge = edges[i];
                    edge.show();
                    this.removeCacheEdge(edge);
                }
            },
            'catch.before':function(nodes){
                for(var i in nodes){
                    var node = nodes[i];
                    node.setIntersect();
                }
            },
            'catch.after':function(nodes){
                for(var i in nodes){
                    var node = nodes[i];
                    node.clearIntersect();
                }
            },
            'catch.stop':function(){
                this.clearHighlight();
            },
            'put.move':function(){
                if(this._cache_nodes.isEmpty()){
                    this.clearHighlight();
                }else{
                    this.highlight();
                }
            },
            'put.in':function(nodes, edges){
                for(var i in nodes){
                    var node = nodes[i];
                    this.addCacheNode(node);
                }
                for(var i in edges){
                    this.addCacheEdge(edges[i]);
                }
            },
            'put.out':function(nodes, edges){
                for(var i in nodes){
                    var node = nodes[i];
                    this.removeCacheNode(node);
                }
                for(var i in edges){
                    this.removeCacheEdge(edges[i]);
                }
            },
            'put.stop':function(nodes, edges){
                this.clearHighlight();
                this.updateSearchHighlight();
            },
            'take.out':function(node){
                this.updateSearchHighlight();
            }
        });
    },
    updateSearchHighlight: function(){
        var _this = this;
        this.isHighlight = _.some(this._nodes.toArray(), function(node){
            return node.isHighlight;
        });
        this.updateStyle();
    },
    clearSearchHighlight: function(){
        this.isHighlight = false;
        this.updateStyle();
    },
    updateStyle: function(){
        if(this.isHighlight){
            ;;
        }else{
            ;;
        }
    }
});


SpdMap.FixedHideBox = CBMSFLOW.klass(SpdMap.HideBox, {
    color:"#cccccc",
    highlightColor:"yellow",
    selectColor:"red",
    radius:20,
    _initEvent:function($super){
        $super();
        this.bind({
            'put.start':function(){
                this.toBack();
            },
            'put.stop':function(){
                this.toFront();
            }
        });
    },
    toFront:function(){
        //this.graph.appendTo(this.graph.parent());
        this.graph.css('z-index',100);
    },
    toBack:function(){
        //this.graph.prependTo(this.graph.parent());
        this.graph.css('z-index',0);
    },
    _clickEvent:function(e){
         if(this.trigger('click', e) !== false) this.setSelect();
    },
    draw:function(){
        var _this = this;
        this.graph = $("#map-hide-box");
        this.graph.click($.proxy(this._clickEvent, this));
    },
    highlight:function(){
        this.graph.addClass('selected');
    },
    setSelect:function(){
        this._selected = true;
        this.graph.addClass('selected');
        if(this.prevChange() != 'select') this.changed('select');
    },
    restore:function(){
        this.graph.removeClass('selected');
    },
    click:function(onclick){
        this.bind('click',onclick);
    },
    mapPosToWindowPos:function(x,y){
        var pos = {
            'x':x + $(".map-block").offset().left,
            'y':y + $(".map-block").offset().top
        };
        return pos;
    },
    getCenter:function(){
        return {
            x:this.graph.offset().left + this.radius,
            y:this.graph.offset().top + this.radius
        };
    },
    isNodeTouch: function(node){
        var node_radius = node.getOuterRadiusInViewBox();
        var node_center = node.getCenterInViewBox();
        return this.isNodeLikeTouch(node_center, node_radius);
    },
    isNodeLikeTouch: function(node_center, node_radius){
        node_center = this.mapPosToWindowPos(node_center.x,node_center.y);
        var box_center = this.getCenter();
        var box_radius_inner = this.radius;
        var distance = SpdMap.utils.calcDistance(node_center, box_center);

        if(distance <= (node_radius + box_radius_inner)){
            return true;
        }
        return false;
    },
    beforeNodeTouch:function(node, offset){
        offset = offset || 5;
        var node_radius = node.getOuterRadiusInViewBox();
        var node_center = node.getCenterInViewBox();
        node_center = this.mapPosToWindowPos(node_center.x,node_center.y);
        var box_center = this.getCenter();
        var box_radius_inner = this.radius;
        var distance = SpdMap.utils.calcDistance(node_center, box_center) - offset;

        if(distance <= (node_radius + box_radius_inner)){
            return true;
        }
        return false;
    },
    updateStyle: function(){
        if(this.isHighlight){
            this.graph.addClass('highlight');
        }else{
            this.graph.removeClass('highlight');
        }
    }
});

