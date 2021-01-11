CBMSFLOW.module('Math');

CBMSFLOW.Math.IteratorAbstract = CBMSFLOW.klass({
    index: function(){
    },
    empty: function(){
    },
    next: function(){
    },
    iter: function(iterBy){
        return new CBMSFLOW.Math.Iterator(this, iterBy);
    },
    each: function(callback){
        while(true){
            if(this.empty() || false === callback(this.index(), this.next())) break;
        }
    },
    toArray: function(){
        var l = [];
        this.each(function(v){
            l.push(v);
        });
        return l;
    }
});

CBMSFLOW.Math.IArray = CBMSFLOW.klass(CBMSFLOW.Math.IteratorAbstract, {
    __init__: function(list){
        this._v = list;
        this._l = list.length;
        this._i = 0;
        this._n = undefined;
        this.next();
    },
    index: function(){
        return this._i - 1;
    },
    empty: function(){
        return this.index() == this._l;
    },
    next: function(){
        var v = this._n;
        this._n = undefined;
        if(!this.empty()){
            this._n = this._v[this._i ++];
        }
        return v;
    }
});

CBMSFLOW.Math.Iterator = CBMSFLOW.klass(CBMSFLOW.Math.IteratorAbstract, {
    __init__: function(source, iterBy){
        if($.isArray(source)){
            this._s = new CBMSFLOW.Math.IArray(source);
        }
        else{
            this._s = source;
        }
        this._i = 0;
        this._n = undefined;
        this._empty = false;
        this._ib = iterBy || function(i, v, y){y(v);};
        this._y = $.proxy(this._yield, this);
        this.next();
    },
    _yield: function(v){
        this._n = v;
        this._i ++;
    },
    _next: function(){
        return this._ib(this._s.index(), this._s.next(), this._y);
    },
    index: function(){
        return this._i - 1;
    },
    empty: function(){
        return this._empty;
    },
    next: function(){
        var v = this._n;
        var i = this._i;
        this._n = undefined;
        while(true){
            if(this._s.empty()){
                this._empty = true;
            }
            if(this.empty()){
                break;
            }
            if(false === this._next()){
                break;
            }
            if(i != this._i){
                break;
            }
        }
        return v;
    }
},{
    make: function(source, iterBy){
        return new CBMSFLOW.Math.Iterator(source, iterBy);
    }
});


CBMSFLOW.Math.UArray = CBMSFLOW.klass({
    __init__: function(list, sortBy){
        this._v = [];
        this._s_v = [];
        this._s_f = sortBy || function(m,n){
            if(m > n){
                return 1;
            }
            else if(m < n){
                return -1;
            }
            return 0;
        };
        list = list || [];
        for(var i = 0;i<list.length;i++){
            this.insert(list[i]);
        }
    },
    _insert: function(i, value){
        this._s_v.splice(i,0,value);
        this._v.push(value);
    },
    _compare: function(m, n){
        return this._s_f(m,n);
    },
    _bsearch: function(l, r, v){
        if(l >= r){
            return l - 0.5;
        }
        var i = Math.floor((l + r) / 2);
        var c = this._compare(this._s_v[i], v);
        if(c == 0){
            return i;
        }
        else if(c < 0){
            return this._bsearch(i + 1, r, v);
        }
        else{
            return this._bsearch(l, i, v);
        }
    },
    sortIndexOf: function(value){
        return this._bsearch(0, this._s_v.length, value);
    },
    insert: function(value){
        var i = this.sortIndexOf(value);
        if(parseInt(i) != i){
            var insert_i = i + 0.5;
            this._insert(insert_i, value);
        }
    },
    indexOf: function(value, absolute){
        if(absolute){
            return this._v.indexOf(value);
        }
        else{
            for(var i = 0;i<this._v.length;i++){
                if(this._compare(this._v[i], value) == 0){
                    return i;
                }
            }
            return -1;
        }
    },
    has: function(value, absolute){
        return this.indexOf(value, absolute) != -1;
    },
    toArray: function(){
        var list = [];
        for(var i=0;i<this._v.length;i++){
            list.push(this._v[i]);
        }
        return list;
    },
    value: function(){
        return this._v;
    },
    extend: function(list){
        for(var i=0;i<list.length;i++){
            this.insert(list[i]);
        }
    },
    empty: function(list){
        return this._v.length == 0;
    },
    length: function(){
        return this._v.length;
    }
});


CBMSFLOW.Math.SUArray = CBMSFLOW.klass(CBMSFLOW.Math.UArray, {
    __init__: function(list, sortBy){
        list = list || [];
        this._s_f = sortBy || function(m,n){
            if(m > n){
                return 1;
            }
            else if(m < n){
                return -1;
            }
            return 0;
        };
        this._v = [];
        this._s_v = this._v;
        if(list.length > 0) this.extend(list);
    },
    _extend: function(sortArray){
        var s_v = this._s_v;
        this._s_v = [];
        while(true){
            if(sortArray.length == 0){
                while(true){
                    if(s_v.length == 0){
                        break;
                    }
                    this._s_v.push(s_v.shift());
                }
                break;
            }
            else if(s_v.length == 0){
                if(this._s_v.length == 0){
                    this._s_v.push(sortArray.shift());
                }
                while(true){
                    if(sortArray.length == 0){
                        break;
                    }
                    var v = sortArray.shift();
                    if(this._compare(v, this._s_v[this._s_v.length - 1]) != 0){
                        this._s_v.push(v);
                    }
                }
                break;
            }
            else{
                var m = s_v[0];
                var n = sortArray[0];
                var comp = this._compare(m,n);
                if(comp < 0){
                    if(this._compare(m, this._s_v[this._s_v.length - 1]) != 0){
                        this._s_v.push(m);
                    }
                    s_v.shift();
                }
                else if(comp > 0){
                    if(this._compare(n, this._s_v[this._s_v.length - 1]) != 0){
                        this._s_v.push(n);
                    }
                    sortArray.shift();
                }
                else{
                    if(this._compare(n, this._s_v[this._s_v.length - 1]) != 0){
                        this._s_v.push(n);
                    }
                    s_v.shift();
                    sortArray.shift();                    
                }
            }
        }
        this._v = this._s_v;
    },
    _insert: function(i, value){
        this._v.splice(i,0,value);
    },
    indexOf: function(value, absolute){
        if(absolute){
            return this._v.indexOf(absolute);
        }
        else{
            var i = this.sortIndexOf(value);
            if(parseInt(i) != i){
                i = -1;
            }
            return i;
        }
    },
    remove: function(value, absolute){
        var i = this.indexOf(value, absolute);
        if(i != -1){
            this._v.splice(i,1);
            return true;
        }
        return false;
    }
    /*
    extend: function(list, sorted){
        sorted = sorted || false;
        list = _.toArray(list || []);
        if(!sorted) list.sort(this._s_f);
        this._extend(list);
    }
    */
});
