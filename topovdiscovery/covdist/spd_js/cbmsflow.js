var CBMSFLOW = {};

(function($){
    var cbmsflow_id = 0;
    var addMethod = function(func, p_func){
        return $.extend(function(){
            var self = this;
            var args = $.makeArray(arguments);
            args.unshift(function(){return p_func.apply(self, $.makeArray(arguments));});
            return func.apply(self, args);
        },{
          valueOf:  function() { return func; },
          toString: function() { return func.toString(); }
        });
    };
    var addMethod2 = function(func, p_func){
        return $.extend(function(){
            p_func.apply(this, arguments);
            func.apply(this, arguments);
        },{
          valueOf:  function() { return func; },
          toString: function() { return func.toString(); }
        });
    };
    var CreateCbmsflowObject = function(parent, extend_proto, static_proto){
        var CbmsflowObject = function(){
            this.__cfid__ = cbmsflow_id ++;
            this.__object__ = CbmsflowObject;
            this.__setup__();
            this.__meta__();
            this.__init__.apply(this, arguments);
            this.__born__();
        };
        var ParentObject = function() { };
        ParentObject.prototype = parent.prototype;
        CbmsflowObject.prototype = new ParentObject;

        for(var i in extend_proto){
            var v = extend_proto[i];
            if(i == '__setup__'){
                CbmsflowObject.prototype[i] = addMethod2(v, parent.prototype[i]);
            }
            else if($.isFunction(v) && $.trim($.argumentNames(v)[0]) == '$super'){
                CbmsflowObject.prototype[i] = addMethod(v, parent.prototype[i]);
            }
            else{
                CbmsflowObject.prototype[i] = v;
            }
        }

        $.extend(CbmsflowObject, parent);

        for(var i2 in static_proto){
            var v2 = static_proto[i2];
            if(i2 == '__setup__'){
                CbmsflowObject[i2] = addMethod2(v2, parent[i2]);
            }
            else{
                CbmsflowObject[i2] = v2;
            }
        }
        CbmsflowObject.__elass__ = true;
        //born
        CbmsflowObject.__setup__();
        return CbmsflowObject;
    };
    

    $.extend({
        cextend:function(children,extend,parent) {
            parent = parent || {};
            var parent_prototype = typeof parent == 'function'?parent.prototype : parent;
            if(typeof children == 'function'){
                $.extend(children.prototype,parent_prototype,extend);
            }
            else{
                $.extend(children,parent_prototype,extend);
            }
        },
        fextend:function(func,extend,statics){
            statics = statics || {};
            extend = extend || {};
            $.extend(func.prototype,extend);
            $.extend(func,statics);
        },
        findWindow:function(name, orself){
            var $window = $();
            orself = orself || false;
            switch(name){
                case 'self':
                    $window = $(window.self);
                    break;
                case 'parent':
                    if(orself || window.parent != window.self){
                        $window = $(window.parent);
                    }
                    break;
                case 'top':
                    if(orself || window.top != window.self){
                        $window = $(window.top);
                    }
                    break;
            }
            return $window;
        },
        findDocument:function(name, orself){
            var $document = $();
            orself = orself || false;
            switch(name){
                case 'self':
                    $document = $(window.self.document);
                    break;
                case 'parent':
                    if(orself || window.parent != window.self){
                        $document = $(window.parent.document);
                    }
                    break;
                case 'top':
                    if(orself || window.top != window.self){
                        $document = $(window.top.document);
                    }
                    break;
            }
            return $document;
        },
        parentDocument:function(selector){
            return $(selector, $.findDocument('parent'));
        },
        argumentNames: function(func) {
          var names = func.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(/, ?/);
          return names.length == 1 && !names[0] ? [] : names;
        },
        extendclass:function(parent, extend_proto, static_proto){
            return CreateCbmsflowObject(parent, extend_proto, static_proto);
        },
        extendinterface:function(obj, intf, stintf){

        },
        goBack:function(url){
            url = url || document.referrer || '/';
            window.location.href = url;
        }
    });
})(jQuery);


