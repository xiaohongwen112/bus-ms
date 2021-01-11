var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.BaseNode = CBMSFLOW.klass({
    /*
     * node
     * {
     *   servers: [{group: groupname01, ipports: {ips: [], ports: []}}]
     *   clients: [{server: {ip:'1.1.1.1', port: 4350}, ipports: [{ip: '2.2.2.2', port:8979}]}]
     * }
     */

    rawColor: '#1c89c9',
    ripeColor: '#3f9b2f',
    wrapWidth: 2,
    bgWidth: 6,
    __setup__:function(){
        this.addGroup('spdmap.node');
    },
    __init__: function(nodeInfo){
        this.selected = false;
        this.confirmSegments = [];
        $.extend(true, this, nodeInfo);

        if (this.servers.length == 0) {
            this.servers = [{'group': gettext('服务接口') + '-01', 'ipports': {'ips':[], 'ports': []}}];
        }
    },
    draw: function(r){
        this.drawPoint(r);
        this.drawText(r);
        if(!this.isVisible()){
            this.hide();
            this.hideText();
        }
        if(this.selected){
            this.hideText();
        }
        if ( CBMSFLOW.environment('compareMode') && this.dif && this.dif !== '0') {
            this.drawContrastText(r);
        }
    },
    drawContrastText: function (r) {
        this.clearContrastText();

        var pos = this.getPos();
        this.contrastText = r.text(pos.x, pos.y, this.dif).attr({'font-family': 'Microsoft YaHei', 'font-size': '12px','stoke': 'none', 'fill': '#fff'});
        this.contrastText[0].setAttribute( 'class', 'contrast-text');
    },
    clearContrastText: function () {
        if (this.contrastText) {
            try {
                this.contrastText.remove();
            } catch (err) {
            }
            this.contrastText = null
        }
    },
    drawText: function(r){
        this.clearText();

        var pos = this.getTextPos();
        this.text = r.text(pos.x, pos.y, this.name).attr({'font-family': 'Microsoft YaHei', 'font-size': '12px','stoke': 'none', 'fill': '#777'});
        this.text[0].setAttribute('pointer-events', 'none');
        this.text[0].setAttribute('id', this.id);
    },
    drawPoint: function(r){
        this.clearPoint();

        var pos = this.getPos();
        this.pointBg = r.circle(pos.x, pos.y, this.getOuterRadius()).attr({'stroke': 'none', 'fill': '#000', 'fill-opacity': 0.5});
        if (this.dif && this.dif !== '0') {
            this.pointWrap = r.circle(pos.x, pos.y, this.getRadius()).attr({'stroke': '#fff', 'stroke-width': "1px", 'fill': '#e60000'});
            this.pointCenter = r.circle(pos.x, pos.y, this.getInnerRadius()).attr({'stroke': 'none', 'fill': '#e60000'});
        } else {
            this.pointWrap = r.circle(pos.x, pos.y, this.getRadius()).attr({'stroke': '#fff', 'fill': '#1c89c9','stroke-width': "1px"});
            this.pointCenter = r.circle(pos.x, pos.y, this.getInnerRadius()).attr({'stroke': 'none', 'fill': this.getColor()});
        }
        this.pointCenter[0].setAttribute('id', this.id);

        this.point = r.set();
        this.point.push(this.pointBg);
        this.point.push(this.pointWrap);
        this.point.push(this.pointCenter);

        if(!this.selected){
            this.pointBg.hide();
        }

        this.pointCenter.hover(function(e) {
            this.attr('cursor', 'pointer');
        },
        function(e) {});
    },
    rename: function(newName){
        this.name = newName;
        this.text.attr({'text': newName});
        this.trigger('renamed', newName);
    },
    retext: function(text) {
        this.text.attr({'text': text});
    },
    pointToBack: function(){
        this.point.forEach(function(e){
            e.toBack();
        });
    },
    pointToFront: function(){
        this.point.forEach(function(e){
            e.toFront();
        });
    },
    textToBack: function(){
        this.text.toBack();
    },
    textToFront: function(){
        this.text.toFront();
    },
    contrastTextToFront: function() {
        if (this.contrastText) {
            this.contrastText.toFront();
        }
    },
    drag: function(r, onmove, onstart, onend){
        var startPos;
        var self = this;

        var flag = 0;
        var _onmove = function(dx, dy, x, y, event){
            if(!self.isVisible()){
                return;
            }
            flag = 1

            var scale = r.getViewBoxScale();
            dx = dx / scale.x;
            dy = dy / scale.y;
            self.moveBy(startPos.x, startPos.y, dx, dy);
            onmove(self, dx, dy, x, y, event);
        };
        var _onstart = function(x, y, event){
            if(!self.isVisible()){
                return;
            }
            flag = 0;

            startPos = self.getPos();
            self.pointCenter.attr({'cursor': 'pointer'});
            self.setIntersect();
            onstart(self, x, y, event);
        };
        var _onend = function(event){
            if(!self.isVisible()){
                return;
            }
            if(flag == 1){
                self.pointCenter.attr({'cursor': 'default'});
                self.clearIntersect();
                onend(self, startPos.x, startPos.y, event);
            }
        };
        this.pointCenter.drag(_onmove, _onstart, _onend);
    },
    undrag: function(){
        try{
            this.pointCenter.undrag();
        }catch(err){
        }
    },
    moveBy: function(startX, startY, dx, dy){
        var newPos = {'x': startX+dx, 'y': startY+dy};
        this.moveTo(newPos.x, newPos.y);
    },
    moveTo: function(x, y){
        this.point.attr({'cx': x, 'cy': y});
        this.setPos({'x':x,'y':y});
        this.updateContrastText(x, y);
        this.updateTextPos();
    },
    updateTextPos: function(){
        var textPos = this.getTextPos();
        this.text.attr({'x': textPos.x, 'y': textPos.y});
    },
    updateContrastText: function (x, y) {
        if (this.contrastText) {
            this.contrastText.attr({'x': x, 'y': y});
        }
    },
    moveToAnimate: function(r, toX, toY, ms, callback){
        var pos = this.getPos();
        var deltaX = toX - pos.x;
        var deltaY = toY - pos.y;

        var self = this;
        r.customAttributes.along = function(v){
            var curX = pos.x + deltaX*v;
            var curY = pos.y + deltaY*v;
            var textPos = self.calcTextPos({'x': curX, 'y': curY}, self.getOuterRadius());
            self.text.attr({'x': textPos.x, 'y': textPos.y});

            if(callback){
                callback(self, curX, curY);
            }
            return {'cx': curX, 'cy': curY};
        };
        self.point.attr({along: 0});
        self.point.animate({along: 1}, ms, 'backOut', function(){
            self.setPos({'x': toX, 'y': toY});
            self.updateTextPos();
        });
    },
    click: function(r, callback){
        var self = this;
        this.triggerClick = function(r){
            if(!self.isVisible()){
                return;
            }
            if(callback){
                callback(self);
            }
            self.setSelect();
            self.trigger('click');
        };
        var flag = 0;
        var isMouseDown = false;
        var pCoords = {
            x: 0,
            y: 0
        };
        this.pointCenter.mousedown(function(e){
            isMouseDown = true;
            pCoords.x = e.pageX;
            pCoords.y = e.pageY;
            flag = 0;
        });
        this.pointCenter.mousemove(function(e){
            if (!isMouseDown) {
                return;
            }
            var delta = {
                x: e.pageX - pCoords.x,
                y: e.pageY - pCoords.y
            };
            // console.log('mouseMove', delta.x, delta.y);
            if (delta.x * delta.x + delta.y * delta.y > 9) {                
                flag = 1;
            }
        });
        this.pointCenter.mouseup(function(){
            isMouseDown = false;
            if(flag == 0){
                self.triggerClick(r);
            }
        });
    },
    textclick: function(r, callback) {
        var self = this;
        this.text.click(function() {
            if (self.selected) {
                callback(self);
            }
        });
    },
    triggerClick: function(r) {
    },
    merge: function(other){
        this.weight += other.weight;

        self = this;
        $.each(other.ip_ports, function(i, item){
            self.ip_ports.push(item);
        });

        $.each(other.clients || [], function(i, otherClient){
            var otherClientServer = otherClient.server;
            var isFind = false;
            $.each(self.clients, function(j, thisClient){
                if(_.isEqual(thisClient.server, otherClientServer)){
                    thisClient.ipports = thisClient.ipports.concat(otherClient.ipports);
                    isFind = true;
                    return false;
                }
            });
            if(!isFind){
                self.clients.push(otherClient);
            }
        });

        $.each(other.servers||[], function(i, otherServer){
            var otherGroupName = otherServer.group;
            var isFind = false;
            $.each(self.servers, function(j, thisServer){
                if(thisServer.group == otherGroupName){
                    thisServer.ipports.ips = _.union(thisServer.ipports.ips, otherServer.ipports.ips);
                    thisServer.ipports.ports = _.union(thisServer.ipports.ports, otherServer.ipports.ports);
                    isFind = true;
                    return false;
                }
            });
            if(!isFind){
                self.servers.push(otherServer);
            }
        });
    },
    split: function(ip){
        this.ip_ports = _.reject(this.ip_ports, function(item){
            return item[0] == ip;
        });
        this.weight = _.reduce(this.ip_ports, function(memo, item){ return memo + item[2]}, 0);

        $.each(this.clients, function(i, thisClient){
            thisClient.ipports = _.reject(thisClient.ipports, function(item){
                return item.ip == ip;
            });
        });
        this.clients = _.filter(this.clients, function(thisClient){
            return thisClient.ipports.length > 0;
        });

        $.each(this.servers, function(i, thisServer){
            thisServer.ipports.ips = _.difference(thisServer.ipports.ips, [ip]);
        });
        this.servers = _.filter(this.servers, function(thisServer){
            return thisServer.ipports.ips.length > 0;
        });
    },
    getSplitInfo: function(ip){
        results = {'clients': [], 'servers': []};
        _.each(this.clients, function(thisClient){
            ipports = _.filter(thisClient.ipports, function(item){
                return item.ip == ip;
            });
            if(ipports.length > 0){
                results.clients.push({'server': thisClient.server, 'ipports': ipports});
            }
        });
        return results;
    },
    remove: function(){
        this.clearPoint();
        this.clearText();
    },
    clearText: function(){
        if(this.text){
            try{
                this.text.remove();
            }catch(err){
            }
            this.text = null;
        }
    },
    clearPoint: function(){
        if(this.point){
            try{
                this.pointCenter.undrag();
            }catch(err){
            }
            try{
                this.pointBg.remove();
                this.pointWrap.remove();
                this.pointCenter.remove();
                this.point.clear();
            }catch(err){
            }
            this.pointBg = null;
            this.pointWrap = null;
            this.pointCenter = null;
            this.point = null;
        }
    },
    equal: function(other){
        return this.id == other.id;
    },
    updateSize: function(newSize){
        if(this.setSize(newSize)){
            this.pointBg.attr({'r': this.getOuterRadius()});
            this.pointWrap.attr({'r': this.getRadius()});
            this.pointCenter.attr({'r': this.getInnerRadius()});
            this.updateTextPos();
        }
    },
    setSize: function(newSize) {
        if(this.size == undefined || this.size != newSize){
            this.size = newSize;
            return true;
        }
        return false;
    },
    setSelect: function(){
        if(!this.selected){
            this.selected = true;
            this.pointBg.show();
        }
    },
    clearSelect: function(){
        if(this.selected){
            this.selected = false;
            this.pointBg.hide();
        }
    },
    getSelect: function(){
        return this.selected == true;
    },
    getPos: function(){
        return this.pos;
    },
    setPos: function(newPos){
        this.pos = newPos;
    },
    getTextPos: function(){
        var nodePos = this.getPos();
        var outerRadius = this.getOuterRadius();
        return this.calcTextPos(nodePos, outerRadius);
    },
    calcTextPos: function(nodePos, outerRadius){
        var textX = nodePos.x;
        var textY = nodePos.y - (outerRadius+8);
        return {'x': textX, 'y': textY};
    },
    getRadius: function(){
        return this.getInnerRadius() + this.wrapWidth;
    },
    getInnerRadius: function(){
        return Math.round(this.size / 2);
    },
    getOuterRadius: function(){
        return this.getRadius() + this.bgWidth;
    },
    getMaxOuterRadius: function(nodeSize){
        return Math.round(nodeSize / 2) + this.wrapWidth + this.bgWidth;
    },
    updatePointStyle: function(){
        this.pointCenter.attr({'fill': this.getColor()});
    },
    getColor: function(){
        if(this.raw){
            return this.rawColor;
        }else{
            if (this.type === 'server') {
                return '#3dd9c4';
            }
            return this.ripeColor;
        }
    },
    setRaw: function(){
        if(!this.raw){
            this.raw = true;
            this.updatePointStyle();
        }
    },
    clearRaw: function(){
        if(this.raw){
            this.raw = false;
            this.updatePointStyle();
        }
    },
    setIntersect: function(){
        if(!this.selected){
            this.pointBg.show();
        }
    },
    clearIntersect: function(){
        if(!this.selected){
            this.pointBg.hide();
        }
    },
    getCenter:function(){
        var pos = this.getPos();
        return {
            'x' : pos.x,
            'y' : pos.y
        };
    },

    getCenterInViewBox : function(){
        var pos = this.getPos();
        return this.point.paper.translatePosToViewBox(pos);
    },

    getOuterRadiusInViewBox : function(){
        var scale = this.point.paper.getViewBoxScale();
        var radius = this.getOuterRadius();
        return radius * Math.max(scale.x, scale.y);
    },

    hide:function(){
        this.point.hide();
        this.text.hide();
        if(this.visible){
            this.visible = false;
        }
    },

    show:function(){
        if(!this.visible){
            this.point.show();
            if(!this.selected){
                this.pointBg.hide();
            }
            this.text.show();
            this.visible = true;
        }
    },
    isVisible:function(){
        return this.visible;
    },
    judgeNeedMergeSameNetSeg: function(node){
        var nodeIp = node.ip_ports[0][0];
        var nodeNetSeg = SpdMap.utils.extractIpNetSegment(nodeIp);

        if(!node.raw || this.raw || this.isNetSegConfirmed(nodeNetSeg)){
            return {'needMerge': false};
        }

        var sameNetSegIps = [];
        $.each(this.ip_ports, function(i, item){
            var itemIp = item[0];
            var itemNetSeg = SpdMap.utils.extractIpNetSegment(itemIp);
            if(itemNetSeg == nodeNetSeg && itemIp != nodeIp){
                if(sameNetSegIps.indexOf(itemIp) == -1){
                    sameNetSegIps.push(itemIp);
                }
            }
        });
        if(sameNetSegIps.length >= 10){
            return {'needMerge': true, 'sameNetSegIps': sameNetSegIps};
        }else{
            return {'needMerge': false};
        }
    },
    confirmMergeSameNetSeg: function(node){
        var nodeIp = node.ip_ports[0][0];
        var nodeNetSeg = SpdMap.utils.extractIpNetSegment(nodeIp);
        if(!this.isNetSegConfirmed(nodeNetSeg)){
            this.confirmSegments.push(nodeNetSeg);
        }
    },
    isNetSegConfirmed: function(netSeg){
        return this.confirmSegments.indexOf(netSeg) != -1;
    },
    hideText: function() {
        if(this.text != null){
            this.text.hide();
        }
    },
    showText: function() {
        if(this.text != null){
            this.text.show();
        }
    },
    getNodeText: function() {
        return this.name;
    },
    setNodeText: function(txt) {
        this.text.attr('text', txt);
    },
    isPointIn: function(r, x, y){
        return r.isPointInsideBBox(this.pointBg.getBBox(), x, y);
    },
    getBBox: function(){
        return this.pointBg.getBBox();
    },
    hasIpport: function(ipport){
        if(this.getIpPort(ipport)){
            return true;
        }
        return false;
    },
    getIpPort: function(ipport){
        var result = null;
        $.each(this.ip_ports, function(i, item){
            if(item[0] == ipport[0]){
                result = item;
                return false;
            }
            return null;
        });
        return result;
    },
    isIntersectIps: function(ips){
        var self = this;
        var isIntersect = false;
        $.each(ips, function(i, ip){
            if(self.hasIpport([ip])){
                isIntersect = true;
                return false;
            }
            return null;
        });
        return isIntersect;
    },
    removeClients: function(clients){
        var self = this;
        var sortBy = function(ipport1, ipport2){
            var _k1 = ipport1.ip + ':' + ipport1.port;
            var _k2 = ipport2.ip + ':' + ipport2.port;
            if(_k1 > _k2){
                return 1;
            }
            else if(_k1 < _k2){
                return -1;
            }
            else{
                return 0;
            }
        };
        var _ipports_cache = {};
        var _clients_map = {};
        for(var j = 0;j<this.clients.length;j++){
            var c = self.clients[j];
            var k = c.server.ip + ':' + c.server.port;
            _clients_map[k] = j;
        }
        for(var i= 0;i<clients.length;i++){
            var removeClient = clients[i];
            var _cache_k = removeClient.server.ip + ':' + removeClient.server.port;
            var clientIpports = _ipports_cache[_cache_k];
            if(clientIpports === undefined){
                if(_.has(_clients_map, _cache_k)){
                    var index = _clients_map[_cache_k];
                    var thisClient = this.clients[index];
                    clientIpports = new CBMSFLOW.Math.SUArray(thisClient.ipports, sortBy);
                    clientIpports.data('index', index);
                    thisClient.ipports = clientIpports.value();
                    _ipports_cache[_cache_k] = clientIpports;
                }
            }
            if(clientIpports !== undefined){
                clientIpports.remove(removeClient.ipport);
                if(clientIpports.empty()){
                    this.clients[clientIpports.data('index')] = undefined;
                }
            }
        }
        this.clients = _.filter(this.clients, function(client){
            return client !== undefined;
        });
    },
    addClients: function(clients){
        var self = this;

        clients = _.filter(clients, function(addClient){
            return self.hasIpport([addClient.ipport.ip]);
        });

        var sortBy = function(ipport1, ipport2){
            var _k1 = ipport1.ip + ':' + ipport1.port;
            var _k2 = ipport2.ip + ':' + ipport2.port;
            if(_k1 > _k2){
                return 1;
            }
            else if(_k1 < _k2){
                return -1;
            }
            else{
                return 0;
            }
        };

        var _ipports_cache = {};
        var _clients_map = {};
        for(var j = 0;j<this.clients.length;j++){
            var c = self.clients[j];
            var k = c.server.ip + ':' + c.server.port;
            _clients_map[k] = j;
        }
        for(var i=0;i<clients.length;i++){
            var addClient = clients[i];
            var _cache_k = addClient.server.ip + ':' + addClient.server.port;
            var clientIpports = _ipports_cache[_cache_k];
            if(clientIpports === undefined){
                if(_.has(_clients_map, _cache_k)){
                    var index = _clients_map[_cache_k];
                    var thisClient = this.clients[index];
                    clientIpports = new CBMSFLOW.Math.SUArray(thisClient.ipports, sortBy);
                    thisClient.ipports = clientIpports.value();
                    _ipports_cache[_cache_k] = clientIpports;
                }
            }
            if(clientIpports !== undefined){
                clientIpports.insert(addClient.ipport);
            }else{
                clientIpports = new CBMSFLOW.Math.SUArray([addClient.ipport], sortBy);
                this.clients.push({server: addClient.server, ipports: clientIpports.value()});
                _ipports_cache[_cache_k] = clientIpports;
            }
        };
    },
    removeClientsByServerIp: function(ip){
        this.clients = _.reject(this.clients, function(thisClient){
            return thisClient.server.ip == ip;
        });
    },
    isInServers: function(ip, port) {
        var isServer = false;
        $.each(this.servers, function(i, server){
            var ipports = server.ipports;
            if(_.contains(ipports.ips, ip) && _.contains(ipports.ports, port)){
                isServer = true;
                return false;
            }
        });
        return isServer;
    },
    clear:function(){
        if(this.isLocked("clear")){
            return;
        }
        this.getLock("clear");
        this.remove();
        for(var i in this){
            this[i] = null;
        }
    },
    changeDispState: function(dispState, ipDeviceMap){
        if(this.raw){
            var nodeIp = this.ip_ports[0][0];
            if(dispState == 'ip'){
                this.retext(nodeIp);
            }else{
                this.retext(ipDeviceMap[nodeIp]||nodeIp);
            }
        }
    }
});

