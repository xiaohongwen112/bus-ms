var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.History = CBMSFLOW.klass({
    max_count:40,
    __init__:function(){
        this._history = [];
        this._id = 0;
        this._index = -1;
    },
    getId:function(){
        return this._id;
    },
    add:function(action_name, data, force){
        force = force || false;
        if(this._index < this._history.length - 1){
            for(var i = this._index + 1;i < this._history.length;i++){
                this._history[i] = null;
            }
            this._history.splice(this._index + 1);
        }
        var prev_history = this._history[this._history.length - 1] || null;
        //if(!force && prev_history && prev_history._id && prev_history._id === data._id){
        //    return;
        //}
        this._history.push({
            'id':this._id ++,
            'action':action_name,
            'data':data
        });
        this._index ++ ;

        if(this._index + 1 > this.max_count){
            this._history[0] = null;
            this._history.shift();
            this._index -- ;
        }
    },
    get:function(id){
        for(var i = 0;i < this._history.length;i++){
            var history = this._history[i];
            if(history.id == id){
                this._index = i;
                return history;
            }
        }
        return null;
    },
    getHistoryByRange:function(from, to){
        var result = [];
        for(var i = 0;i < this._history.length;i++){
            var history = this._history[i];
            if(history.id >=from  && history.id < to){
                result.push(history);
            }
        }
        return result;
    },
    current_action:function(){
        if(this._index == -1){
            return null;
        }
        var history = this._history[this._index];
        return history['action'];
    },
    current:function(){
        return this._history[this._index];
    },
    version:function(){
        return this._history[this._index].id;
    },
    maxId:function(){
        return this._id - 1;
    }
});

SpdMap.RevertObject = CBMSFLOW.klass({
    logger:CBMSFLOW.getLogger('debug', ['warning', 'error']),
    __setup__:function(){
        this.getLock('changed');
        this._history = new SpdMap.History();
        if(CBMSFLOW.environment("DEBUG")){
            function addDecorator(func){
                return $.extend(function(){
                    var sid = SpdMap.HistoryManager.genStack();
                    var hid = SpdMap.HistoryManager.hid;
                    var result = func.apply(this, arguments);
                    if(SpdMap.HistoryManager.hid - hid > 1){
                        this.logger.error("remember history too many times.",{
                            "actions":SpdMap.HistoryManager.getStack(sid)
                        });
                    }
                    SpdMap.HistoryManager.removeStack(sid);
                    return result;
                },{
                    valueOf:  function() { return func; },
                    toString: function() { return func.toString(); }
                });
            }
            function addDecorator2(func){
                return $.extend(function(){
                    var hid = SpdMap.HistoryManager.hid;
                    var result = func.apply(this, arguments);
                    if(SpdMap.HistoryManager.hid != hid){
                        this.logger.error("history revert error.");
                    }
                    return result;
                },{
                    valueOf:  function() { return func; },
                    toString: function() { return func.toString(); }
                });
            }
            for(var i in this){
                if(i == '__object__'){
                    continue;
                }
                else if(i == 'revert'){
                    this[i] = addDecorator2(this[i]);
                }
                else if($.isFunction(this[i])){
                    this[i] = addDecorator(this[i]);
                }
            }
            this.__addDecorator = addDecorator;
        }
        else{
            this.__addDecorator = function(x){ return x;};
        }

    },
    __born__:function(){
        this.releaseLock('changed');
        this.changed('born');
    },
    getHistoryVersion:function(){
        return this._history.version();
    },
    getHistoryMaxId: function(){
        return this._history.maxId();
    },
    getHistoryData:function(){
        return;
    },
    loadHistoryData:function(data){
        return;
    },
    prevChange:function(){
        return this._history.current_action();
    },
    revert:function(){
        var history_data = this._history.current();
        this.getLock('changed');
        this.loadHistoryData(history_data.data);
        this.trigger('revert', history_data.data);
        this.releaseLock('changed');
    },
    revertHistoryVersion:function(version){
        if(version == this.getHistoryVersion()){
            return;
        }
        var history_data = this._history.get(version);
        this.getLock('changed');
        this.loadHistoryData(history_data.data);
        this.trigger('revert', history_data.data);
        this.releaseLock('changed');
    },
    changed:function(action_name){
        if(this.isLocked('changed') || this.isLocked("revert")){
            return;
        }
        this._history.add(action_name, this.getHistoryData.apply(this,arguments));
        this.trigger('changed', action_name);
    }
});
