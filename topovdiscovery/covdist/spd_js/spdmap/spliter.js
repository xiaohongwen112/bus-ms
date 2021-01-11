var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.NodeSpliter = CBMSFLOW.klass({


    __init__: function(map, node, ipports){
        this.map = map;
        this.node = node;
        this.ipports = this.convertIpports(ipports);
        this.dataSource = CBMSFLOW.environment('flowlistProxy');
    },
    convertIpports: function(ipports){
        return ipports;
    },
    splitPrepare: function(){
        var connectEdges = this.map.getConnectEdges(this.node);
        var self = this;
        _.each(connectEdges, function(edge){
            var oppositeNode = edge.getOppositeNode(self.node);
            oppositeNode.removeClientsByServerIp(self.ipports[0][0]);
        });
    },
    split: function(pos){
        this.splitPrepare();
        this.addNewNode(pos);
        this._split();
    },
    splitAndMerge: function(targetNode, pos){
        this.splitPrepare();
        if(!targetNode.equal(this.node)){
            this.mergeNode(targetNode);
            this._split();
        }
    },
    splitAndHideBox: function(pos){
        this.splitPrepare();
        this.hideBoxNode(pos);
        this._split();
    },
    _split: function(){
        this.splitNode();        
        this.map.hightlightMatchNodesAndEdges();
    },
    addNewNode: function(pos){
        var newNode = this._newNode(pos);
        this.map.nodes.push(newNode);
        this.map.drawNode(newNode);
        this.map.resizeNode(newNode);
        this.map.changeSingleRawNodeDispState(newNode);
        this.updateEdges(newNode);
        newNode.setUnSelect();
        return newNode;
    },
    splitNode: function(){
        this.node.split(this.ipports[0][0]);
        this.map.resizeNode(this.node);
        this.updateEdges(this.node);

        var connectEdges = this.map.getConnectEdges(this.node);
        this.map.setNodesEdgesSelectState(connectEdges);
    },
    mergeNode: function(targetNode){
        var newNode = this._newNode();
        targetNode.merge(newNode);
        if(targetNode.raw){
            targetNode.rename(this.map.newRipeNodeName());
        }
        this.map.resizeNode(targetNode);
        targetNode.clearRaw();

        this.updateEdges(targetNode);
    },
    hideBoxNode: function(pos){
        var newNode = this.addNewNode(pos);
        var connectEdges = this.map.getConnectEdges(newNode, true);
        this.map.hideBox.addNodes([newNode]);
        this.map.hideBox.addEdges(connectEdges);
    },
    updateEdges: function(node){
        var callback = function(oppositeIpPorts){
            var self = this;
            var newEdges = {};
            $.each(oppositeIpPorts, function(i, item){
                var ipportNode = self.map.getNodeByIpport(item);
                if(ipportNode){
                    var edgeKey = ipportNode['node'].id;
                    if(newEdges[edgeKey]){
                        newEdges[edgeKey]['weight'] += ipportNode['ipport'][2];
                    }else{
                        newEdges[edgeKey]= {
                            'nodeA': node,
                            'nodeB': ipportNode['node'],
                            'weight': ipportNode['ipport'][2],
                            'containerId': self.map.container.attr('id'),
                            'direction': [false, false]
                        };
                    }
                }
            });
            var newEdges = $.map(newEdges, function(item){
                return new SpdMap.Edge(item);
            });
            var oldEdges = this.map.getConnectEdges(node);

            var needRemoveEdges = [];
            $.each(oldEdges, function(i, oldEdge){
                var existed = false;
                $.each(newEdges, function(j, newEdge){
                    if(newEdge.equal(oldEdge)){
                        existed = true;
                        return false;
                    }
                });
                if(!existed){
                    needRemoveEdges.push(oldEdge);
                }
            });
            this.map.removeEdges(needRemoveEdges);

            var needAddEdges = [];
            $.each(newEdges, function(i, newEdge){
                var existedEdge = null;
                $.each(oldEdges, function(j, oldEdge){
                    if(oldEdge.equal(newEdge)){
                        existedEdge = oldEdge;
                        return false;
                    }
                });
                if(existedEdge){
                    existedEdge.weight = newEdge.weight;
                }else{
                    needAddEdges.push(newEdge);
                }
            });
            $.each(needAddEdges, function(i, edge){
                self.map.edges.push(edge);
                self.map.drawEdge(edge);
                if(!edge.isVisible()) self.map.hideBox.addEdge(edge);
                edge.setUnSelect();
            });

            var updatedEdges = self.map.getConnectEdges(node);
            _.each(updatedEdges, function(item){
                item.updateDirection();
            });
        };
        var data = {'ipports': JSON.stringify(node.ip_ports)};
        this.dataSource.getOppositeIpports(data, $.proxy(callback, this));
    },
    _newNode: function(pos){
        var name = this.ipports[0][0];
        var splitInfo = this.node.getSplitInfo(this.ipports[0][0]);
        var splitNodeInfo = {
            'id': this._gen_node_id(),
            'name': name,
            'pos': pos,
            'ip_ports': $.extend(true, [], this.ipports),
            'visible': true,
            'raw': true,
            'servers' : splitInfo.servers,
            'clients' : splitInfo.clients
        };
        var weight = 0;
        var self = this;
        $.each(this.node.ip_ports, function(i, itemA){
            $.each(self.ipports, function(j, itemB){
                if(itemA[0] == itemB[0]){
                    weight += itemA[2];
                    return false;
                }
                return null;
            });
        });
        splitNodeInfo['weight'] = weight;

        return new SpdMap.Node(splitNodeInfo);
    },
    _gen_node_id: function(){
        var maxId = 0;
        $.each(this.map.nodes, function(i, item){
            var itemId = parseInt(item.id);
            if(itemId > maxId){
                maxId = itemId;
            }
        });
        return maxId + 1;
    }
});



