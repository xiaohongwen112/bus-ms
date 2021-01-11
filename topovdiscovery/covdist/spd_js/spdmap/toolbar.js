var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.HistoryManager = CBMSFLOW.klass({
    max_count: 20,
    logger: CBMSFLOW.getLogger('debug', ['error']),
    __init__:function(elems, priority , accept_actions, ignore_actions){
        this._history = [];
        this._id = 0;
        this._index = -1;
        this._elems = elems || {};
        this._actions = accept_actions || '*';
        this._i_actions = ignore_actions || [];
        this._p = priority || [];

        var _this = this;
        $.each(elems,function(elem_name,elem){
            elem.bind("changed",function(action){
                var action_name = action?elem_name + '.' + action:elem_name;
                if(_this._is_ignore_action(action_name)){
                    return;
                }
                if(_this._is_accept_action(action_name)){
                    _this.remember(action_name, _this._get_all_version());
                }
            });
        });
    },
    _is_accept_action:function(action_name){
        if(this._actions == '*'){
            return true;
        }
        var actions = action_name.split('.');
        while(true){
            if(actions.length == 0){
                return false;
            }
            var a_n = actions.join('.');
            if($.inArray(a_n, this._actions) != -1){
                return true;
            }
            actions.pop();
        }
    },
    _is_ignore_action:function(action_name){
        if(this._i_actions == '*'){
            return true;
        }
        var actions = action_name.split('.');
        while(true){
            if(actions.length == 0){
                return false;
            }
            var a_n = actions.join('.');
            if($.inArray(a_n, this._i_actions) != -1){
                return true;
            }
            actions.pop();
        }
    },
    _get_all_version:function(){
        var versions = {};
        for(var i in this._elems){
            versions[i] = this._elems[i].getHistoryVersion();
        }
        return versions;
    },
    _get_all_max_id:function(){
        var versions = {};
        for(var i in this._elems){
            versions[i] = this._elems[i].getHistoryMaxId();
        }
        return versions;
    },
    _revert_all_version:function(versions){
        var _this = this;
        for(var a in this._elems){
            this._elems[a].getLock("revert");
        }
        
        //revert first
        _.each(this._p, function(n){
            if(_this._elems[n]){
                _this._elems[n].revertHistoryVersion(versions[n]);
            }
        });

        _.each(_.difference(_.keys(this._elems), this._p), function(n){
            _this._elems[n].revertHistoryVersion(versions[n]);
        });

        for(var d in this._elems){
            this._elems[d].releaseLock("revert");
        }
        this.trigger('revert',versions);
    },
    remember_init: function(){
        this.remember('init', this._get_all_version());
    },
    remember:function(action_name, versions){
        if(this.isLocked("remember")){
            return;
        }
        if(this._index < this._history.length - 1){
            for(var i = this._index + 1;i < this._history.length;i++){
                this._history[i] = null;
            }
            this._history.splice(this._index + 1);
        }

        var prev_history = this._history[this._history.length - 1] || null;
        if(prev_history && _.isEqual(prev_history.versions, versions)){
            return;
        }
        this._history.push({
            'id':this._id ++,
            'action':action_name,
            'versions':versions
        });
        this._index ++ ;

        if(this._index + 1 > this.max_count){
            this._history[0] = null;
            this._history.shift();
            this._index -- ;
        }

        this.logger.info('remember history', {
            'id': this._id - 1,
            'action': action_name,
            'versions': versions
        });
        this.checkRemember(action_name);
        this.trigger('remember', action_name, versions);
    },
    checkRemember:function(action_name){
        this.__object__.hid ++;
        if(CBMSFLOW.environment("DEBUG")){
            var stack = CBMSFLOW.environment("DEBUG.HISTORY.STACK");
            for(var i in stack){
                stack[i].push(action_name);
            }

            var versions = this._get_all_max_id();
            if(this.__last_version){
                for(var j in this.__last_version){
                    var delta_v = versions[j] - this.__last_version[j];
                    if(delta_v > 1){
                        var _log_level = "warning";
                        if(delta_v > 2){
                            _log_level = "error";
                        }
                        this.logger[_log_level]("remember history too many times.",{
                            "object":j,
                            "action":action_name,
                            "times":versions[j] - this.__last_version[j],
                            "history": this._elems[j]._history.getHistoryByRange(this.__last_version[j],versions[j])
                        });
                    }
                }
            }
            this.__last_version = versions;
        }
    },
    next:function(){
        if(this._index < this._history.length - 1){
            this._index ++ ;
        }
        return this._history[this._index];
        //return this.
    },
    prev:function(){
        if(this._index > 0){
            this._index -- ;
        }
        return this._history[this._index];
    },
    undo:function(){
        if(this._index > 0){
            var history = this.prev();
            this._revert_all_version(history.versions);
            this.logger.info('revert history', {
                'id': history.id,
                'action': 'undo',
                'versions': history.versions
            });
        }
    },
    redo:function(){
        if(this._index < this._history.length - 1){
            var history = this.next();
            this._revert_all_version(history.versions);
            this.logger.info('revert history', {
                'id': history.id,
                'action': 'redo',
                'versions': history.versions
            });
        }
    },
    revert:function(id){
        for(var i = 0;i < this._history.length;i++){
            var history = this._history[i];
            if(history.id == id){
                this._index = i;
                this._revert_all_version(history.versions);
                return;
            }
        }
    },
    isFirst:function(){
        return this._index <= 0;
    },
    isLast:function(){
        return this._index + 1 == this._history.length;
    }
},{
    __setup__:function(){
        this.hid = 0;
        CBMSFLOW.environment("DEBUG.HISTORY.STACK",{});
        $.extend(this, {
            genStack:function(){
                var id = CBMSFLOW.util.auid("debug.history");
                CBMSFLOW.environment("DEBUG.HISTORY.STACK")[id] = [];
                return id;
            },
            removeStack:function(id){
                CBMSFLOW.environment("DEBUG.HISTORY.STACK")[id] = [];
                delete CBMSFLOW.environment("DEBUG.HISTORY.STACK")[id];
            },
            getStack:function(id){
                return CBMSFLOW.environment("DEBUG.HISTORY.STACK")[id] || [];
            }
        });
    }
});




SpdMap.Toolbar = CBMSFLOW.klass({
    tools : ['handing','undo', 'redo', 'save', 'setting', 'preview', 'convert', 'combing', 'reset'],
    __init__:function(){
        this._tools = {};
        this.addTools(this.tools);
        $('#spdmap-toolbar button').tooltip();
    },
    _getElem:function(tool_name){
        return $("#spdmap-toolbar button[name='"+tool_name+"']");
    },
    enable:function(tool_name){
        this._getElem(tool_name).removeClass('disabled');
    },
    disable:function(tool_name){
        this._getElem(tool_name).addClass('disabled');
    },
    addTools:function(tools){
        for(var i in tools){
            var tool_name = tools[i];
            var tool_elem = this._getElem(tool_name);
            if(this._tools[tool_name] == undefined){
                this._createTool(tool_name, tool_elem);
            }
        }
    },
    _createTool:function(tool_name, tool_elem){
        this._tools[tool_name] = tool_elem;
        var _this = this;
        tool_elem.click(function(e){
            if($(this).hasClass('disabled')){
                return;
            }
            _this.trigger(tool_name + '.click', e);
            if(tool_name == "handing"){
                var mapName = CBMSFLOW.environment().map_name;
                var name = window.localStorage.getItem("spdName");
                window.location.href = '/zh-cn/spd/'+mapName+'/filter/'+name+'/view/';
            }
        });
    }
});

