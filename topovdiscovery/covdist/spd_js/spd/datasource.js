var Spd = CBMSFLOW.module("spd");
var compare = CBMSFLOW.module("compare");

Spd.DataSourceInfo = CBMSFLOW.klass({
    __init__:function(container, update_url, info_template){
        this.intervals = {'busy':1000,'free':30000};
        this.container = container;
        // this.info_template = info_template;
        this.update_url = update_url;
        this.initEvents();
        this.updateState();
        this.selectedDataSources = [];
        this.info_template = `<li name="n/a" class="spd-datasource-item " index="" state="n/a">
        <div class="spd-datasource-info-border">
        <div class="spd-datasource-info">
            <div class="spd-datasource-title">
            <div class="spd-datasource-info-desc info-value text-ellipsis text-tip" name="desc">n/a</div>
            <div class="spd-datasource-select">
            </div>
            <div class="spd-datasource-ctl ">
                <i class="spd-datasource-ctl-export spd-icon  "></i>
                <i class="spd-datasource-ctl-rename spd-icon spd-icon-rename"></i>
                <i class="spd-datasource-ctl-delete spd-icon spd-icon-delete"></i>
                <i class="spd-datasource-ctl-stop spd-icon spd-icon-stop"></i>
            </div>
            </div> 
            <ul>
            <li>
                <div class="spd-datasource-info-label">起始时间：</div>
                <div class="spd-datasource-info-value" name="start_time">n/a</div>
            </li>
            <li>
            <div class="spd-datasource-info-label">持续时间：</div>
                <div class="spd-datasource-info-value" name="duration">n/a</div>
            </li>
            <li>
                <div class="spd-datasource-info-label">数据源：</div>
                <div class="spd-datasource-info-value" name="type">n/a</div>
            </li>
            <li>
                <div class="spd-datasource-info-label">IP 地址：</div>
                <div class="spd-datasource-info-value" name="host">n/a</div>
            </li>
            <li>
                <div class="spd-datasource-info-label">接口：</div>
                <div class="spd-datasource-info-value" name="intf">n/a</div>
            </li>
            <li>
                <div class="spd-datasource-info-label">IP 数量：</div>
                <div class="spd-datasource-info-value" name="ip_count">n/a</div>
            </li>
            <li>
                <div class="spd-datasource-info-label">会话数：</div>
                <div class="spd-datasource-info-value" name="convs_count">n/a</div>
            </li>
            <li>
                <div class="spd-datasource-info-label">空间占用：</div>
                <div class="spd-datasource-info-value" name="disk_space">n/a</div>
            </li>
            <li >
                <div class="spd-datasource-info-label">状态：</div>
                <div class="spd-datasource-info-value" name="state_desc"></div>
            </li>
            </ul>
        </div>
        <div class="spd-datasource-box-shadow"></div>
        </div>
        </li>`;
    },
    delete:function(name){
        this.container.children("[name='"+name+"']").remove();
    },
    append:function(name){
        var $info = $(this.info_template);
        $info.attr("name",name);
        this.container.append($info);
        return $info;
    },
    render_info:function(data){
        if(!data.name){
            return;
        }
        var $info = this.container.children("[name='"+data.name+"']");
        if($info.length == 0){
            $info = this.append(data.name);
        }
        if(data.active){
            $info.addClass("active");    
        }
        else{
            $info.removeClass("active");
        }
        if(data.state == "running"){
            $(".spd-datasource-ctl",$info).addClass("running");
        }
        else{
            $(".spd-datasource-ctl",$info).removeClass("running");
        }
        if(data.state == "done"){
            $(".spd-datasource-ctl-export",$info).addClass("spd-icon-export");
        }
        else{
            $(".spd-datasource-ctl-export",$info).removeClass("spd-icon-export");
        }

        $info.attr('state', data.state);

        $(".info-value, .spd-datasource-info-value",$info).each(function(){
            $(this).html(data[$(this).attr("name")]);
        });
        $info.attr("index", data.index);
        $info.addClass("updated");
    },
    sort:function(){
        
    },
    render:function(data){
        data = JSON.parse(data.data);
        for(var i in data){
             this.render_info(data[i]);
             console.log(data[i],i)
        }
        this.container.children(":not(.updated)").remove();
        this.container.children().removeClass("updated");
        this.sort();
        this.updateState();
    },
    stop:function(){
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    },
    start:function(){
        if(!this.timer){
            this.timer = setTimeout($.proxy(this._refresh, this), this.intervals[this.state]);
        }
    },
    initInterval:function(){
        this.stop();
        this.start();
    },
    _refresh:function(){
        var _this = this;
        _this.stop();
        $.ajax({
            'async':false,
            'url':this.update_url,
            'data':{},
            'dataType':'json',
            'success': function(json){
                _this.render(json);
                _this.start();
            }
        });
    },
    refresh:function(){
        this._refresh();
    },
    updateState:function(){
        var old_state = this.state;
        this.state = $(".running", this.container).length > 0?'busy':'free';
        if(old_state != this.state){
            this.initInterval();
        }
    },
    initEvents:function(){
        var _this = this;
        $("#snapshot-btn").on("click",function(){
            var isRef = "true";
            window.localStorage.setItem("isRef",isRef);
            window.location.href="#snapshot";
        });
        $(".spd-datasource-item ul",this.container).live("click",function(e){
            var evdata = CBMSFLOW.environment('permissionData');
            var permissionData = evdata === undefined ? JSON.parse(window.localStorage.getItem('permissionData')) : evdata;
            var ifSpdPathDiagramDetail = permissionData.spd_path_diagram_detail; // 查看网路侦测服务路径图
            if(!ifSpdPathDiagramDetail){
                return
            }
            $(this).addClass('active').siblings('.spd-datasource-item').removeClass('active');
            var item = $(this).parents('.spd-datasource-item');
            _this.trigger("datasource.load", item.attr("name"), item.attr('state'), $('.spd-datasource-info-desc', item).text());
        });
        $(".spd-datasource-item",this.container).live({
            "mouseenter":function(){
                $(this).addClass("hover");
            },'mouseleave':function(){
                $(this).removeClass("hover");
            }
        });
        $(".spd-datasource-ctl-rename",this.container).live("click",function(e){
            e.stopPropagation();
            var item = $(this).parents(".spd-datasource-item");
            _this.trigger("datasource.rename", item.attr("name"), item.find(".spd-datasource-info-desc").html());
            return false;
        });
        $(".spd-icon-export",this.container).live("click",function(e){
            e.stopPropagation();
            var item = $(this).parents(".spd-datasource-item");
            _this.trigger("datasource.export", item.attr("name"), item.find(".spd-datasource-info-desc").html());
            return false;
        });
        $(".spd-icon-select",this.container).live("click",function(e){
            e.stopPropagation();
            // e.target.classList.toggle('selected');
            var item = $(this).parents(".spd-datasource-item");
            _this.trigger(
                "datasource.select",
                item.attr("name"),
                item.find(".spd-datasource-info-desc").html(),
                item.find("[name=state_desc]").html(),
                item.find("[name=ip_count]").html(),
            );
            return false;
        });
        $(".spd-datasource-ctl-delete",this.container).live("click",function(e){
            e.stopPropagation();
            var item = $(this).parents(".spd-datasource-item");
            _this.trigger("datasource.delete", item.attr("name"), item.find(".spd-datasource-info-desc").html());
            return false;
        });
        $(".spd-datasource-ctl-stop",this.container).live("click",function(e){
            e.stopPropagation();
            var item = $(this).parents(".spd-datasource-item");
            _this.trigger("datasource.stop", item.attr("name"), item.find(".spd-datasource-info-desc").html());
            return false;
        });
        $("#compare-btn").live("click",function(e){
            e.stopPropagation();
            console.log('compare', _this.selectedDataSources);
            // e.target.classList.toggle('selected');
            _this.trigger("datasource.compare", _this.selectedDataSources);
            return false;
        });
        $("#compare-btn-popup").live("click",function(e){
            var Compare = new compare(123);
        });
        this.bind({
            'datasource.rename':$.proxy(this.renameDataSource, this),
            'datasource.export':$.proxy(this.exportDataSource, this),
            'datasource.load':$.proxy(this.loadDataSource, this),
            'datasource.delete':$.proxy(this.deleteDataSource, this),
            'datasource.stop':$.proxy(this.stopDataSource, this),
            'datasource.select':$.proxy(this.selectDataSource, this),
            'datasource.compare':$.proxy(this.compareDataSources, this),
        });
        CBMSFLOW.environment('frameDispatch').bind("frame.change", function(name){
            if(name == 'datasource'){
                _this.refresh();
            }
            else{
                _this.stop();
            }
        });
        CBMSFLOW.DataSource.CollectDataSourcePopup.bind({
            "show":function(){
                _this.stop();
            },
            "hide":function(){
                _this.refresh();
            }
        });
    },
    renameDataSource:function(name, desc){
        var _this = this;
        if(!this.isLocked("rename-popup")){
            $('#rename_datasource_popup .close').click(function(){
                _this.refresh();
            });
            this.getLock("rename-popup");
        }
        this.stop();
        $('#rename_datasource_popup').attr('datasource', name);
        $('#rename_datasource_popup').attr('desc', desc);
        $('#rename_datasource_popup').modal({'keyboard': false, 'backdrop': 'static', 'show': true}).trigger('setDefault');
        $('.modal-backdrop.in').css('opacity',0.5);
    },
    exportDataSource:function(name, desc){
        var _this = this;
        if(!this.isLocked("rename-popup")){
            $('#export-datasource-popup .close').click(function(){
                _this.refresh();
            });
            this.getLock("rename-popup");
        }
        this.stop();
        $('#export-datasource-popup').attr('datasource', name);
        $('#export-datasource-popup').attr('desc', desc);
        $('#export-datasource-popup').modal({'keyboard': false, 'backdrop': 'static', 'show': true}).trigger('setDefault');
        $('.modal-backdrop.in').css('opacity',0.5);
    },
    loadDataSource:function(name, state, desc){
        var _this = this;
        if(!this.isLocked("load-popup")){
            $('#load_datasource_popup .close').click(function(){
                _this.refresh();
            });
            this.getLock("load-popup");
        }
        this.stop();
        if(state == 'running'){
            $('#load_datasource_popup').find('.info .datasource').text(desc);
            $('#load_datasource_popup').modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity',0.5);
        }else{
            var frameDispatch = CBMSFLOW.environment('frameDispatch');
            var lastDataSourceName = CBMSFLOW.environment('datasource_name');
            // 跳转至map
            if(name != lastDataSourceName || CBMSFLOW.environment('compareMode') ){
                CBMSFLOW.environment('datasource_name', name);
                CBMSFLOW.environment('compareMode', false);
                CBMSFLOW.environment('active_datasource', this.getDatasouce(name));
//              var mapName = CBMSFLOW.environment().map_name;
//              window.location.href = '/zh-cn/spd/'+mapName+'/filter/'+name+'/view/';
                window.localStorage.setItem("spdName",name);
                frameDispatch.toggle('map', true);
            }else{
                CBMSFLOW.environment('compareMode', false);
                window.localStorage.setItem("spdName",name);
                frameDispatch.toggle('map', true);
//              var mapName = CBMSFLOW.environment().map_name;
//              window.location.href = '/zh-cn/spd/'+mapName+'/filter/'+name+'/view/';
            }

        }
    },
    deleteDataSource:function(name, desc){
        var _this = this;
        if(!this.isLocked("delete-popup")){
            $('#delete_datasource_popup .close').click(function(){
                _this.refresh();
            });
            this.getLock("delete-popup");
        }
        this.stop();
        $('#delete_datasource_popup').attr('datasource', name);
        $('#delete_datasource_popup').trigger('setDefault', [desc]).modal({'keyboard': false, 'backdrop': 'static', 'show': true});
        $('.modal-backdrop.in').css('opacity',0.5);
    },
    stopDataSource:function(name, desc){
        var _this = this;
        if(!this.isLocked("stop-popup")){
            $('#stop_datasource_popup .close').click(function(){
                _this.refresh();
            });
            this.getLock("stop-popup");
        }
        this.stop();
        $('#stop_datasource_popup').attr('datasource', name);
        $('#stop_datasource_popup').trigger('setDefault', [desc]).modal({'keyboard': false, 'backdrop': 'static', 'show': true});
        $('.modal-backdrop.in').css('opacity',0.5);
    },

    getDatasouce:function(name){
        var ele = this.container.find('li[name=' + name + ']');
        var ipCount = ele.find('div[name=ip_count]').text();
        return {'name' : name, 'ip_count' : ipCount};
    },

    selectDataSource: function (name, desc, state_desc, ip_count) {
        // select dataSource
        
        $('li.spd-datasource-item .spd-icon-select').removeClass('selected');

        console.log('select', name, desc);

        if (this.selectedDataSources[0] && $('li[name=' + this.selectedDataSources[0].name + ']').length === 0) {
            this.selectedDataSources.shift();
        } else if (this.selectedDataSources[1] && $('li[name=' + this.selectedDataSources[1].name + ']').length === 0){
            this.selectedDataSources.pop();
        }
        
        if (this.selectedDataSources[0] && this.selectedDataSources[0].name === name){
            this.selectedDataSources.shift();
        } else if (this.selectedDataSources[1] && this.selectedDataSources[1].name === name) {
            this.selectedDataSources.pop();
        } else {
            if (this.selectedDataSources.length < 2) {
                this.selectedDataSources.push({ name: name, desc: desc, state_desc: state_desc, ip_count: ip_count });
            } else {
                this.selectedDataSources[1] = { name: name, desc: desc, state_desc: state_desc, ip_count: ip_count };
            }
        }

        $.each(this.selectedDataSources, function(index, sd){
            $('i.spd-icon-select', 'li[name=' + sd.name + ']').addClass('selected');
        });

        if (this.selectedDataSources.length < 2) {
            $("#compare-btn").addClass('disabled');
        } else {
            $("#compare-btn").removeClass('disabled');
        }

        console.log('selected', this.selectedDataSources);
    },
    compareDataSources: function(selectedDataSources) {
        // console.log('selected', selectedDataSources);
        // //test
        // selectedDataSources = [{
        // desc: "数据源01",
        // ip_count: "54",
        // name: "datasource_1",
        // state_desc: "已完成(100.0%)"}
        // ,{
        //     desc: "数据源02",
        //     ip_count: "59",
        //     name: "datasource_2",
        //     state_desc: "已完成(100.0%)"
        // }
        // ];
        // if (selectedDataSources.length < 2) {
        //     return;
        // }

        // if (selectedDataSources[0].state_desc.indexOf('100') < 0 || selectedDataSources[1].state_desc.indexOf('100') < 0) {
        //     this.alertWindow('包含异常数据，不可对比。');
        //     return;
        // }

        // if (+selectedDataSources[0].ip_count === 0 || + selectedDataSources[1].ip_count === 0) {
        //     this.alertWindow('包含空数据，不可对比。');
        //     return;
        // }

        // selectedDataSources[0].desc = $('li[name=' + selectedDataSources[0].name + ']').find(".spd-datasource-info-desc").html();
        // selectedDataSources[1].desc = $('li[name=' + selectedDataSources[1].name + ']').find(".spd-datasource-info-desc").html();

        // CBMSFLOW.environment('datasource_name', selectedDataSources[0].name);
        // CBMSFLOW.environment('compareMode', true);
        // CBMSFLOW.environment('compared', selectedDataSources);
        // CBMSFLOW.environment('frameDispatch').toggle('map', true);
    },

    alertWindow: function(alert_content, flag) {
        var self = this;
        d3.select(".alert-back-div").remove();
    
        var alert_back_div = d3
            .select("body")
            .append("div")
            .attr("class", "alert-back-div");
        var alert_div = alert_back_div.append("div").attr("class", "alert-div");
        //提示框的title
        var alert_title_div = alert_div
            .append("div")
            .attr("class", "alert-title-div");
        alert_title_div
            .append("span")
            .attr("class", "alert-title-span")
            .text("提示");
        //提示的主体部分
        alert_div
            .append("div")
            .attr("class", "alert-body-div")
            .html(alert_content);
        //是否有操作的弹窗
        if (flag) {
            //提示的尾部
            var alert_foot_div = alert_div
                .append("div")
                .attr("class", "alert-foot-div");
            alert_foot_div
                .append("button")
                .attr({
                    class: "determine-btn alert-btn"
                })
                .text("确定");
            alert_foot_div
                .append("button")
                .attr({
                  class: "cancle-btn alert-btn"
                })
                .text("取消");
        } else {
            //title部分的关闭按钮
            alert_title_div
                .append("span")
                .attr({
                    class: "alert-title-img alert-btn"
                })
                .text("x");
        }
        d3.selectAll(".alert-btn").each(function() {
            this.addEventListener(
                "click",
                function() {
                    self.closeAlertWindow(this);
                },
            false
            );
        });
    },
    
    closeAlertWindow: function(this_btn) {
        d3.select(".alert-back-div").remove();
        return d3.select(this_btn).text() == "确定";
    }
});
