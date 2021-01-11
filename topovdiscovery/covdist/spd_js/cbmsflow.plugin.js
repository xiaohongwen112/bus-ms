var pl = CBMSFLOW.module("plugin");

pl.PopupAbstract = CBMSFLOW.klass({
    __init__: function(options){
        this.options($.extend(this.__object__.defaultOptions, options));
    },
    popup: function(){},
    render: function(){},
    getPos: function(){},
    setPos: function(pos){}
}, {
    defaultOptions:{
        
    }
});