SpdMap.Node = CBMSFLOW.klass(SpdMap.BaseNode,{
    halfrawColor: "#c60001",
    highlightColor: "#f4b300",
    unSelectColorBg: "#ddd",
    selectTextColor: "#333",
    unSelectTextColor: "#c4c4c4",
    logger : CBMSFLOW.getLogger("debug"),
    __init__: function($super, nodeInfo){
        this.isHighlight = false;
        this.isUnSelected = false;
        this.isPairSelected = false;
        $super(nodeInfo);
        this.halfraw = this._getHalfraw();
    },
    _getConnectNodes: function(){

    },
    _getHalfraw: function(){
        var utils = SpdMap.utils;
        var ipports_map = {};
        for(var i=0; i<this.ip_ports.length;i++){
            var ip_port = this.ip_ports[i];
            var ipport = utils.formatIpPortFields(ip_port);
            if(!ipport["ports"] || ipport["ports"].length == 0){
                return true;
            }
            else{
                ipports_map[ipport["ip"]] = ipport;
            }
        }

        var servers = this.servers || [];
        var _cache_ipport = {};
        for(var k=0;k<servers.length;k++){
            var server = servers[k];
            var ports = new CBMSFLOW.Math.SUArray(server.ipports.ports || []);
            var ips = server.ipports.ips || [];
            for(var j=0;j<ips.length;j++){
                var ip = ips[j];
                if(ipports_map[ip] == undefined){
                    this.logger.error("server ip not in ipports",{"ip":ip});
                    return true;
                }
                if(!_.has(_cache_ipport, ip)){
                    _cache_ipport[ip] = new CBMSFLOW.Math.SUArray(ipports_map[ip]["ports"]);
                }
                var has_one_port = false;
                for(var m =0;m<server.ipports.ports.length;m++){
                    var port = server.ipports.ports[m];
                    if(_cache_ipport[ip].has(port)){
                        has_one_port = true;
                        ports.remove(port);
                    }
                }
                if(!has_one_port){
                    return true;
                }
            }
            if(ports.length() > 0){
                return true;
            }
        }

        return false;
    },
    getIpportsMap: function(){
        var utils = SpdMap.utils;
        var ipports_map = {};
        _.each(this.ip_ports || [], function(ip_port){
            var ipport = utils.formatIpPortFields(ip_port);
            ipports_map[ipport["ip"]] = ipport;
        });
        return ipports_map;
    },
    isHalfraw: function(){
        return this.halfraw;
    },
    updateIpPortsPort: function(ipports){
        ipports = ipports || {};
        var utils = SpdMap.utils;
        var _this = this;
        _.each(this.ip_ports, function(ip_port, i){
            var ipport = utils.formatIpPortFields(ip_port);
            ipport['ports'] = ipports[ipport['ip']] || [];
            _this.ip_ports[i] = utils.genIpPortList(ipport);
        });
    },
    clearIpPortsPort: function(){
        this.updateIpPortsPort({});
    },
    updateHalfraw: function(){
        var halfraw = this._getHalfraw();
        if(halfraw != this.halfraw){
            this.halfraw = halfraw;
            this.updatePointStyle();
        }
    },
    getColor: function(){
        if(this.isHighlight){
            return this.highlightColor;
        }else if(this.isUnSelected){
            return this.unSelectColorBg;
        }
        else if(this.raw){
            return this.rawColor;
        }
        else if(this.isHalfraw()){
            return this.halfrawColor;
        }
        else{
            return this.ripeColor;
        }
    },

    setSelectStyle: function() {
        this.text.attr({'fill': this.selectTextColor});
        this.pointWrap.attr({'stroke': 'none', 'fill': '#fff'});
        this.pointBg.attr({'stroke': 'none', 'fill': '#000', 'fill-opacity': 0.5});
        this.updatePointStyle();
    },

    setUnSelectStyle: function() {
        this.text.attr({'fill': this.unSelectTextColor});
        // this.pointWrap.attr({'stroke': 'none', 'fill': '#fff'});
        // this.updatePointStyle();
        this.pointWrap.attr({'opacity': 0.5});
        if (this.dif && this.dif !== '0') {
            this.pointCenter.attr({'opacity': 0});
        } else {
            this.pointCenter.attr({'opacity': 0.8});
        }
    },

    setDefaultStyle: function() {
        if (!this.isHighlight) {
            this.text.attr({'stoke': 'none', 'fill': '#777'});
            this.pointWrap.attr({'stroke': 'none', 'fill': '#fff'});
            this.pointBg.attr({'stroke': 'none', 'fill': '#000', 'fill-opacity': 0.5});
        }
        this.updatePointStyle();
    },

    setHightlightStyle: function(){
        //this.updatePointStyle(); 
        if (this.dif && this.dif !== '0') {
            this.pointCenter.attr({fill: '#e62e2e'});
            this.pointWrap.attr({fill: '#e62e2e'});
            this.pointWrap.attr({stroke: "#ffb2b2",  'stroke-width': 2, 'stroke-dasharray': "5, 5"});

            this.pointWrap.node.setAttribute('stroke-width', 2);
            this.pointWrap.node.setAttribute('stroke-dasharray', '5, 5');

        } else {
            this.pointCenter.attr({fill: '#5ca1e6'});
            this.pointWrap.attr({fill: '#5ca1e6'});
            this.pointWrap.attr({stroke: "#ffffff",  'stroke-width': 2, 'stroke-dasharray': "5, 5"});

            this.pointWrap.node.setAttribute('stroke-width', 2);
            this.pointWrap.node.setAttribute('stroke-dasharray', '5, 5');
        }
    },

    updateStyle: function(){
        if(this.selected){
            this.setSelectStyle();
        }else if(this.isHighlight) {
            this.setHightlightStyle();
        }else if(this.isUnSelected){
            this.setUnSelectStyle();
        }else if(this.isPairSelected){
            this.setSelectStyle();
        }else{
            this.setDefaultStyle();
            if (this.dif && this.dif !== '0'){
                this.pointWrap.attr({'stroke': '#fff', 'fill': '#e60000'});
                this.pointCenter.attr({'stroke': 'none', 'fill': '#e60000'});
            }
        }
    },

    setSelect: function($super){
        if(!this.selected){
            $super();
            this.isUnSelected = false;
            this.isPairSelected = false;
            // this.updateStyle();
            this.pointWrap.attr({'opacity': 1});
            this.pointCenter.attr({'opacity': 1});
            window.clickIp = this.ip_ports;
        }
    },

    clearSelect: function($super){
        if(this.selected){
            $super();
            this.updateStyle();
        }
    },

    setHighlight: function(){
        if(!this.isHighlight){
            this.isHighlight = true;
            this.updateStyle();
        }
    },
    clearHighlight: function(){
        if(this.isHighlight){
            this.isHighlight = false;
            this.updateStyle();
        }
    },
    setUnSelect: function(){
        if(!this.isUnSelected && !this.selected){
            this.isUnSelected = true;
            this.isPairSelected = false;
            this.updateStyle();
        }
    },

    clearUnSelect: function(){
        if(this.isUnSelected){
            this.isUnSelected = false;
            this.updateStyle();
        }
    },
    setPairSelect: function(){
        if(!this.isPairSelected && !this.selected){
            this.isPairSelected = true;
            this.isUnSelected = false;
            // this.updateStyle();
            this.pointWrap.attr({'opacity': 1});
            this.pointCenter.attr({'opacity': 1});
        }
    },
    clearPairSelect: function(){
        if(this.isPairSelected){
            this.isPairSelected = false;
            this.updateStyle();
        }
    },
    matchIpPortPair: function(query){
        var utils = SpdMap.utils;
        var matched = false;
        if(!query){
            return false;
        }
        //search ip_ports
        $.each(this.ip_ports || [], function(i, ip_port){
            var ipport = utils.formatIpPortFields(ip_port);
            var match_port = null;
            if(ipport['ports'] && ipport['ports'].length > 0){
                matched = _.some(ipport['ports'], function(port){
                    return utils.ipportsWildcardContains([ipport['ip'], port], [query['ip'], query['port']]);
                });
            }
            else if(utils.ipportsWildcardContains([ipport['ip'], null], [query['ip'], query['port']]))
            {
                //matched = true;
            }
            if(matched){
                return false;
            }
            return null;
        });

        return matched;
    },
    matchIpPortPairOrDevice: function(query){
        var utils = SpdMap.utils;
        var matched = false;
        if(!query){
            return false;
        }
        var device = this.name;
        //search ip_ports
        $.each(this.ip_ports || [], function(i, ip_port){
            var ipport = utils.formatIpPortFields(ip_port);
            var match_port = null;
            if(ipport['ports'] && ipport['ports'].length > 0){
                matched = _.some(ipport['ports'], function(port){
                    return (query.ip === null || (!!query.ip && ipport.ip.indexOf(query.ip) > -1)) &&
                    (query.port === null || (!!query.port && port === query.port)) &&
                    (query.device === null || (!!query.device && device.indexOf(query.device) > -1 ))
                    // return utils.ipportsWildcardContains([ipport['ip'], port], [query['ip'], query['port']]);
                });
            }
            else if(utils.ipportsWildcardContains([ipport['ip'], null], [query['ip'], query['port']]))
            {
                //matched = true;
            }
            if(matched){
                return false;
            }
            return null;
        });

        return matched;
    }, 
    isMatchQuery: function (query) {
        if(!query){
            return false;
        }

        var ipPorts = this.ip_ports || [];

        var name1 = this.name;

        return ipPorts.some(function (ipPort) {
            var ipPortObj = SpdMap.utils.formatIpPortFields(ipPort);

            var name2 = CBMSFLOW.environment('ipDeviceMap')[ipPortObj.ip] || '';

            if (ipPortObj.ports) {

                return ipPortObj.ports.some(function (port) {
                    return (query.ip === null || (query.ip !== null &&  ipPortObj.ip.indexOf(query.ip) > -1)) &&
                        (query.port === null || (query.port !== null && port === query.port)) && 
                        (query.device === null || (query.device !== null &&
                                (name1.indexOf(query.device) > -1 || name2.indexOf(query.device) > -1)));
                });

            }
            return false;
        });
    },
    matchServers: function(query){
        var utils = SpdMap.utils;
        var matched = false;

        if(!query){
            return false;
        }

        //search servers
        $.each(this.servers || [], function(i, server){
            var ports = server.ipports.ports;
            var ips = server.ipports.ips;
            _.each(ips || [], function(ip){
                matched = _.some(ports || [], function(port){
                    return utils.ipportsWildcardContains([ip, port], [query['ip'], query['port']]);
                });
                if(matched){
                    return false;
                }
                return null;
            });
        });
        return matched;
    }
},{
    getServersIpPortMap: function(servers){
        servers = servers || [];
        var serversIpPortMap = {};
        for(var i=0;i<servers.length;i++){
            var server = servers[i];
            var ipports = server.ipports;
            for(var j=0;j<ipports.ips.length;j++){
                var ip = ipports.ips[j];
                if(!_.has(serversIpPortMap, ip)){
                    serversIpPortMap[ip] = new CBMSFLOW.Math.SUArray([]);
                }
                serversIpPortMap[ip].extend(ipports.ports);
            }
        }
        return serversIpPortMap;
    },
    isIpPortMatchServersMap: function(serverIpPortMap, ip, port){
        var ipportMap = serverIpPortMap[ip];
        if(ipportMap === undefined){
            return false;
        }
        return ipportMap.has(port);
    },
    getClientsIpPortMap: function(clients){
        clients = clients || [];
        var clientsIpPortMap = {};
        for(var i=0;i<clients.length;i++){
            var client = clients[i];
            for(var j=0;j<client.ipports.length;j++){
                var ipport = client.ipports[j];
                var ip = ipport.ip;
                if(!_.has(clientsIpPortMap, ip)){
                    clientsIpPortMap[ip] = new CBMSFLOW.Math.SUArray([]);
                }
                clientsIpPortMap[ip].insert(ipport.port);
            }
        }
        return clientsIpPortMap;
    },
    isIpPortMatchClientsMap: function(clientIpPortMap, ip, port){
        var ipportMap = clientIpPortMap[ip];
        if(ipportMap === undefined){
            return false;
        }
        return ipportMap.has(port);
    },
    updateOppsiteClients: function(flows, node, oldServers, newServers){
        var addClients = [];
        var removeClients = [];
        var map = CBMSFLOW.environment('topovmap');
        var oldConnectClients = {};
        var newConnectClients = {};
        var oldServersIpPortMap = SpdMap.Node.getServersIpPortMap(oldServers);
        var newServersIpPortMap = SpdMap.Node.getServersIpPortMap(newServers);

        for(var i=0, flowCount=flows.length; i < flowCount; i++){
            var flow = flows[i];
            if(SpdMap.Node.isIpPortMatchServersMap(oldServersIpPortMap, flow['ip_a'], flow['port_a'])){
                var k_a = flow['ip_a'] + ':' + flow['port_a'] + ':' + flow['ip_b'] + ':' + flow['port_b'];
                if(!_.has(oldConnectClients, k_a)){
                    oldConnectClients[k_a] = {'ipport': {'ip': flow['ip_b'], 'port': flow['port_b']}, 'server': {'ip': flow['ip_a'], 'port': flow['port_a']}};
                }
            }
            if(SpdMap.Node.isIpPortMatchServersMap(newServersIpPortMap, flow['ip_a'], flow['port_a'])){
                var k_b = flow['ip_a'] + ':' + flow['port_a'] + ':' + flow['ip_b'] + ':' + flow['port_b'];
                if(!_.has(newConnectClients, k_b)){
                    newConnectClients[k_b] = {'ipport': {'ip': flow['ip_b'], 'port': flow['port_b']}, 'server': {'ip': flow['ip_a'], 'port': flow['port_a']}};
                }
            }
        }

        _.each(newConnectClients, function(item, k){
            if(!_.has(oldConnectClients, k)){
                addClients.push(item);
            }
        });
        _.each(oldConnectClients, function(item, k){
            if(!_.has(newConnectClients, k)){
                removeClients.push(item);
            }
        });

        map.updateOppsiteClients(node, addClients, removeClients);
    },
    updateOppsiteClientsByNode: function(node, oldServers, newServers){
        var map = CBMSFLOW.environment('topovmap');
        var dataSource = CBMSFLOW.environment('flowlistProxy');
        var excludeIpPorts = [];
        var searchIpPorts = [node.ip_ports];
        dataSource.getFlowsByIpports({
            'type':'nodes',
            'ipports_list': JSON.stringify(searchIpPorts),
            'exclude': JSON.stringify(excludeIpPorts)
        }, function(result){
            SpdMap.Node.updateOppsiteClients(result.flows, node, oldServers, newServers);
        });
    },
    updateIpPortsPort: function(nodes){
        var map = CBMSFLOW.environment('topovmap');
        var dataSource = CBMSFLOW.environment('flowlistProxy');
        var excludeIpPorts = map.getUnvisibleIpPorts();
        var searchIpPorts = _.reduce(nodes, function(result, node){return result.concat(node.ip_ports);}, []);
        dataSource.getIpports({
            'ipports': JSON.stringify(searchIpPorts),
            'exclude': JSON.stringify(excludeIpPorts)
        }, function(ipports){
            _.each(nodes, function(node){
                node.updateIpPortsPort(ipports);
                node.updateHalfraw();
            });
        });
    },
    addIpPortsPort: function(update_nodes, add_node){
        var utils = SpdMap.utils;
        var map = CBMSFLOW.environment('topovmap');
        var dataSource = CBMSFLOW.environment('flowlistProxy');
        var excludeIpPorts = [];
        _.each(update_nodes, function(node){
            var searchIpPorts = [{'from':node.ip_ports, 'to':add_node.ip_ports}];
            dataSource.getFlowsByIpports({
                'type': 'links',
                'ipports_pairs': JSON.stringify(searchIpPorts),
                'exclude': excludeIpPorts
            }, function(result){
                var ipports = {};
                _.each(node.ip_ports, function(ip_port, i){
                    var ipport = utils.formatIpPortFields(ip_port);
                    ipports[ipport['ip']] = i;
                });

                var ipportsMap = {};
                _.each(result.flows, function(flow){
                    var ip = flow['ip_a'];
                    var port = flow['port_a'];
                    var ipportMap = ipportsMap[ip];
                    if(ipportMap === undefined){
                        var i = ipports[ip];
                        var ipport = utils.formatIpPortFields(node.ip_ports[i]);
                        ipportMap = ipportsMap[ip] = ipport['ports'];
                    }
                    ipportMap.push(port);
                });
                _.each(ipportsMap, function(ipportMap, ip){
                    var i = ipports[ip];
                    var ipport = utils.formatIpPortFields(node.ip_ports[i]);
                    ipportMap.sort();
                    ipport['ports'] = _.uniq(ipportMap, true);
                    node.ip_ports[i] = utils.genIpPortList(ipport);
                });
                node.updateHalfraw();
            });
        });
    },
    clearIpPortsPort: function(node){
        node.clearIpPortsPort();
        node.updateHalfraw();
    },
    clearClients: function(node){
        node.clients = [];
    },
    updateClients: function(flows, node, servers){
        var serversIpPortMap = SpdMap.Node.getServersIpPortMap(servers);
        var clients = {};
        for(var i=0, flowCount=flows.length; i < flowCount; i++){
            var flow = flows[i];
            if(SpdMap.Node.isIpPortMatchServersMap(serversIpPortMap, flow['ip_b'], flow['port_b'])){
                var k = flow['ip_b'] + ':' + flow['port_b'];
                if(!_.has(clients, k)){
                    clients[k] = {'ipports': [{'ip': flow['ip_a'], 'port': flow['port_a']}], 'server': {'ip': flow['ip_b'], 'port': flow['port_b']}};
                }
                else{
                    clients[k]['ipports'].push({
                        'ip':flow['ip_a'],
                        'port':flow['port_a']
                    });
                }
            }
        }
        node.clients = _.values(clients);
    },
    updateClientsByNode: function(node){
        var map = CBMSFLOW.environment('topovmap');
        var dataSource = CBMSFLOW.environment('flowlistProxy');
        var excludeIpPorts = map.getUnvisibleIpPorts();
        var searchIpPorts = [node.ip_ports];
        var servers = _.reduce(map.findOppsiteNodes(node, true), function(result, n){
            return result.concat(n.servers);
        }, []);
        dataSource.getFlowsByIpports({
            'type':'nodes',
            'ipports_list': JSON.stringify(searchIpPorts),
            'exclude': JSON.stringify(excludeIpPorts)
        }, function(result){
            SpdMap.Node.updateClients(result.flows, node, servers);
        });
    }
});

SpdMap.PreviewNode = CBMSFLOW.klass(SpdMap.BaseNode,{
    drawText: function($super, r){
        $super(r);
        var bbox = this.text.getBBox();
        var padding_right = 5;
        var padding_left = 5;
        this.textBg = r.rect(bbox.x - padding_right, bbox.y, bbox.width + padding_right + padding_left, bbox.height).attr({"fill":"#1C89C9","stroke":"none"}).hide();
    },
    clearText: function($super){
        $super();
        if(this.textBg){
            this.textBg.remove();
            this.textBg = null;
        }
    },
    calcTextPos: function($super, nodePos, outerRadius){
        var pos = $super(nodePos, outerRadius);
        pos['y'] -= 5;
        return pos;
    },
    setSelect: function($super){
        $super();
        this.text.attr({'fill': '#ffffff'});
        this.textBg.show();
        this.textBg.toFront();
        this.text.toFront();
    },
    clearSelect: function($super){
        $super();
        this.text.attr({'fill': '#777777'});
        this.textBg.hide();
        this.text.toBack();
    }
});