//base
(function($){
    CBMSFLOW.util = {
        constKeyConvert:function(constants, obj){
            var new_obj = {};
            for(var k in obj){
                var modules = k.split(".");
                var constant = constants;
                for (var i=0; i<modules.length; i=i+1) {
                    constant = constant[modules[i]] || {};
                }
                var new_k = constant || k;
                new_obj[new_k] = obj[k];
            }
            return new_obj;
        },
        propToQueryString:function(dictionary) {
            var o = [];
            var val;
            for (var prop in dictionary) {
                val = '' + dictionary[prop];
                o.push(encodeURIComponent(prop) + '=' + encodeURIComponent(dictionary[prop]));
            }
            return o.join('&');
        },
        queryStringToProp:function(args) {
            args = this.trim(args, '&\?#');

            var parts = args.split('&');
            var output = {};

            var key;
            var value;
            var equalsSegments;
            var lim = parts.length;
            for (var i=0,l=lim; i<l; i++) {
                equalsSegments = parts[i].split('=');
                key = decodeURIComponent(equalsSegments.shift());
                value = equalsSegments.join("=");
                output[key] = decodeURIComponent(value);
            }
            return output;
        },
        trim:function(str, delim) {
            if (delim) return str.replace(new RegExp("^[\\s" + delim + "]+"),'').replace(new RegExp("[\\s" + delim + "]+$"), '');
            else return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        },
        getRelativeTimeFromStr:function(str) {
            str = str.replace(/-/g,"/");
            var t = new Date(str);
            var startTime = t.getTime() / 1000;
            return startTime;
        },
        makeUrl:function(url, query){
            var query_str = this.propToQueryString(query);
            if(!query_str){
              return url;
            }
            if(url.indexOf('?') == -1){
              return url + '?' + query_str;
            }
            else{
              return url + '&' + query_str;
            }
        },
        urlJoin: function(){
            var args = $.makeArray(arguments);
            for(var i=0; i < args.length; i++){
                var l = args[i].length;
                if(i < args.length - 1 && args[i][l-1] == '/'){
                    args[i] = args[i].slice(0,-1);
                }
                if(i > 0 && args[i][0] == '/'){
                    args[i] = args[i].slice(1);
                }
            }
            return args.join('/');
        },
        isNum:function(smt){
            return !isNaN(smt);
        },
        isFunc:function(smt){
            return $.isFunction(smt);
        },
        inArray:function(v,arr){
            return $.inArray(v,arr);
        },
        auid:function(name,prefix){
            var auid_module = CBMSFLOW.module('Auid');
            if(auid_module[name] == undefined){
                auid_module[name] = 0;
            }
            var n_id = auid_module[name] ++;
            if(prefix != undefined) return ''+prefix+n_id;
            else return n_id;
        },
        formatString:function(fmt, obj, named) {
            if (named) {
                return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)]);});
            } else {
                return fmt.replace(/%s/g, function(match){return String(obj.shift());});
            }
        },
        is_i18n_url:function(url){
            url = url || window.location.href;
            var LANGUAGE_CODE = CBMSFLOW.environment("LANGUAGE_CODE");
            if(LANGUAGE_CODE){
                url = url.replace(/^https?:\/+/,"");
                if(url[0] == "."){
                    return true;
                }
                url = url.replace(/^.*?\/+/,"");
                re = new RegExp("^"+LANGUAGE_CODE);
                return re.test(url);
            }
            return false;
        },
        prefix_i18n_url:function(url){
            var LANGUAGE_CODE = CBMSFLOW.environment("LANGUAGE_CODE");
            if(LANGUAGE_CODE){
                var re = new RegExp("^((https?:\/\/+)?.*?\/)");
                if(url[url.length - 1] != "/" && !url.match(/[#\?]/)){
                    url = url + "/";
                }
                return url.replace(re, "$1"+LANGUAGE_CODE+"/");
            }
            else{
                return url;
            }
        },
        format_i18n_url:function(url, obj, named){
            if(!url || typeof url != 'string'){
                url = '/';
            }
            url = this.formatString(url, obj, named);
            if(this.is_i18n_url(url)){
                return url;
            }
            else{
                return this.prefix_i18n_url(url);
            }
        },
        make_i18n_url:function(url, query){
            return this.format_i18n_url(this.makeUrl(url, query));
        },
        time:function(){
            return new Date().getTime() / 1000;
        },
        clearDict:function(dict){
            for(var i in dict){
                delete dict[i];
            }
            return dict;
        }
    };

    CBMSFLOW.functool = {
        //partial(scope, func, [], [*pos])
        //partial(scope, func, [*param])
        //partial(scope, func, [*param], [*pos])
        partial: function(scope, func, param, pos){
            var args = [];
            param = $.extend([], param);
            if(pos){
                for(var i =0;i<pos.length;i++){
                    args[pos[i]] = param.shift();
                }
            }
            else{
                args = param;
                pos = [];
                for(var j=0;j<args.length;j++){
                    pos.push(j);
                }
            }
            function partial_func(){
                var defined_args = $.extend([], args);
                var partial_args = $.extend([], arguments);
                var pos_i = 0;
                while(partial_args.length > 0){
                    while(pos.indexOf(pos_i) != -1){
                        pos_i ++;
                    }
                    defined_args[pos_i ++] = partial_args.shift();
                }
                return func.apply(scope, defined_args);
            }
            return partial_func;
        },
        synccall: function(scope, asyncfunc, param, pos, timeout){
            var r = undefined;
            var i = true;
            var t = CBMSFLOW.util.time();
            timeout = timeout || 5;
            asyncfunc = this.partial(scope, asyncfunc, param, pos);
            asyncfunc(function(){
                i = false;
                r = $.extend([], arguments);
            });
            while(i){
                var nt = CBMSFLOW.util.time();
                if(timeout && (nt - t > timeout)){
                    break;
                }
            }
            return r;
        }
    };

    $.cextend(CBMSFLOW,{
        extend:function(obj){
            $.cextend(CBMSFLOW, obj);
        },
        module:function(module_name, new_module){
            var modules = module_name.split(".");
            var obj = CBMSFLOW;
            var l = modules.length;
            new_module = new_module || {};
            for (var i=0; i<l; i=i+1) {
                var default_module = {};
                if(i+1 == l){
                    default_module = new_module;
                }
                obj[modules[i]] = obj[modules[i]] || default_module;
                obj = obj[modules[i]];
            }
            return obj;
        },
        hasmodule:function(module_name){
            var modules = module_name.split(".");
            var obj = CBMSFLOW;
            for (var i=0; i<modules.length; i=i+1) {
                obj = obj[modules[i]];
                if(obj === undefined){
                    return false;
                }
            }
            return true;
        },
        getmodule:function(module_name,default_value){
            var modules = module_name.split(".");
            var obj = CBMSFLOW;
            for (var i=0; i<modules.length; i=i+1) {
                obj = obj[modules[i]];
                if(obj === undefined){
                    return default_value;
                }
            }
            return obj;
        },
        extendmodule:function(module_name, extend_proto){
            var obj = this.module(module_name);
            return $.extend(obj, extend_proto);
        },
        debug:function(msg, infos, level){
            if(CBMSFLOW.environment("DEBUG")){
                var handler = console;
                var level_func = {
                    'log':'log',
                    'warning':'warn',
                    'error':'error',
                    'debug':'log',
                    'info':'log'
                };
                var func_name = level_func[level];
                if(!func_name){
                    func_name = 'log';
                }
                var msgs = [msg];
                for(var i in infos){
                    msgs.push('\n');
                    msgs.push(CBMSFLOW.util.formatString('   >> %s:', [i]));
                    msgs.push(infos[i]);
                }
                handler[func_name].apply(handler, msgs);
            }
        },
        setLogger:function(name, handlers){
            var logger = CBMSFLOW.module('LOGGER');
            logger[name] = $.extend({
                'debug':console.log,
                'log':console.log,
                'info':console.log,
                'warning':console.warn,
                'error':console.error
            }, handlers);
        },
        configLogger:function(configs){
            configs = configs || {};
            CBMSFLOW.LOGGER = {};
            for(var name in configs){
                this.setLogger(name, configs[name]);
            }
        },
        getLogger:function(name, levels){
            var logger = CBMSFLOW.module('LOGGER')[name];
            if(!logger){
                console.error("logger %s does not exist", name);
            }
            
            var funcs = {};
            if(levels){
                for(var i in logger){
                    if($.inArray(i, levels) == -1){
                        funcs[i] = $.noop;
                    }
                }
            }
            return $.extend({}, logger, funcs);
        },
        Component:{},
        Management:{},
        Group:{}
    });
    
})(jQuery);



