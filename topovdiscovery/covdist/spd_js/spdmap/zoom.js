
//translate pos based on current svg viewbox

Raphael.fn.setSize = function(width, height) {
    var r = this;
    var viewBox = r._viewBox || [];
    var scale = this.getViewBoxScale();
    r.width = width;
    r.height = height;
    r.canvas.setAttribute("width", width);
    r.canvas.setAttribute("height", height);
    if(viewBox){
        viewBox[2] = r.width / scale.x;
        viewBox[3] = r.height / scale.y;
        r.setViewBox(viewBox[0], viewBox[1], viewBox[2], viewBox[3], viewBox[4]);
    }
};

Raphael.fn.getViewBoxScale = function(pos) {
    var r = this;
    var viewBox = r._viewBox;
    if(viewBox == undefined || viewBox == null){
        return {'x' : 1.0, 'y' : 1.0};
    }
    var w = r.width;
    var h = r.height;
    var scaleX = w / viewBox[2];
    var scaleY = h / viewBox[3];
    return {'x' : scaleX, 'y' : scaleY};
};

Raphael.fn.translatePosToViewBox = function(pos) {
    var r = this;
    var viewBox = r._viewBox;
    if(viewBox == undefined || viewBox == null){
        return pos;
    }
    var w = r.width;
    var h = r.height;

    var scaleX = w / viewBox[2];
    var scaleY = h / viewBox[3];

    return {
        'x' :  (pos.x - viewBox[0]) * scaleX,
        'y' :  (pos.y - viewBox[1]) * scaleY
    };
};

Raphael.fn.translatePosFromViewBox = function (pos) {
    var r = this;
    var viewBox = r._viewBox;
    if(viewBox == undefined || viewBox == null){
        return pos;
    }

    var w = r.width;
    var h = r.height;
    var scaleX = w / viewBox[2];
    var scaleY = h / viewBox[3];

    return {
        'x' :  pos.x / scaleX + viewBox[0],
        'y' :  pos.y / scaleY + viewBox[1]
    };
};