SpdMap.NodeSplitDragger = CBMSFLOW.klass(SpdMap.RevertObject, {

    nodeRadius: 15,
    nodeCenterOffset: {'left': 15, 'top': 15},

    __init__: function(map, node, ipportsCallback, splitedCallback){
        this.map = map;
        this.node = node;
        this.ipportsCallback = ipportsCallback;
        this.splitedCallback = splitedCallback;
    },
    bindDrag: function(elem){
        elem.draggable({
            zIndex: 1000,
            appendTo: "body",
            cursor: "pointer",
            cursorAt: this.nodeCenterOffset,
            helper: $.proxy(this.getDragHelper, this),
            start: $.proxy(this.splitDragStart, this),
            drag: $.proxy(this.splitDragMove, this),
            stop: $.proxy(this.splitDragEnd, this),
            revert: $.proxy(this.splitRevert, this),
            revertDuration: 300
        });
        this.selectedAll = false;
        //this.selectedAll = selectResult['selectedAll'] || false;
    },
    unbindDrag: function(elem){
        elem.draggable('destroy');
    },
    splitDragStart: function(event, ui){
        this.needRevert = this.selectedAll;
        if(this.selectedAll){
            $(ui.helper).find('.node').addClass('error');
        }
    },
    splitDragMove: function(event, ui){
        this.needRevert = this.selectedAll;
        if(this.isInMap(ui)){
            $.each(this.map.nodes, function(i, node){
                node.clearIntersect();
            });
            $(ui.helper).find('.node').removeClass('invalid-pos');

            var intersectNode = this.getIntersectNode(ui);
            if(intersectNode){
                intersectNode.setIntersect();
                var isConnect = this.isConnectWithNode(intersectNode);
                if(isConnect || intersectNode.equal(this.node)){
                    this.needRevert = true;
                    $(ui.helper).find('.node').addClass('invalid-pos');
                }
            }else{
                if(this.isInHidebox(ui)){
                    this.map.hideBox.highlight();
                }else{
                    this.map.hideBox.clearHighlight();
                }
            }
        }else{
        }
    },
    splitDragEnd: function(event, ui){
        if(this.isInMap(ui) && !this.selectedAll){
            var nodeCenter = this.getNodeCenter(ui, true);
            var ipports = this.ipportsCallback(event, ui);
            var nodeSpliter = new SpdMap.NodeSpliter(this.map, this.node, ipports);
            var intersectNode = this.getIntersectNode(ui);
            if(intersectNode){
                var isConnect = this.isConnectWithNode(intersectNode);
                if(isConnect || intersectNode.equal(this.node)){
                    return;
                }else{
                    nodeSpliter.splitAndMerge(intersectNode, nodeCenter);
                }
                intersectNode.clearIntersect();
            }else if(this.isInHidebox(ui)){
                nodeSpliter.splitAndHideBox(nodeCenter);
            }else{
                nodeSpliter.split(nodeCenter);
            }
            this.map.changed('split');
            if(this.splitedCallback){
                this.splitedCallback(event, ui);
            }
        }else{
        }
    },
    splitRevert: function(){
        return this.needRevert;
    },
    isConnectWithNode: function(node){
        var isConnect = this.map.isNodesConnect(this.node, node);
        return isConnect;
    },
    getDragHelper: function(event){
        var helperElem = $(''+
            '<div class="node-spliter">'+
                '<div class="node" style="width:30px;height:30px;"></div>'+
            '</div>'
        );
        return helperElem;
    },
    isInMap: function(ui){
        var nodeCenter = this.getNodeCenter(ui);
        var flowListPos = {
            'x': $('.flows-block').offset().left,
            'y': $('.flows-block').offset().top
        }
        if(nodeCenter.y + this.nodeRadius < flowListPos.y){
            return true;
        }
        return false;
    },
    getIntersectNode: function(ui){
        var nodeCenter = this.getNodeCenter(ui, true);
        var intersectNode = null;
        var self = this;
        $.each(this.map.nodes, function(i, node){
            if(!node.isVisible()){
                return null;
            }
            var distance = SpdMap.utils.calcDistance(node.getPos(), nodeCenter);
            var radiusTotal = node.getOuterRadius() + self.nodeRadius;
            if(distance <= radiusTotal){
                intersectNode = node;
                return false;
            }
            return null;
        });
        return intersectNode;
    },
    isInHidebox: function(ui){
        var nodeCenter = this.getNodeCenter(ui, true);
        return this.map.hideBox.isNodeLikeTouch(nodeCenter, this.nodeRadius);
    },
    getNodeCenter: function(ui, toMapPos){
        toMapPos = toMapPos || false;
        var uiOffset = ui.offset;
        var nodeCenter = {'x': uiOffset.left+this.nodeCenterOffset.left, 'y': uiOffset.top+this.nodeCenterOffset.top};
        if(toMapPos){
            nodeCenter = this.map.windowPosToMapPos(nodeCenter);
        }
        return nodeCenter;
    }
});


