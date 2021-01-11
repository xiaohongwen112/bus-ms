var SpdMap = CBMSFLOW.module('spdmap');


SpdMap.NodeGroup = CBMSFLOW.klass('Group.BaseObject', {
    _name : 'spdmap.node',
    inGroup : function(node){
        if(this._support(node)){
            for(var i in this._elements){
                var eli = this._elements[i];
                if(eli.equal(node)){
                    return true;
                }
            }
        }
        return false;
    },
    isLinked: function(edge){
        var islinked = false;
        this.each(function(i, node){
            if(edge.isConnectNode(node)){
                islinked = true;
                return false;
            }
            return null;
        });
        return islinked;
    },
    hide:function(){
        this.each(function(i, node){
            node.hide();
        });
    },
    reset:function(nodes){
        this.empty();
        this.extendArray(nodes);
    }
});


SpdMap.EdgeGroup = CBMSFLOW.klass('Group.BaseObject', {
    _name : 'spdmap.edge',
    inGroup : function(edge){
        if(this._support(edge)){
            for(var i in this._elements){
                var eli = this._elements[i];
                if(eli.equal(edge)){
                    return true;
                }
            }
        }
        return false;
    },
    getConnectEdges: function(node){
        var edges = [];
        this.each(function(i,edge){
            if(edge.isConnectNode(node)){
                edges.push(edge);
            }
        });
        return edges;
    },
    hide:function(){
        this.each(function(i, edge){
            edge.hide();
        });
    },
    reset:function(edges){
        this.empty();
        this.extendArray(edges);
    }
});