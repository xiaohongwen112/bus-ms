var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.BaseEdge = CBMSFLOW.klass({
    __setup__:function(){
        this.addGroup('spdmap.edge');
    },
    __init__: function(edgeInfo){
        this.defaultColor = '#000000';
        this.defaultOpacity = 0.2;
        this.unSelectOpacity = 0.1;
        this.selectedColor = '#fe4c40';
        this.selectedOpacity = 0.7;
        this.isSelected = false;
        this.highlightColor = '#f4b300';
        this.highlightOpacity = '0.8';
        this.isHighlight = false;
        this.minWeight = 2;
        this.size = 2;
        $.extend(true, this, edgeInfo);

        this.d3svg = d3.select('#' + this.containerId + ' svg');
        this.zindex = d3.scale.ordinal();
        this.arrows = [];
    },

    setSelectedStyle: function() {
        this.arrows.forEach(function(arrow) {
            arrow.style('fill', '#fc8078');
            arrow.style('opacity', 1);
            arrow.style('stroke', 'none');
            arrow.style('cursor', 'pointer');
        });
        this.el.style('stroke', '#fe4c40');
        this.el.style('opacity', 0.7);
        this.el.style('cursor', 'pointer');
    },

    setHighlightStyle: function() {
        this.arrows.forEach(function(arrow) {
            arrow.style('opacity', 1);
            arrow.style('fill', '#f5c032');
            arrow.style('stroke', 'none');
            arrow.style('cursor', 'pointer');
        });
        this.el.style('stroke', '#f4b300');
        this.el.style('opacity', 0.8);
        this.el.style('cursor', 'pointer');
    },

    setUnSelectStyle: function() {
        this.arrows.forEach(function(arrow) {
            arrow.style('fill', '#dedede');
            arrow.style('opacity', 1);
            arrow.style('stroke', 'none');
            arrow.style('cursor', 'pointer');

        });
        this.el.style('stroke', '#64c8eb');
        this.el.style('opacity', 0.1);
        this.el.style('cursor', 'pointer');
    },

    setDefaultStyle: function() {
        this.arrows.forEach(function(arrow) {
            arrow.style('fill', '#c6c6c6');
            arrow.style('opacity', 1);
            arrow.style('stroke', 'none');
            arrow.style('cursor', 'pointer');
        });
        this.el.style('stroke', '#64c8eb');
        this.el.style('opacity', 0.2);
        this.el.style('cursor', 'pointer');
    },

    isVisible: function() {
        return this.nodeA.visible && this.nodeB.visible;
    },

    getAngle: function(x1, y1, x2, y2) {
        var angle = Math.atan2(x2-x1, y2-y1);
        angle = (angle / (2 * Math.PI)) * 360;
        return angle;
    },

    getPathString: function() {
        var x1 = this.nodeA.getPos().x;
        var y1 = this.nodeA.getPos().y;
        var r1 = this.nodeA.getRadius();

        var x2 = this.nodeB.getPos().x;
        var y2 = this.nodeB.getPos().y;
        var r2 = this.nodeB.getRadius();

        var pa = [];
        var pb = [];
        pa.push('M');
        pb.push('L');
        var angle = Math.abs(this.getAngle(x1, y1, x2, y2));
        var deltaY  = r1 * Math.sin(angle * Math.PI / 180);
        var deltaX  = r1 * Math.cos(angle * Math.PI / 180);
        var deltaY2 = r2 * Math.sin(angle * Math.PI / 180);
        var deltaX2 = r2 * Math.cos(angle * Math.PI / 180);

        if (x1 <= x2 && y1 >= y2) {
            x1 += deltaY;
            y1 += deltaX;
            x2 -= deltaY2;
            y2 -= deltaX2;
        } else if (x1 <= x2 && y1 <= y2) {
            x1 += deltaY;
            y1 += deltaX;
            x2 -= deltaY2;
            y2 -= deltaX2;
        } else if (x1 >= x2 && y1 <= y2) {
            x1 -= deltaY;
            y1 += deltaX;
            x2 += deltaY2;
            y2 -= deltaX2;
        } else if (x1 >= x2 && y1 >= y2) {
            x1 -= deltaY;
            y1 += deltaX;
            x2 += deltaY2;
            y2 -= deltaX2;
        }

        pa.push(x1);
        pa.push(y1);
        pb.push(x2);
        pb.push(y2);
        return {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2};
    },

    getArrowPathString: function() {
        var arrowEdgeLen = this.size * 4;
        var m = this.getEdgeMidPos();
        var direction = this.direction||[];
        var arrowPathString = [];

        if (direction.length > 0 && (direction[0] || direction[1])) {
            var angle =  this.getEndPointAngle();
            var isTwoWay = direction[0] && direction[1];
            if (isTwoWay) {
                var offsetc = 1.5;
                var offsetc = 1.5;
                if (this.size > 2) {
                    deltay += 1;
                    offsetc = 2.5;
                }
                var deltay = this.size + this.size/2+ 1;
                var deltax = Math.sqrt(Math.pow(arrowEdgeLen, 2) - Math.pow(deltay, 2));
                var offset = this.size/2;

                var arrowPosXDelta = Math.abs(5 * Math.sin(angle * Math.PI / 180));
                var arrowPosYDelta = Math.abs(5 * Math.cos(angle * Math.PI / 180));

                var edgeLen = this.getEdgeLen();
                var mx = m.x+20;
                if (edgeLen < 50) {
                    mx = mx - 4;
                }
                var p1 = {'x': (mx - offset), 'y': m.y};
                var p2 = {'x': (mx - offset - deltax), 'y': (m.y - deltay)};
                var p3 = {'x': (mx - offset - deltax + offsetc), 'y': m.y};
                var p4 = {'x': (mx - offset - deltax), 'y': (m.y + deltay)};
                arrowPathString.push({'path': 'M' + p1.x + ' ' + p1.y + ' ' + p2.x + ' ' + p2.y + ' ' + p3.x + ' ' + p3.y + ' ' + p4.x + ' ' + p4.y + ' ' + p1.x + ' ' + p1.y + 'z', 'angle': 90+angle});
                arrowPathString.push({'path': 'M' + p1.x + ' ' + p1.y + ' ' + p2.x + ' ' + p2.y + ' ' + p3.x + ' ' + p3.y + ' ' + p4.x + ' ' + p4.y + ' ' + p1.x + ' ' + p1.y + 'z', 'angle': 270+angle});
            } else {
                if (direction[0]) {
                    angle += 270;
                } else if (direction[1]) {
                    angle += 90;
                }
                // 2 1 1.5
                // 3 2 1.5
                // 4 3 2.25
                var offsetc = 1.5;
                if (this.size > 2) {
                    deltay += 1;
                    offsetc = 2.5;
                }
                var deltay = this.size + this.size/2+ 1;
                var deltax = Math.sqrt(Math.pow(arrowEdgeLen, 2) - Math.pow(deltay, 2));
                var offset = this.size/2 - 10;
                var mx = m.x;

                var p1 = {'x': (mx - offset), 'y': m.y};
                var p2 = {'x': (mx - offset - deltax), 'y': (m.y - deltay)};
                var p3 = {'x': (mx - offset - deltax + offsetc), 'y': m.y};
                var p4 = {'x': (mx - offset - deltax), 'y': (m.y + deltay)};
                arrowPathString.push({'path': 'M' + p1.x + ' ' + p1.y + ' ' + p2.x + ' ' + p2.y + ' ' + p3.x + ' ' + p3.y + ' ' + p4.x + ' ' + p4.y + ' ' + p1.x + ' ' + p1.y + 'z', 'angle': angle});
            }
        }
        return arrowPathString;
    },

    getEdgeLen: function() {
        var x1 = this.nodeA.getPos().x;
        var y1 = this.nodeA.getPos().y;
        var x2 = this.nodeB.getPos().x;
        var y2 = this.nodeB.getPos().y;

        return Math.floor(Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2)));
    },

    getEdgeMidPos: function() {
        var x1 = this.nodeA.getPos().x;
        var y1 = this.nodeA.getPos().y;
        var x2 = this.nodeB.getPos().x;
        var y2 = this.nodeB.getPos().y;

        var mx = 0;
        var my = 0;

        if (x1 < x2) {
            mx = x1 + (x2 - x1)/2;
        } else {
            mx = x2 + (x1 - x2)/2;
        }

        if (y1 < y2) {
            my = y1 + (y2 - y1)/2;
        } else {
            my = y2 + (y1 - y2)/2;
        }

        return {x: mx, y: my};
    },

    click: function(clickCallback) {
        var self = this;
        this.arrows.forEach(function(arrow) {
            arrow[0][0].onclick = function() {
                if(clickCallback) {
                    clickCallback(self);
                }
                self.trigger('click');
            };
        })

        this.el[0][0].onclick = function(e) {
            if(clickCallback) {
                clickCallback(self);
            }
            self.trigger('click');
        };

    },

    drawLine: function() {
        var twoPointPos = this.getPathString();
        this.el.attr('class', 'edge');
        this.el.attr('x1', twoPointPos.x1)
            .attr('y1', twoPointPos.y1)
            .attr('x2', twoPointPos.x2)
            .attr('y2', twoPointPos.y2)
            .attr('raw', 'raw')
            .style('stroke-width', this.size);
    },

    draw: function() {
        this.el = this.d3svg.append('svg:line');

        this.drawLine();
        this.drawArrow();
        if(!this.isVisible()){
            this.hide();
        }
    },

    getEndPointAngle: function() {
        var x1 = this.nodeA.getPos().x;
        var y1 = this.nodeA.getPos().y;
        var x2 = this.nodeB.getPos().x;
        var y2 = this.nodeB.getPos().y;

        var angle = Math.atan2(x1-x2, y2-y1);
        angle = (angle / (2 * Math.PI)) * 360;

        return angle;
    },

    drawArrow: function() {
        if(this.arrows){
            this.arrows.forEach(function(e) {e.remove();});
        }

        var arrowPathString = this.getArrowPathString();
        var middlePos = this.getEdgeMidPos();

        this.arrows = [];
        if (arrowPathString.length > 0) {
            for(var i=0,len=arrowPathString.length; i < len; i++) {
                var arrow = this.d3svg.append('svg:path');
                arrow.attr('d', arrowPathString[i].path)
                    .attr('transform', "rotate("+arrowPathString[i].angle + " " + middlePos.x+ " " + middlePos.y + ")");
                this.arrows.push(arrow);
            }
            this.el.attr('arrow', 'arrow');
        } else {
            this.el.attr('arrow', '');
        }
        this.updateStyle();
        if(!this.isVisible()){
            this.arrows.forEach(function(arrow) {
                arrow.style('display', 'none');
            });
        }
    },

    getAnotherNodeIpports: function(node) {
        if (this.nodeA == node) {
            return this.nodeB.ip_ports;
        } else if (this.nodeB == node) {
            return this.nodeA.ip_ports;
        }
        return [];
    },

    updateDirection: function(){
        this.direction = [false, false];
        var nodeBClientsServerIps = _.pluck(_.pluck(this.nodeB.clients, 'server'), 'ip');
        var nodeAIps = _.map(this.nodeA.ip_ports, function(item){ return item[0]; });
        if(_.intersection(nodeBClientsServerIps, nodeAIps).length > 0){
            this.direction[0] = true;
        }

        var nodeAClientsServerIps = _.pluck(_.pluck(this.nodeA.clients, 'server'), 'ip');
        var nodeBIps = _.map(this.nodeB.ip_ports, function(item){ return item[0]; });
        if(_.intersection(nodeAClientsServerIps, nodeBIps).length > 0){
            this.direction[1] = true;
        }

        this.drawArrow();
    },

    updatePath: function() {
        this.drawLine();
        this.drawArrow();
    },

    toBack: function(){
        //this.arrows.forEach(function(e) {e.toBack();});
    },

    toFront: function(){
        var line = this.el[0][0];
        line.parentNode.appendChild(line);
        //line.parentNode.insertBefore(line, this.d3svg.selectAll('text')[0][0]);

        this.arrows.forEach(function(arrow) {
            var arw = arrow[0][0];
            arw.parentNode.appendChild(arw);
        });
    },

    updateStyle : function(){
        if (this.isHide != undefined && this.isHide) {
            return;
        }
        if(this.isSelected){
            this.setSelectedStyle();
        }
        else if(this.isHighlight){
            this.setHighlightStyle();
        }
        else if(this.isUnSelected) {
            this.setUnSelectStyle();
        } else if (this.status && this.status !== '0') {
            this.el.style('stroke', '#249bc4');
            this.el.style('opacity', 1);
        } else{
            this.setDefaultStyle();
        }
    },
    setSelect: function(){
        if(!this.isSelected){
            this.isSelected = true;
            this.updateStyle();
            this.el.style('opacity', 1);
        }
    },
    clearSelect: function(){
        if(this.isSelected){
            this.isSelected = false;
            this.updateStyle();
            this.el.style('opacity', 1);
        }
    },
    setUnSelect: function() {
        if(!this.isUnSelected){
            this.isUnSelected = true;
            this.updateStyle();
            this.el.style('opacity', 0.5);
        }
    },
    clearUnSelect: function() {
        if(this.isUnSelected){
            this.isUnSelected = false;
            this.updateStyle();
            this.el.style('opacity', 1);
        }
    },
    getSelect: function(){
        return this.isSelected == true;
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

    equal: function(other){
        if(this.nodeA.id == other.nodeA.id && this.nodeB.id == other.nodeB.id){
            return true;
        }else if(this.nodeA.id == other.nodeB.id && this.nodeB.id == other.nodeA.id){
            return true;
        }
        return false;
    },
    updateSize: function(newSize){
        if(this.setSize(newSize)){
            this.el.style('stroke-width', newSize);
            this.drawArrow();
        }
    },
    setSize: function(newSize) {
        if(this.size == undefined || this.size != newSize){
            this.size = newSize;
            return true;
        }
        return false;
    },
    merge: function(other){
        this.weight += other.weight;

        this.direction = this.direction || [false, false];
        if(this.nodeA.id == other.nodeA.id || this.nodeB.id == other.nodeB.id){
            otherDirection = other.direction || [false, false];
        }else{
            otherDirection = [other.direction[1], other.direction[0]] || [false, false];
        }
        this.direction[0] = this.direction[0] || otherDirection[0];
        this.direction[1] = this.direction[1] || otherDirection[1];
    },
    replaceNode: function(node, newNode){
        if(this.nodeA.id == node.id){
            this.nodeA = newNode;
        }else if(this.nodeB.id == node.id){
            this.nodeB = newNode;
        }
    },
    isConnectNode: function(node){
        if(this.nodeA.id == node.id){
            return true;
        }else if(this.nodeB.id == node.id){
            return true;
        }
        return false;
    },
    getOppositeNode: function(node){
        if(this.nodeA.id == node.id){
            return this.nodeB;
        }else if(this.nodeB.id == node.id){
            return this.nodeA;
        }
        return null;
    },
    remove: function(){
        this._clear();
    },
    _clear: function(){
        try{
            this.el.remove();
            this.el = null;
        }catch(err){
        }
        try{
            this.arrows.forEach(function(e) {e.remove();});
            this.arrows = null;
        }catch(err){
        }
    },
    hide: function(){
        this.isHide = true;
        this.el.style('display', 'none');
        this.arrows.forEach(function(arrow) {
            arrow.style('display', 'none');
        });
    },
    show: function(){
        this.isHide = false;
        this.el.style('display', 'block');
        this.arrows.forEach(function(arrow) {
            arrow.style('display', 'block');
        });
    },
    clear:function(){
        if(this.isLocked("clear")){
            return;
        }
        this.getLock("clear");
        this._clear();
        for(var i in this){
            this[i] = null;
        }
    },
    getBBox: function(){
        var box1 = this.nodeA.getBBox(),
            box2 = this.nodeB.getBBox(),
            x = Math.min(box1.x, box2.x),
            x2 = Math.max(box1.x2, box2.x2),
            y = Math.min(box1.y, box2.y),
            y2 = Math.max(box1.y2, box2.y2);
        return {
            x:x,
            y:y,
            x2:x2,
            y2:y2,
            width:x2-x,
            height:y2-y
        };
    }
});


SpdMap.Edge = CBMSFLOW.klass(SpdMap.BaseEdge,{},{

});