//klass
/*
return:
CBMSFLOW_ClASS
usage:
CBMSFLOW.klass('object_module');
CBMSFLOW.klass(extends,statics);
CBMSFLOW.klass(parent_object,extends,statics);
CBMSFLOW.klass('parent_module',extends,statics);
*/
(function($){
    CBMSFLOW.BaseObject = function(){};
    $.fextend(CBMSFLOW.BaseObject, {
        __init__:function(){},
        __meta__:function(){},
        __born__:function(){},
        __setup__:function(){
            this.__group = ['base'];
            this.__events = {};
            this.__locks = {};
            this.__options = {};
            this.__data = {};
        },
        getLock:function(lock_name){
            lock_name = lock_name || '__base';
            this.__locks[lock_name] = true;
        },
        releaseLock:function(lock_name){
            lock_name = lock_name || '__base';
            this.__locks[lock_name] = false;
        },
        isLocked:function(lock_name){
            lock_name = lock_name || '__base';
            return this.__locks[lock_name] === true;
        },
        hasGroup:function(group){
            if(CBMSFLOW.util.inArray(group,this.__group) != -1){
                return true;
            }
            return false;
        },
        addGroup:function(group){
            if(CBMSFLOW.util.inArray(group,this.__group) == -1){
                this.__group.push(group);
            }
        },
        __bindEvent:function(event_name,event_func){
            var events = this.__events[event_name];
            if(events){
                events.push(event_func);
            }
            else{
                this.__events[event_name] = [event_func];
            }
        },
        bind:function(){
            var args = $.makeArray(arguments);
            if(typeof args[0] == 'string'){
                this.__bindEvent(args[0], args[1]);
            }
            else{
                for(var event_name in args[0]){
                    var event_func = args[0][event_name];
                    this.__bindEvent(event_name, event_func);
                }
            }
        },
        unbind:function(event_name,event_func){
            if(event_func == undefined){
                this.__events[event_name] = null;
                delete this.__events[event_name];
            }
            else{
                var index = $.inArray(event_func, this.__events[event_name] || []);
                if(index){
                    this.__events.splice(index, 1);
                }
            }
        },
        unbindAll:function(){
            this.__events = {};
        },
        trigger:function(){
            var args = $.makeArray(arguments);
            var event_name = args.shift();
            var events = this.__events[event_name] || [];
            events = events.concat(this.__object__.__events[event_name] || []);
            for(var i in events){
                if(events[i].apply(this, args) === false){
                    return false;
                }
            }
            return null;
        },
        options:function(){
            var opts = {};
            if(arguments.length == 1){
                opts = arguments[0];
            }
            else if(arguments.length > 1){
                opts[arguments[0]] = arguments[1];
            }
            $.extend(this.__options,opts);
        },
        clearOptions:function(){
            this.__options = {};
        },
        getOption:function(name, default_value){
            var opt = this.__options[name];
            if(opt == undefined){
                opt = default_value;
            }
            return opt;
        },
        getOptions:function(names, default_values){
            var opts = {};
            for(var i in names){
                var opt = this.getOption(names[i]);
                if(opt != undefined){
                    opts[names[i]] = opt;
                }
            }
            return $.extend({}, default_values, opts);
        },
        data: function(){
            var l = arguments.length;
            if(l == 0){
                return this.__data;
            }
            else if(l == 1){
                if(typeof arguments[0] == 'object'){
                    $.extend(this.__data, arguments[0]);
                    return this;
                }
                return this.__data[arguments[0]];
            }
            else{
                this.__data[arguments[0]] = arguments[1];
                return this;
            }
        }
    },{
        __setup__:function(){
            this.__events = {};
        },
        __bindEvent:function(event_name,event_func){
            var events = this.__events[event_name];
            if(events){
                events.push(event_func);
            }
            else{
                this.__events[event_name] = [event_func];
            }
        },
        bind:function(){
            var args = $.makeArray(arguments);
            if(typeof args[0] == 'string'){
                this.__bindEvent(args[0], args[1]);
            }
            else{
                for(var event_name in args[0]){
                    var event_func = args[0][event_name];
                    this.__bindEvent(event_name, event_func);
                }
            }
        },
        unbind:function(event_name,event_func){
            if(event_func == undefined){
                this.__events[event_name] = null;
                delete this.__events[event_name];
            }
            else{
                var index = $.inArray(event_func, this.__events[event_name] || []);
                if(index){
                    this.__events.splice(index, 1);
                }
            }
        }
    });


    $.cextend(CBMSFLOW,{
        klass : function(){
            var args = $.makeArray(arguments);
            var obj = undefined;
            if(args.length > 0){
                if(typeof args[0] == 'string'){
                    if(args.length == 1){
                        obj = CBMSFLOW.module(args[0]);
                    }
                    else{
                        var parent_class = CBMSFLOW.module(args[0]);
                        obj = $.extendclass(parent_class,args[1],args[2]);
                    }
                }
                else{
                    if(args[0].__elass__){
                        obj = $.extendclass(args[0],args[1],args[2]);
                    }
                    else{
                        obj = $.extendclass(CBMSFLOW.BaseObject,args[0],args[1]);
                    }
                }
            }
            return obj;
        }
    });
})(jQuery);

