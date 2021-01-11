CBMSFLOW.module("SPD");

CBMSFLOW.SPD.env = function(settings){
    settings = settings || {};
    CBMSFLOW.environment({
        'SPD.URL.STATIC': settings['static_url'] || '/static/',
        'SPD.URL.ROOT': settings['root_url'] || '/',
        'DEBUG': settings['debug'] || false,
        'PERMISSION.PCAP.EXPORT': settings['pcap_export'] || false,
        'SPD.PROTOCOL': settings['enable_protocol'] || false
    });
};


CBMSFLOW.extendmodule('util', {
    make_spd_static_src: function(src){
        return this.prefix_i18n_url(this.urlJoin(CBMSFLOW.environment('SPD.URL.STATIC'), src));
    },
    prefix_spd_root_url: function(url){
        return this.urlJoin(CBMSFLOW.environment('SPD.URL.ROOT'), url);
    },
    format_spd_i18n_url: function(url, obj, named){
        if(!url || typeof url != 'string'){
            url = '/';
        }
        url = this.formatString(url, obj, named);
        if(this.is_i18n_url(url)){
            return url;
        }
        else{
            return this.prefix_i18n_url(this.prefix_spd_root_url(url));
        }
    },
    make_spd_i18n_url: function(url, query){
        return this.format_spd_i18n_url(this.makeUrl(url, query));
    },

    to_hash_url: function(hashTag) {
        if (hashTag) {
            window.location = '#' + hashTag;
        }
    },

    get_hashtag: function() {
        var hash = window.location.hash;
        hash = hash.substr(1);
        return hash;
    }
});


(function(){
    var t = null;
    function show_message(msg){
        var $p = $("#spd-body-content");
        var $m = $("#spd-body-content .spd-message");
        if(t){
            clearTimeout(t);
            t = null;
        }
        $m.children().html(msg);
        $m.show();
        var l = $p.offset().left + ($p.width() - $m.width())  / 2;
        $m.offset({"left":l});
        t = setTimeout(function(){$m.slideUp("hide");}, 5000);
    }

    CBMSFLOW.setLogger('spd.message', {
        'info': function(msg){
            show_message(msg);
        }
    });
})();


//init spd ui
$(function(){
    CBMSFLOW.SPD.fontutil = CBMSFLOW.klass({},{
        __setup__: function(){
            $("body").append("<div id='cf-spd-fontutil' style='height:0px;width:0px;position:relative;overflow:hidden;'></div>");

        },
        getUtilContainer: function(){
            return $("#cf-spd-fontutil");
        },
        getTextWidth:function($elem){
            var html = $elem.html();
            var fontcsslist = [
                'font-family',
                'font-size',
                'font-weight'
            ];
            var fontcss = {};
            _.map(fontcsslist, function(cssname){
                var css = $elem.css(cssname);
                if(css){
                    fontcss[cssname] = css;
                }
            });
            var container = this.getUtilContainer();
            var fontutilcontainer = $("<div></div>").appendTo(container);
            fontutilcontainer.html(html);
            fontutilcontainer.css($.extend(fontcss,
            {
                'width':'auto',
                'height':'auto',
                'position':'absolute',
                'left':'-9999px'
            }));
            var width = fontutilcontainer.width();
            fontutilcontainer.remove();
            return width;
        }
    });

    $(".text-tip").live({
        'mouseenter':function(){
            var text_w = CBMSFLOW.SPD.fontutil.getTextWidth($(this));
            if(text_w > $(this).width()){
                $(this).attr('data-original-title',$(this).text()).tooltip({
                    'trigger':'manual'
                }).tooltip('show');
            }
            else{
                $(this).attr('data-original-title','').tooltip('hide');
            }
        },
        'mouseleave':function(){
            $(this).tooltip('hide');
        },
        'remove':function(){
            $(this).tooltip('hide');
        }
    });

});