var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.BaseZoomCtrl = CBMSFLOW.klass(SpdMap.RevertObject, {
    __init__: function(ele, map){
        this.ele = ele;
        this.r = map.r;
        this.map = map;
        var _this = this;
        this.panZoom = this.r.panzoom({minZoom: -5, initialZoom: 0, initialPosition: this.pos , viewboxChangeCallback : function(){ _this.onViewboxChange(); }});
        this.panZoom.enable();
        this._setupUI();
        this.viewBox = null;
        this.options = {zoomStep : 0.1};
    },
    _setupUI : function(){
        var _this = this;
        $(_this.ele).find('.auto-layout').bind('click', function(e){
            return false;
        });
        $(_this.ele).find('.zoom-fit').bind('click', function(e){
            var originlProportion = _this._genOriginalProportion();
            _this.setViewBox(originlProportion[0],originlProportion[1], originlProportion[2],originlProportion[3]);
            return false;
        });

        $(_this.ele).find('.zoom-in').bind('click', function(e){
            _this.panZoom.zoomIn(1);
            return false;
        });

        $(_this.ele).find('.zoom-out').bind('click', function(e){
            _this.panZoom.zoomOut(1);
            return false;
        });
    },
    _genOriginalProportion: function() {
        return this.map.genOriginalProportion();
    },
    zoomFitOrgInit: function(){
        this.zoomFitOrg();
        this.changed('init');
    },
    zoomFitOrg: function() {
        this.getLock('changed');
        var originlProportion = this._genOriginalProportion();
        var zoomData = this.getZoomData(false);
        var map_width = originlProportion[2];
        var map_height = originlProportion[3];

        if(map_width<=this.r.width && map_height<=this.r.height){
            var deltaX = (originlProportion[0] + originlProportion[2] / 2) - this.r.width/2;
            var deltaY = (originlProportion[1] + originlProportion[3] / 2) - this.r.height/2;
            this.setViewBox(deltaX, deltaY, this.r.width, this.r.height);
        }else{
            this.setViewBox(originlProportion[0],originlProportion[1], originlProportion[2],originlProportion[3]);
        }
        this.releaseLock('changed');
    },
    zoomFit: function() {
        var originlProportion = this._genOriginalProportion();
        this.setViewBox(originlProportion[0],originlProportion[1], originlProportion[2],originlProportion[3]);
    },
    onViewboxChange: function(){
        this.trigger('viewbox.changed', this.getViewBox());
    },
    getViewBox: function(){
        //really no public api ?
        return this.r._viewBox;
    },
    setViewBox: function(x, y, w, h){
        var rw = this.r.width,
            rh = this.r.height;

        var cx = x + w/2;
        var cy = y + h/2;

        var scale = Math.max(w/rw, h/rh);
        var zoom = (1-scale) / this.options.zoomStep;
        this.panZoom.setZoom(zoom, {'x' :cx, 'y': cy});
    },
    convertPos: function(pos){
        var zoom = this.panZoom.getCurrentZoom(),
            newWidth = this.r.width * (1 - (zoom * this.options.zoomStep)),
            newHeight = this.r.height * (1 - (zoom * this.options.zoomStep));
        return {
            x:pos.x + newWidth/2,
            y:pos.y + newHeight/2
        };
    },
    getZoomData: function(current){
        current = current || false;
        var zoom = this.panZoom.getCurrentZoom(),
            pos = this.panZoom.getCurrentPosition();
        if(!current){
            pos = this.convertPos(pos);
        }
        return {
            'zoom':zoom,
            'pos': pos
        };
    },
    setZoom: function(zoom, pos, current){
        current = current || false;
        if(current){
            pos = this.convertPos(pos);
        }
        this.panZoom.setZoom(zoom, pos);
    },
    getCurrentPos: function(){
        return this.panZoom.getCurrentPosition();
    },
    clear: function(){
        // clear data in map
        $(this.ele).find('.auto-layout').unbind('click');
        $(this.ele).find('.zoom-fit').unbind('click');
        $(this.ele).find('.zoom-in').unbind('click');
        $(this.ele).find('.zoom-out').unbind('click');
        this.r = null;
        this.map = null;
        this.panZoom = null;
        this.ele = null;
    }
});

SpdMap.ZoomCtrl = CBMSFLOW.klass(SpdMap.BaseZoomCtrl, {
    _setupUI : function($super){
        $super();
        var _this = this;
        var _onmousedown = this.r.canvas.parentNode.onmousedown || function(){};
        this.r.canvas.parentNode.onmousedown = function(e){
            var evt = window.event || e;
            if(evt.target.tagName != 'svg'){
                return;
            }
            _this.getLock('changed');
            _this.getLock('mousemove');
            _this.getLock('mousedown');
            _onmousedown.apply(this,arguments);
        };
        $(document).bind('mousemove', function(e){
            _this.releaseLock('mousemove');
        });
        var _onmouseup = this.r.canvas.parentNode.onmouseup || function(){};
        this.r.canvas.parentNode.onmouseup = function(e){
            var evt = window.event || e;
            if(evt.target.tagName != 'svg'){
                return;
            }
            _onmouseup.apply(this,arguments);
            _this.releaseLock('changed');
            if(_this.isLocked('mousemove')){
                _this.releaseLock('mousemove');
                return;
            }
            if(_this.isLocked('mousedown')){
                _this.changed();
                _this.releaseLock('mousedown');
            }
        };
    },
    onViewboxChange: function($super){
        $super();
        this.changed();
    },
    loadHistoryData:function(data){
        this.setZoom(data.zoom, data.pos);
    },
    getHistoryData:function(){
        return this.getZoomData();
    }
});


SpdMap.PreviewZoomCtrl = CBMSFLOW.klass(SpdMap.BaseZoomCtrl, {
    __init__:function($super, ele, map){
        $super(ele, map);
    },
    _setupUI:function($super){
        $super();
        $(this.ele).find('.auto-layout').parent().remove();
        //$(this.ele).find('.zoom-fit').parent().remove();
    },
    onViewboxChange: function($super){
        $super();
        this.trigger("zoom.change");
    }
});