//Static
(function($){
    CBMSFLOW.StaticObject = CBMSFLOW.klass({
        __init__:function(value){
            this.setValue(value);
        },
        __setup__:function(){
            this.addGroup('static');
        },
        getValue:function(){
            return this._instance;
        },
        setValue:function(value){
            this._instance = value;
        }
    });
})(jQuery);

//Environment
(function($){
    CBMSFLOW.module('Environment');
    $.cextend(CBMSFLOW,{
        environment : function(param1, param2){
            if(param1 === undefined){
                return CBMSFLOW.module('Environment');
            }
            if(typeof param1 == 'string'){
                if(param2 !== undefined){
                    var environment = CBMSFLOW.module('Environment');
                    environment[param1] = param2;
                    return param2;
                }
                return CBMSFLOW.module('Environment')[param1];
            }
            else if(typeof param1 == 'object'){
                return CBMSFLOW.extendmodule('Environment',param1);
            }
            return undefined;
        }
    });
})(jQuery);

//Group
(function($){
    CBMSFLOW.module('Group');
    CBMSFLOW.Group.BaseObject = $.extendclass(CBMSFLOW.BaseObject,{
        _name:'base',
        __init__:function(list){
            this._elements = [];
            this.extendArray(list);
        },
        __setup__:function(){
            this.addGroup('group');
        },
        _support:function(element){
            return CBMSFLOW.util.isFunc(element.hasGroup) && element.hasGroup(this._name);
        },
        shift:function(){
            return this._elements.shift();
        },
        unshift:function(element){
            if(this._support(element)){
                this._elements.unshift(element);
            }
        },
        pop:function(){
            return this._elements.pop();
        },
        append:function(element){
            if(this._support(element)){
                this._elements.push(element);
            }
        },
        push:function(element){
            this.append(element);
        },
        uappend:function(element){
            if(!this.inGroup(element)){
                this.append(element);
            }
        },
        upush:function(element){
            this.uappend(element);
        },
        indexOf:function(element){
            if(this._support(element)){
                return this._elements.indexOf(element);
            }
            return -1;
        },
        inGroup:function(element){
            return this.indexOf(element) != -1;
        },
        each:function(func){
            for(var i in this._elements){
                if(func(i, this._elements[i]) === false){
                    break;
                }
            }
        },
        length:function(){
            return this._elements.length;
        },
        takeOut:function(element){
            var index = this.indexOf(element);
            if(index != -1){
                this._elements.splice(index, 1);
                return element;
            }
            return undefined;
        },
        takeOutEach:function(func){
            var l = this.length();
            for(var i=0;i<l;i++){
                func(i,this._elements.shift());
            }
        },
        empty:function(){
            this._elements = [];
        },
        extend:function(){
            var args = $.makeArray(arguments);
            if(args.length == 1){
                var other_group = args[0];
                var self = this;
                if(other_group._name == self._name){
                    other_group.each(function(i,elem){
                        self.push(elem);
                    });
                }
            }
            else{
                for(var i in args){
                    this.extend(args[i]);
                }
            }
            return self;
        },
        extendArray:function(){
            var args = $.makeArray(arguments);
            if(args.length == 1){
                var list = args[0];
                list = list || [];
                for(var i in list){
                    this.push(list[i]);
                }
            }
            else{
                for(var i in args){
                    this.extendArray(args[i]);
                }
            }
            return this;
        },
        deliver:function(other_group, start, end){
            if(other_group._name == this._name){
                start = start || 0;
                end = end || this._elements.length;
                if(start == 0 && end == this._elements.length){
                    other_group.extend(this);
                    this.empty();
                }
                else{
                    other_group.extendArray(this._elements.splice(start, (end - start)));
                }
            }
            return this;
        },
        remove:function(element){
            this.takeOut(element);
        },
        toArray:function(){
            return this._elements;
        },
        isEmpty:function(){
            return this.length() == 0;
        }
    });
})(jQuery);

