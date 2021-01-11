var Spd = CBMSFLOW.module('spd');

CBMSFLOW.module('spd.Dispatch');
Spd.Dispatch.FrameDispatch = CBMSFLOW.klass({
    /*
     * router:{
     *     frame_name:{
     *          [ajax_options],
     *          frameOpen:[function],
     *          frameAsync:[boolean],
     *          frameCache:[boolean]
     *     }
     * }
     */
    __init__: function(container, router){
        var _this = this;
        this.active_frame = null;
        this.menu = new Spd.Menu.FrameMenu();
        this.menu.bind("toggle",function(name){
            _this.frameChange(name);
        });
        this.router = router || {};
        this.frames = [];
        this.ajax_callers = {};
        this.bindEvents();
    },

    bindEvents: function() {
        var self = this;
        window.onhashchange = function() {
            var hashTag = CBMSFLOW.util.get_hashtag();
            if (hashTag) {
                self.toggle(hashTag);
            }
        }
    },

    toggle:function(name, force){
        force = force || false;
        if(force){
            this.removeFrame('map');
        }
        this.menu.toggle(name);
    },
    removeFrame: function(name){
        var index = this.frames.indexOf(name);
        if(index != -1){
            this.frames.splice(index, 1);
        }
    },
    loading:function(name){
        var img_src = CBMSFLOW.util.make_spd_static_src('spd_img/loading.gif');
        var loading_elem = $("<div class='spd-loading'><div class='spd-loading-inner'><img src='"+ img_src +"'/><span>" + gettext("加载中") + "...</span></div></div>");
        this.menu.getFrame(name).empty().append(loading_elem);
        //var margin_top = Math.floor(($(window).height() - loading_elem.offset().top - loading_elem.height())/3);
        //loading_elem.css("margin-top",Math.max(0,margin_top)+"px");
    },
    frameOpen: function(name){
        if(name){
            var routerInfo = this.router[name] || {};
            var frame_open = routerInfo['frameOpen'] || function(){};
            frame_open(this.menu.getFrame(name));
            this.trigger("frame.open", name);
        }
    },
    frameClose: function(name){
        if(name){
            var routerInfo = this.router[name] || {};
            var frame_close = routerInfo['frameClose'] || function(){};
            frame_close(this.menu.getFrame(name));
            this.trigger("frame.close", name);
        }
    },
    frameChange: function(name){
        this.trigger("frame.change", name);
        this.ajaxAbort();
        if($.inArray(name, this.frames) == -1){
            this.frameClose(this.active_frame);
            this.active_frame = name;
            this.loading(name);
            var _this = this;
            var routerInfo = this.router[name];
            var url = routerInfo['url'];
            var query = routerInfo['query'] || {};
            var type = routerInfo['type'] || 'GET';
            var frameCache = routerInfo['frameCache'] == false ? false : true;
            if(query){
                if($.isFunction(query)){
                    query = query();
                }
            }
            if(CBMSFLOW.environment('loadSnapshot')){
                // debugger;
                query["map_data"] = JSON.stringify(CBMSFLOW.environment('snapshot_map').snapshot_map_data);
                // delete query.datasource;
                CBMSFLOW.environment('loadSnapshot', null);
            }
            this.ajax_callers[name] = $.ajax({
                url:url,
                type:type,
                data:query,
                success:function(html){
                    _this.menu.getFrame(name).html(html);
                    if(frameCache){
                        _this.frames.push(name);
                    }
                    delete _this.ajax_callers[name];

                    if ( CBMSFLOW.environment('combined')){
                        var tbody = $('#combing-table .combing-table-content .body tbody');
                        
                        var tableTemplate = "<% _.each(iplist, function(item, i) { %> "
                        +"<tr>"
                        +"    <td class='seq'><%=i+1%></td>"
                        +"    <td class='component'><%=item.component%></td>"
                        +"    <td class='ipaddr'><%=item.ipaddr%></td>"
                        +"    <td class='equipment'><%=item.equipment%></td>"
                        +"    <td class='port'><%=item.port%></td>"
                        +"    <td class='componentB'><%=item.componentB%></td>"
                        +"    <td class='ipaddrB'><%=item.ipaddrB%></td>"
                        +"    <td class='equipmentB'><%=item.equipmentB%></td>"
                        +"    <td class='portB'><%=item.portB%></td>"
                        +"    <td class='atob'><%=item.A2B%></td>"
                        +"    <td class='btoa'><%=item.B2A%></td>"
                        +"    <td class='allb'><%=item.allbyte%></td>"
                        +"    <td class='usability'><%=item.usability%></td>"
                        +"    <td class='pattern'><%=item.pattern%></td>"
                        +"    <td class='zonebit'><%=item.zonebit%></td>"
                        +"    <td class='proto'><%=item.proto%></td>"
                        +"</tr>"
                        +"<% }); %>";
            
                        tbody.empty();
                        tbody.html(_.template(tableTemplate, {'iplist':  CBMSFLOW.environment('combinedRelation')}));
                    }

                    _this.frameOpen(name);
                },
                error:function(error){
                    if(error.statusText != "abort"){
                        if(CBMSFLOW.environment("DEBUG")){
                            CBMSFLOW.debug('error in frame change', error);
                        }
                    }
                    delete _this.ajax_callers[name];
                }
            });
        }else{
            this.frameOpen(name);
        }
    },
    ajaxAbort:function(){
        for(var i in this.ajax_callers){
            this.ajax_callers[i].abort();
        }
        this.ajax_callers = {};
    }
});