CBMSFLOW.configLogger({
    'default':{},
    'console':{},
    'alert':{
        'log':function(msg){alert(msg);},
        'info':function(msg){alert(msg);},
        'debug':function(msg){alert(msg);},
        'warning':function(msg){alert(msg);},
        'error':function(msg){alert(msg);}
    },
    'none':{
        'log':$.noop,
        'info':$.noop,
        'debug':$.noop,
        'warning':$.noop,
        'error':$.noop
    },
    'debug':{
        'info':function(msg, infos){
            msg = '[info]' + msg;
            CBMSFLOW.debug(msg, infos, 'info');
        },
        'debug':function(msg, infos){
            msg = '[debug]' + msg;
            CBMSFLOW.debug(msg, infos, 'debug');
        },
        'error':function(msg, infos){
            msg = '[error]' + msg;
            CBMSFLOW.debug(msg, infos, 'error');
        },
        'warning':function(msg, infos){
            msg = '[warning]' + msg;
            CBMSFLOW.debug(msg, infos, 'warning');
        },
        'log':function(msg, infos){
            msg = '[' + CBMSFLOW.util.time() + ']' + msg;
            CBMSFLOW.debug(msg, infos, 'log');
        }
    }
});


if (gettext == undefined){
    var gettext = function(x){return x;};
    var interpolate = CBMSFLOW.util.formatString;
}

